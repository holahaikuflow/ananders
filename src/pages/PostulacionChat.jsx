import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const STATUS_COLORS = {
  enviada:    { bg: '#F4F1EA', color: '#5C8A72' },
  aceptada:   { bg: '#EAFAF0', color: '#1A6B3C' },
  rechazada:  { bg: '#FEF0EB', color: '#C84A1A' },
  concretada: { bg: '#EAF0FA', color: '#1A3C6B' },
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return (
    d.toLocaleDateString([], { day: '2-digit', month: 'short' }) +
    ' ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )
}

function Avatar({ foto, nombre, size = 36 }) {
  const initial = (nombre ?? '?').charAt(0).toUpperCase()
  if (foto) {
    return (
      <img
        src={foto}
        alt={nombre}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 font-nunito font-semibold uppercase"
      style={{ width: size, height: size, background: '#2D5242', color: '#F5F0D8', fontSize: Math.round(size * 0.38) }}
    >
      {initial}
    </div>
  )
}

export default function PostulacionChat() {
  const { id } = useParams()
  const { t } = useLang()
  const { user, profile } = useAuth()

  const [appData, setAppData] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  function scrollToBottom(behavior = 'smooth') {
    bottomRef.current?.scrollIntoView({ behavior })
  }

  // Carga inicial
  useEffect(() => {
    if (!user || !id) return
    let cancelled = false

    async function load() {
      const [{ data: app }, { data: msgs }] = await Promise.all([
        supabase
          .from('applications')
          .select(`
            id, estado, mensaje_inicial, seeker_id, created_at,
            exp:experience_id (
              titulo, facilitator_id,
              facilitator_profile:facilitator_id ( nombre, foto )
            ),
            seeker_profile:seeker_id ( nombre, foto )
          `)
          .eq('id', id)
          .single(),
        supabase
          .from('messages')
          .select('id, sender_id, contenido, created_at')
          .eq('application_id', id)
          .order('created_at', { ascending: true }),
      ])

      if (cancelled) return
      if (!app) { setNotFound(true); setLoading(false); return }
      setAppData(app)
      setMessages(msgs ?? [])
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user?.id, id])

  // Scroll al cargar
  useEffect(() => {
    if (!loading) scrollToBottom('instant')
  }, [loading])

  // Realtime
  useEffect(() => {
    if (!id) return
    const channel = supabase
      .channel(`chat-app-${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `application_id=eq.${id}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
          scrollToBottom()
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [id])

  async function handleSend() {
    const text = input.trim()
    if (!text) { setInputError(t('chat_error_empty')); return }
    setSending(true)
    setSendError('')
    setInputError('')

    const { data: newMsg, error } = await supabase
      .from('messages')
      .insert({ application_id: id, sender_id: user.id, contenido: text })
      .select('id, sender_id, contenido, created_at')
      .single()

    setSending(false)
    if (error) { setSendError(t('chat_error_send')); return }

    setMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev
      return [...prev, newMsg]
    })
    setInput('')
    scrollToBottom()
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-alba">
        <p className="font-nunito text-sm text-moss">…</p>
      </main>
    )
  }

  // ── Not found / no access ──
  if (notFound) {
    const backTo = profile?.rol === 'facilitator' ? '/mis-experiencias' : '/mis-postulaciones'
    const backKey = profile?.rol === 'facilitator' ? 'chat_back_facilitator' : 'chat_back_seeker'
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 bg-alba text-center">
        <p className="font-josefin uppercase text-jungle" style={{ letterSpacing: '0.1em', fontSize: '1rem' }}>
          {t('chat_not_found')}
        </p>
        <p className="font-nunito text-sm text-moss max-w-xs">{t('chat_not_found_body')}</p>
        <Link
          to={backTo}
          className="font-nunito font-semibold uppercase text-xs"
          style={{ letterSpacing: '0.16em', color: '#E8620A' }}
        >
          {t(backKey)}
        </Link>
      </main>
    )
  }

  const amSeeker = user.id === appData.seeker_id
  const otherParty = amSeeker ? appData.exp?.facilitator_profile : appData.seeker_profile
  const otherName = otherParty?.nombre ?? '—'
  const otherFoto = otherParty?.foto ?? null
  const expTitulo = appData.exp?.titulo ?? '—'
  const statusColors = STATUS_COLORS[appData.estado] ?? STATUS_COLORS.enviada
  const backTo = amSeeker ? '/mis-postulaciones' : '/mis-experiencias'
  const backKey = amSeeker ? 'chat_back_seeker' : 'chat_back_facilitator'

  const openingMsg = appData.mensaje_inicial
    ? {
        id: '__opening__',
        sender_id: appData.seeker_id,
        contenido: appData.mensaje_inicial,
        created_at: appData.created_at,
        isOpening: true,
      }
    : null

  const allMessages = openingMsg ? [openingMsg, ...messages] : messages

  return (
    <div className="flex flex-col bg-alba" style={{ height: '100dvh' }}>

      {/* ── Header ── */}
      <div
        className="flex-shrink-0 bg-white px-5 py-4"
        style={{ borderBottom: '0.5px solid rgba(232,98,10,0.12)' }}
      >
        <div className="max-w-xl mx-auto">
          <Link
            to={backTo}
            className="font-nunito font-semibold uppercase transition-colors mb-3 inline-block"
            style={{ letterSpacing: '0.16em', fontSize: '0.72rem', color: '#5C8A72' }}
          >
            {t(backKey)}
          </Link>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar foto={otherFoto} nombre={otherName} size={36} />
              <div className="min-w-0">
                <p
                  className="font-josefin uppercase text-jungle truncate"
                  style={{ letterSpacing: '0.08em', fontSize: '0.85rem' }}
                >
                  {otherName}
                </p>
                <p className="font-nunito text-xs text-moss truncate">{expTitulo}</p>
              </div>
            </div>
            <span
              className="flex-shrink-0 font-nunito font-semibold uppercase px-2.5 py-1 rounded-full"
              style={{
                letterSpacing: '0.12em',
                fontSize: '0.72rem',
                background: statusColors.bg,
                color: statusColors.color,
              }}
            >
              {t(`apply_status_${appData.estado}`)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Mensajes ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          {allMessages.map((msg) => {
            const isMine = msg.sender_id === user.id
            return (
              <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                {msg.isOpening && (
                  <p
                    className="font-nunito font-semibold uppercase mb-1.5"
                    style={{ letterSpacing: '0.16em', fontSize: '0.72rem', color: '#6F7F70' }}
                  >
                    {t('chat_opening_label')}
                  </p>
                )}
                <div
                  className="font-nunito text-sm leading-relaxed px-4 py-3 whitespace-pre-wrap"
                  style={{
                    maxWidth: 'min(20rem, 85%)',
                    borderRadius: isMine
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    background: isMine ? '#1A3028' : '#ffffff',
                    color: isMine ? '#F0E498' : '#1A3028',
                    border: isMine ? 'none' : '0.5px solid rgba(45,82,66,0.12)',
                  }}
                >
                  {msg.contenido}
                </div>
                <p
                  className="font-nunito mt-1"
                  style={{ fontSize: '0.62rem', color: '#B0B0B0' }}
                >
                  {formatTime(msg.created_at)}
                </p>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input ── */}
      <div
        className="flex-shrink-0 bg-white px-5 py-4"
        style={{ borderTop: '0.5px solid rgba(45,82,66,0.1)' }}
      >
        <div className="max-w-xl mx-auto flex flex-col gap-1.5">
          {(inputError || sendError) && (
            <p className="font-nunito text-xs" style={{ color: '#E8620A' }}>
              {inputError || sendError}
            </p>
          )}
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setInputError('')
                setSendError('')
              }}
              onKeyDown={handleKeyDown}
              placeholder={t('chat_input_placeholder')}
              disabled={sending}
              className="flex-1 font-nunito text-sm rounded-full px-5 py-3 outline-none transition-all disabled:opacity-50"
              style={{
                background: '#F4F1EA',
                border: inputError ? '1px solid #E8620A' : '1px solid transparent',
                color: '#1A3028',
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="flex-shrink-0 font-nunito font-semibold uppercase rounded-full py-3 px-5 transition-colors disabled:opacity-50"
              style={{
                background: '#1A3028',
                color: '#F0E498',
                fontSize: '0.72rem',
                letterSpacing: '0.16em',
                minHeight: 'auto',
              }}
            >
              {sending ? t('chat_sending') : t('chat_send')}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
