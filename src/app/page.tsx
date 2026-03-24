import BackgroundVideo from '@/components/home/BackgroundVideo';
import Hero from '@/components/home/Hero';
import CarCarousel from '@/components/home/CarCarousel';
import Services from '@/components/home/Services';
import Features from '@/components/home/Features';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent">
      {/* Global Cinematic Video Background applied to the entire layout */}
      <BackgroundVideo />

      <div className="relative z-10 w-full flex flex-col gap-0">
        <Hero />
        
        {/* Car Showcase with transparent spacing */}
        <div id="fleet" className="pt-24 pb-32 relative z-10 bg-gradient-to-b from-transparent via-black/20 to-black/40 backdrop-blur-[2px]">
          <CarCarousel />
        </div>
        
        {/* Services mapped cleanly over the video */}
        <Services />
        
        <Features />
      </div>

      {/* Solid Black Footer anchored at the bottom as requested */}
      <div className="relative z-50 bg-[#050505] shadow-[0_-20px_50px_rgba(0,0,0,1)]">
        <Footer />
      </div>
    </main>
  );
}
