import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
  MotionValue,
  useSpring,
} from 'framer-motion';
import { X, CheckCircle2, Sparkles } from 'lucide-react';
import { ServiceCardProps } from '../types';

type ModalItem =
  | string
  | {
      kind: 'group';
      title: string;
      items: string[];
      highlight?: boolean;
      badge?: string;
      cta?: string;
    };

interface AnimatedServiceCardProps extends ServiceCardProps {
  progress: MotionValue<number>;
  range: [number, number];
  onExplore: () => void;
  className?: string;
  style?: any;
}

const ServiceCard: React.FC<AnimatedServiceCardProps> = ({
  number,
  category,
  title,
  description,
  progress,
  range,
  onExplore,
  className = '',
  style = {},
}) => {
  // Smooth entrance
  const opacity = useTransform(progress, range, [0, 1]);
  const translateY = useTransform(progress, range, [60, 0]);
  const scale = useTransform(progress, range, [0.975, 1]);

  const PAD = 'clamp(18px, 2.2vw, 34px)'; // single source of truth for spacing
  const FOOTER_SAFE = 'clamp(72px, 10vh, 110px)'; // space reserved for the footer (button + number)

  const borderStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    padding: '6px',
    borderRadius: '2.25rem',
    background: 'conic-gradient(#316765, #7CA87A, #316765)',
    mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
    WebkitMask:
      'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
    maskComposite: 'exclude',
    WebkitMaskComposite: 'xor',
    opacity: 0.35,
  };

  return (
    <motion.div
      style={{ opacity, y: translateY, scale, ...style }}
      className={`relative rounded-[2.25rem] overflow-hidden ${className}`}
    >
      <div style={borderStyle} />

      <div className="relative w-full h-full bg-white rounded-[2.25rem] shadow-xl">
        <div className="relative h-full flex flex-col">
          <div
            className="flex-1 flex flex-col"
            style={{
              padding: PAD,
              paddingBottom: `calc(${FOOTER_SAFE} + 12px)`,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-cream text-dark text-[10px] font-black uppercase tracking-[0.22em]">
                {category}
              </div>
              <div className="text-dark/40 text-xs font-black tracking-[0.18em]">
                {number}
              </div>
            </div>

            <h3
              className="text-primary font-extrabold leading-tight mb-4"
              style={{
                fontSize: 'clamp(1.25rem, 1.7vw, 1.7rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h3>

            <p
              className="text-dark/70 font-medium"
              style={{
                fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
                lineHeight: 1.65,
              }}
            >
              {description}
            </p>
          </div>

          <div
            className="absolute left-0 right-0 bottom-0"
            style={{ padding: PAD }}
          >
            <button
              onClick={onExplore}
              className="w-full rounded-full bg-dark text-white font-semibold py-3.5 hover:bg-primary transition-colors duration-300"
              style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1rem)' }}
            >
              Learn more
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sticky wrapper height tuning
  const [wrapperHeightPx, setWrapperHeightPx] = useState<number | null>(null);
  const [navOffsetPx, setNavOffsetPx] = useState(110);

  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.9,
  });

  // Title animation
  const titleOpacity = useTransform(smoothProgress, [0, 0.08], [0, 1]);
  const titleY = useTransform(smoothProgress, [0, 0.08], [12, 0]);

  const titleMobileOpacity = useTransform(smoothProgress, [0, 0.1], [0, 1]);
  const titleMobileY = useTransform(smoothProgress, [0, 0.1], [10, 0]);

  // Big title overlay (desktop)
  const bigTitleOpacity = useTransform(smoothProgress, [0.02, 0.12], [0, 0.12]);

  // Cards progress ranges
  const card1Range: [number, number] = [0.12, 0.28];
  const card2Range: [number, number] = [0.32, 0.48];
  const card3Range: [number, number] = [0.52, 0.68];

  const mCard1Range = useMemo(() => card1Range, []);
  const mCard2Range = useMemo(() => card2Range, []);
  const mCard3Range = useMemo(() => card3Range, []);

  // Slide-in from sides (desktop)
  const card1X = useTransform(smoothProgress, mCard1Range, ['-105vw', '0vw']);
  const card2X = useTransform(smoothProgress, mCard2Range, ['105vw', '0vw']);
  const card3X = useTransform(smoothProgress, mCard3Range, ['-105vw', '0vw']);

  const serviceCards: ServiceCardProps[] = useMemo(
    () => [
      {
        number: '01',
        category: 'Management',
        title: 'Property Management & Maintenance',
        description:
          'We oversee and care for your property with weekly inspections, preventive maintenance, vendor coordination, and full-service support.',
      },
      {
        number: '02',
        category: 'Cleaning',
        title: 'Cleaning Services',
        description:
          'Professional cleaning for residential and commercial spaces, including specialized services that elevate your property’s standards.',
      },
      {
        number: '03',
        category: 'Concierge',
        title: 'Concierge Services',
        description:
          'We coordinate guest experiences and on-demand services so owners and guests enjoy a seamless, premium stay.',
      },
    ],
    []
  );

  const serviceData: { id: number; title: string; content: ModalItem[] }[] =
    useMemo(
      () => [
        {
          id: 1,
          title: 'Property Management & Maintenance',
          content: [
            'Weekly Property Inspections & Reports',
            'Preventive Maintenance & Handyman Services',
            'Vendor Management (plumbing, electrical, painting, snow removal, landscaping, etc.)',
            'Asistencia a Property Managers, Boards y HOAs',
            'Servicios para edificios comerciales',
          ],
        },
        {
          id: 2,
          title: 'Cleaning Services',
          content: [
            'Residential Cleaning (Checkout Clean, Move-Out Clean, Deep Clean)',
            'Commercial Cleaning (Restaurants, Offices, Common Areas)',
            {
              kind: 'group',
              title: 'Specialized Cleaning Services',
              badge: 'High-Impact',
              highlight: true,
              cta: 'Ask about specialized packages — a major part of our work.',
              items: [
                'Window & Gutter Cleaning',
                'Carpet & Upholstery Steam Cleaning',
                'Exterior Pressure Washing',
              ],
            },
          ],
        },
        {
          id: 3,
          title: 'Concierge Services',
          content: [
            'Guest support during stays',
            'Transportation coordination',
            'Restaurant & event reservations',
            'Ski passes, rentals & excursions',
            'Babysitting & Pet Sitting coordination',
          ],
        },
      ],
      []
    );

  // Open modal
  const openModal = (id: number) => setSelectedService(id);
  const closeModal = () => setSelectedService(null);

  // Dynamic wrapper height (keeps sticky area stable across desktop sizes)
  useEffect(() => {
    const computeWrapperHeight = () => {
      // keep existing behavior
      setWrapperHeightPx(null);
    };
    computeWrapperHeight();
    window.addEventListener('resize', computeWrapperHeight);
    return () => window.removeEventListener('resize', computeWrapperHeight);
  }, []);

  // Compute navbar offset for modal top padding (avoids overlap)
  useEffect(() => {
    const computeNavOffset = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
      const rect = nav.getBoundingClientRect();
      // Add a little breathing space
      setNavOffsetPx(Math.round(rect.bottom + 14));
    };

    computeNavOffset();
    window.addEventListener('resize', computeNavOffset);
    window.addEventListener('load', computeNavOffset);

    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      const nav = document.querySelector('nav');
      if (nav) {
        ro = new ResizeObserver(() => computeNavOffset());
        try {
          ro.observe(nav);
        } catch {}
      }
    }

    return () => {
      window.removeEventListener('resize', computeNavOffset);
      window.removeEventListener('load', computeNavOffset);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <section id="services" className="bg-cream scroll-mt-28 md:scroll-mt-36">
      <div
        ref={containerRef}
        className="relative"
        style={{ height: wrapperHeightPx ? `${wrapperHeightPx}px` : '520vh' }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden px-6">
          <div className="max-w-7xl mx-auto w-full h-full">
            <div className="h-full flex flex-col justify-center pt-28 md:pt-32 pb-16 md:pb-20">
              {/* Desktop Title */}
              <div className="hidden md:block relative mb-10 lg:mb-12">
                <motion.h2
                  style={{ opacity: bigTitleOpacity }}
                  className="pointer-events-none select-none absolute left-0 -top-10 font-black text-dark tracking-tighter uppercase leading-none"
                >
                  <span style={{ fontSize: 'clamp(3.2rem, 6.2vw, 6.0rem)' }}>
                    OUR SERVICES
                  </span>
                </motion.h2>

                <motion.div style={{ opacity: titleOpacity, y: titleY }} className="relative">
                  <h2
                    className="font-bold text-primary tracking-tight uppercase"
                    style={{ fontSize: 'clamp(1.9rem, 2.9vw, 3.1rem)' }}
                  >
                    OUR SERVICES
                  </h2>
                  <div className="w-16 h-1 bg-accent rounded-full mt-4" />
                </motion.div>
              </div>

              {/* Mobile Title */}
              <div className="md:hidden mb-10">
                <motion.div
                  style={{ opacity: titleMobileOpacity, y: titleMobileY }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-extrabold text-primary uppercase tracking-tight">
                    Our Services
                  </h2>
                  <div className="w-14 h-1 bg-accent rounded-full mt-4 mx-auto" />
                </motion.div>
              </div>

              {/* Cards */}
              <div className="relative flex-1 flex items-center">
                {/* Desktop grid */}
                <div className="hidden md:grid w-full grid-cols-12 gap-7 lg:gap-10 items-stretch">
                  <div className="col-span-4">
                    <ServiceCard
                      {...serviceCards[0]}
                      progress={smoothProgress}
                      range={mCard1Range}
                      onExplore={() => openModal(1)}
                      style={{ x: card1X }}
                    />
                  </div>

                  <div className="col-span-4">
                    <ServiceCard
                      {...serviceCards[1]}
                      progress={smoothProgress}
                      range={mCard2Range}
                      onExplore={() => openModal(2)}
                      style={{ x: card2X }}
                    />
                  </div>

                  <div className="col-span-4">
                    <ServiceCard
                      {...serviceCards[2]}
                      progress={smoothProgress}
                      range={mCard3Range}
                      onExplore={() => openModal(3)}
                      style={{ x: card3X }}
                    />
                  </div>
                </div>

                {/* Mobile stacked */}
                <div className="md:hidden w-full space-y-7">
                  <div className="w-full">
                    <ServiceCard
                      {...serviceCards[0]}
                      progress={smoothProgress}
                      range={[0.1, 0.22]}
                      onExplore={() => openModal(1)}
                    />
                  </div>
                  <div className="w-full">
                    <ServiceCard
                      {...serviceCards[1]}
                      progress={smoothProgress}
                      range={[0.25, 0.42]}
                      onExplore={() => openModal(2)}
                    />
                  </div>
                  <div className="w-full">
                    <ServiceCard
                      {...serviceCards[2]}
                      progress={smoothProgress}
                      range={[0.45, 0.62]}
                      onExplore={() => openModal(3)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-[200] bg-dark/60 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[201] flex justify-center"
              style={{
                paddingTop: `${navOffsetPx}px`,
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingBottom: '18px',
              }}
              onClick={closeModal}
            >
              <div onClick={(e) => e.stopPropagation()} className="w-full flex justify-center">
                <div
                  className="w-full bg-white rounded-[2.25rem] shadow-2xl overflow-hidden"
                  style={{
                    maxWidth: 'min(720px, 92vw)',
                    maxHeight: `calc(100vh - ${navOffsetPx}px - 22px)`,
                    overflowY: 'auto',
                  }}
                >
                  <div className="relative" style={{ padding: 'clamp(18px, 2.1vw, 36px)' }}>
                    <button
                      onClick={closeModal}
                      className="absolute top-5 right-5 p-2 rounded-full bg-cream hover:bg-dark hover:text-white transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-[10px] text-accent font-black uppercase tracking-[0.2em] mb-4">
                      Service Details
                    </div>

                    <h2
                      className="text-primary mb-8 leading-tight"
                      style={{
                        fontSize: 'clamp(1.6rem, 2.1vw, 2.4rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {serviceData.find((s) => s.id === selectedService)?.title}
                    </h2>

                    <div className="space-y-4">
                      {serviceData
                        .find((s) => s.id === selectedService)
                        ?.content.map((item, idx) => {
                          const isGroup = typeof item !== 'string';
                          if (isGroup) {
                            const group = item as Exclude<ModalItem, string>;
                            return (
                              <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: 0.06 + idx * 0.04,
                                  duration: 0.22,
                                  ease: 'easeOut',
                                }}
                                key={idx}
                                className={`rounded-2xl p-5 md:p-6 ring-1 ${
                                  group.highlight
                                    ? 'bg-accent/10 ring-accent/25'
                                    : 'bg-cream ring-dark/10'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex-shrink-0">
                                      <Sparkles className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                      <p
                                        className="text-dark font-extrabold"
                                        style={{
                                          fontSize: 'clamp(0.98rem, 1.15vw, 1.08rem)',
                                          lineHeight: 1.35,
                                        }}
                                      >
                                        {group.title}
                                      </p>
                                      {group.cta && (
                                        <p className="text-dark/70 font-medium mt-1">
                                          {group.cta}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {group.badge && (
                                    <div className="flex-shrink-0">
                                      <span className="inline-flex items-center rounded-full bg-accent text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {group.badge}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-4 space-y-3">
                                  {group.items.map((sub, j) => (
                                    <div key={j} className="flex items-start gap-3 pl-2 md:pl-4">
                                      <div className="mt-1 flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-accent/80" />
                                      </div>
                                      <p
                                        className="text-dark/70 font-medium"
                                        style={{
                                          fontSize: 'clamp(0.9rem, 1.0vw, 1.0rem)',
                                          lineHeight: 1.55,
                                        }}
                                      >
                                        {sub}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            );
                          }

                          return (
                            <motion.div
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.06 + idx * 0.04,
                                duration: 0.22,
                                ease: 'easeOut',
                              }}
                              key={idx}
                              className="flex items-start gap-4"
                            >
                              <div className="mt-1 flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-accent" />
                              </div>
                              <p
                                className="text-dark/70 font-medium"
                                style={{
                                  fontSize: 'clamp(0.92rem, 1.05vw, 1.02rem)',
                                  lineHeight: 1.6,
                                }}
                              >
                                {item}
                              </p>
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
