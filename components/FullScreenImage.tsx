import { useEffect } from "react";

interface FullScreenImageProps {
  src: string;
  onClose: () => void;
}

export default function FullScreenImage({ src, onClose }: FullScreenImageProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Close full screen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt="Full screen"
          className="h-full w-full object-contain transition-transform duration-500"
        />
      </div>
    </div>
  );
}
