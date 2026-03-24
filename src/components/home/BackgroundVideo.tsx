"use client";
import { useEffect, useState } from 'react';

export default function BackgroundVideo() {
  const [stamp, setStamp] = useState('1');

  useEffect(() => {
    setStamp(Date.now().toString());
  }, []);

  return (
    <div className="fixed inset-0 -z-50 bg-black pointer-events-none">
      <video 
        key={stamp}
        autoPlay 
        muted 
        loop 
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
        <source src="https://assets.mixkit.co/videos/preview/mixkit-black-car-driving-in-the-dark-40026-large.mp4" type="video/mp4" />
      </video>
      
      {/* Advanced Cinematic Overlays */}
      <div className="absolute inset-0 bg-black/40" /> {/* Darkens the video so text is readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/5 via-transparent to-black/90" />
    </div>
  );
}
