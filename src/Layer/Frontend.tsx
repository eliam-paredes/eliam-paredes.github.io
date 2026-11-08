import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from '../lib/scroll'
import Hero from '../components/Frontend/Hero'
import Reviews from '../components/Frontend/Reviews'
import Experience from '../components/Frontend/Experience'
import Features from '../components/Frontend/Features'
import Skills from '../components/Frontend/Skills'
import Contact from '../components/Frontend/Contact'
import FloatingNavbar from '../components/Frontend/FloatingNavbar'

interface FrontendProps {
  onEnterBackend: () => void;
}

export default function Frontend({ onEnterBackend }: FrontendProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    setLenis(lenis)

    // Sincroniza Lenis con GSAP: un solo bucle (el ticker de GSAP) y
    // ScrollTrigger se actualiza con cada evento de scroll de Lenis.
    gsap.registerPlugin(ScrollTrigger)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  return (
    <main className="w-full min-h-screen selection:bg-brand-primary/30 selection:text-brand-primary-light relative">
      <FloatingNavbar />
      <Hero />
      <Reviews />
      <Experience />
      <Features />
      <Skills />
      <Contact onEnterBackend={onEnterBackend} />
    </main>
  )
}
