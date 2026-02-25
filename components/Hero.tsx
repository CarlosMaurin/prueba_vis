import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

interface HeroProps {
  onComplete: () => void;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();

    if (media.addEventListener) media.addEventListener("change", update);
    else media.addListener(update);

    return () => {
      if (media.removeEventListener) media.removeEventListener("change", update);
      else media.removeListener(update);
    };
  }, []);

  return reduced;
}

const Hero: React.FC<HeroProps> = ({ onComplete }) => {
  const reducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure video plays (best-effort)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (reducedMotion) {
      try {
        v.pause();
      } catch {}
      return;
    }

    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [reducedMotion]);

  // Call onComplete after the full entrance sequence ends (super suave y elegante)
  useEffect(() => {
    if (!onComplete) return;

    if (reducedMotion) {
      onComplete();
      return;
    }

    // Calibrado para: delayChildren 0.6 + (2 * stagger 0.5) + duration 1.5 + buffer
    const t = window.setTimeout(() => onComplete(), 4200);
    return () => window.clearTimeout(t);
  }, [onComplete, reducedMotion]);

  const noiseSvgDataUrl = useMemo(() => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
        <filter id='n'>
          <feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/>
          <feColorMatrix type='saturate' values='0'/>
        </filter>
        <rect width='220' height='220' filter='url(#n)' opacity='.35'/>
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, []);

  const videoSrc =
    "https://res.cloudinary.com/deit2ncmp/video/upload/f_auto,q_auto/v1770982404/hero_section_horizontal_calidad_d0cigg.mp4";
  const posterImg =
    "https://res.cloudinary.com/deit2ncmp/image/upload/v1767029988/ChatGPT_Image_Dec_29_2025_02_39_18_PM_aw48hp.png";

  /**
   * ✅ Preset: "Super suave y elegante"
   * - Movimiento sutil (y: 10)
   * - Duración larga (1.5s)
   * - Easing buttery
   * - Stagger con aire (0.5s)
   * - Inicio con pausa elegante (0.6s)
   */
  const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const container = {
    hidden: {},
    show: {
      transition: {
        delayChildren: 0.6,
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0.05, y: 40, filter: "blur(2px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.6,
        ease: EASE,
      },
    },
  };

  return (
    <section id="home" className="relative h-screen w-full bg-[#FFFFFF] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {!reducedMotion ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover brightness-[1.06] saturate-[1.03] contrast-[1.02]"
            src={videoSrc}
            poster={posterImg}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
          />
        ) : (
          <img src={posterImg} alt="V.I.S. background" className="h-full w-full object-cover" />
        )}

        {/* Elegant overlays */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 50% 35%, rgba(124,168,122,0.14) 0%, rgba(49,103,101,0.18) 45%, rgba(46,45,58,0.62) 100%)",
            }}
          />
        <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(46,45,58,0.18) 0%, rgba(46,45,58,0.52) 55%, rgba(46,45,58,0.52) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-[#2E2D3A]/10" />
        </div>

        {/* Subtle noise */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("${noiseSvgDataUrl}")`,
            backgroundRepeat: "repeat",
            opacity: 0.04,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {reducedMotion ? (
          <>
            <div className="mb-10 md:mb-12">
              <img
                src="https://res.cloudinary.com/deit2ncmp/image/upload/v1771326237/logo_blanco_completo_sin_borde_h1k6il.png"
                alt="V.I.S. Logo"
                className="h-auto w-40 md:w-56 laptop:w-64 drop-shadow-2xl"
              />
            </div>

            <h1 className="mb-6 max-w-4xl text-lg font-medium uppercase leading-tight tracking-wide text-[#FFFFFF] md:text-2xl laptop:text-3xl drop-shadow-lg">
              PROFESSIONAL PROPERTY MANAGEMENT & CARE SERVICES
            </h1>

            <p className="max-w-2xl text-sm font-serif italic leading-relaxed text-[#FFFFFF]/90 md:text-lg laptop:text-xl drop-shadow-md">
              Complete solutions for residential, commercial, and vacation properties — so you can enjoy peace of mind,
              year-round.
            </p>
          </>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
            <motion.div variants={item} className="mb-10 md:mb-12">
              <img
                src="https://res.cloudinary.com/deit2ncmp/image/upload/v1771326237/logo_blanco_completo_sin_borde_h1k6il.png"
                alt="V.I.S. Logo"
                className="h-auto w-40 md:w-56 laptop:w-64 drop-shadow-2xl"
              />
            </motion.div>

            <motion.h1
              variants={item}
              className="mb-6 max-w-4xl text-lg font-medium uppercase leading-tight tracking-wide text-[#FFFFFF] md:text-2xl laptop:text-3xl drop-shadow-lg"
            >
              PROFESSIONAL PROPERTY MANAGEMENT & CARE SERVICES
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-2xl text-sm font-serif italic leading-relaxed text-[#FFFFFF]/90 md:text-lg laptop:text-xl drop-shadow-md"
            >
              Complete solutions for residential, commercial, and vacation properties — so you can enjoy peace of mind,
              year-round.
            </motion.p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Hero;