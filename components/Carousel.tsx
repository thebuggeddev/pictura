import { useState, useEffect } from "react";
import { USER_PHOTOS, getHeartImages } from "../lib/userPhotos";

interface CarouselProps {
  onClose: () => void;
}

export default function Carousel({ onClose }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = USER_PHOTOS.length > 0 ? USER_PHOTOS : getHeartImages(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black animate-in fade-in">
      {/* Background blur image */}
      <div 
        className="absolute inset-0 opacity-30 blur-3xl transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Main Image */}
      <div className="relative z-[210] flex h-full w-full flex-col items-center justify-center p-4 sm:p-8">
        <div className="relative aspect-[3/4] h-full max-h-[80vh] overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Slide ${index}`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center text-white/60">
          <p className="font-serifDisplay text-2xl tracking-widest text-white/90">Our Memories</p>
          <p className="mt-2 text-sm tracking-[0.2em] uppercase">Happy One Year</p>
        </div>
      </div>

      {/* Exit Button */}
      <button
        onClick={onClose}
        className="absolute bottom-10 z-[220] rounded-full border border-white/20 bg-black/40 px-8 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
      >
        Back to Grid
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-4 left-1/2 z-[220] flex -translate-x-1/2 gap-1.5">
        {images.slice(0, 10).map((_, i) => (
          <div 
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === currentIndex % 10 ? "w-8 bg-white" : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
