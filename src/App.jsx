import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Seo from './components/Seo'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ExperienceDetail from './pages/ExperienceDetail'
import Guides from './pages/Guides'
import ForGuides from './pages/ForGuides'
import Membership from './pages/Membership'
import About from './pages/About'
import Safety from './pages/Safety'
import Legal from './pages/Legal'
import ComingSoon from './pages/ComingSoon'
import NotFound from './pages/NotFound'

export default function App() {
  const { pathname } = useLocation()
  // El detalle de experiencia define su propio título.
  const pageHasOwnSeo = pathname.startsWith('/experience/')

  return (
    <>
      <ScrollToTop />
      {!pageHasOwnSeo && <Seo />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/experience/:slug" element={<ExperienceDetail />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/for-guides" element={<ForGuides />} />
        <Route path="/for-guides/apply" element={<ComingSoon eyebrowKey="apply_eyebrow" titleKey="apply_title" />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/about" element={<About />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/privacy" element={<Legal doc="privacy" />} />
        <Route path="/terms" element={<Legal doc="terms" />} />
        <Route path="/join" element={<ComingSoon eyebrowKey="join_eyebrow_account" titleKey="join_title_plan" />} />
        <Route path="/login" element={<ComingSoon eyebrowKey="login_eyebrow" titleKey="login_title" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
