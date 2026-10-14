/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['"Josefin Sans"', 'sans-serif'],
        nunito: ['"Nunito Sans"', 'sans-serif'],
      },
      colors: {
        // greens — fondos y superficies
        abyss:  '#101C17',
        deep:   '#16281F',
        jungle: '#1A3028',
        forest: '#2D5242',
        moss:   '#4A7560',
        sage:   '#5C8A72',
        // creams — texto sobre verde y secciones claras
        parchment: '#F4EFE1',
        canvas:    '#EBE4D0',
        paper:     '#FAF6EA',
        cream:     '#F5F0D8',
        dew:       '#F0E498',
        alba:      '#FAFAF8',
        linen:     '#F4F1EA',
        // atenuado sobre verde
        muted: '#BCCABF',
        // acción y acentos
        cta:    '#C2510A',
        orange: '#E8620A',
        gold:   '#C8A832',
        ochre:  '#8A7A3E',
        // ── escala de texto — REGLA: ningún texto usa rgba con alpha < 1 ni la utilidad
        // opacity. La jerarquía se consigue con tamaño, peso, letter-spacing y espacio,
        // no bajando la opacidad. Si algo parece demasiado oscuro, sube en la escala.
        // Sobre fondos claros (#FAF6EA, #F4EFE1, #FFFFFF, #EBE4D0):
        ink:  '#15241E',   // texto principal
        body: '#4C5A4E',   // texto secundario y párrafos
        meta: '#5B6A5D',   // terciario, metadatos, pies
        dim:  '#6F7F70',   // valor más claro permitido — nada por debajo
        // Sobre fondos oscuros (#101C17, #15241E, #16281F, #1A3028):
        // texto principal → parchment #F4EFE1 | texto secundario → muted #BCCABF
        // eyebrows → gold #C8A832 | eyebrows sobre claro → ochre #8A7A3E
        ghost: '#93A796',  // valor más claro permitido sobre verde/negro
      },
    },
  },
  plugins: [],
}
