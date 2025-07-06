import Hero from '@/components/home/hero'
import Features from '@/components/home/features'
import Stats from '@/components/home/stats'
import About from '@/components/home/about'
import CTA from '@/components/home/cta'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative">
        <Hero />
        <Features />
        <Stats />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
