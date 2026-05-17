"use client";

import React, { useRef, useEffect } from "react";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Swiper CSS
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        id: 1,
        name: "Alex Rivera",
        role: "CTO, FinTech Global",
        content: "FreelancePro revolutionized how we scale our engineering team. The quality of talent is unmatched.",
        image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Founder, DesignStudio",
        content: "The 3D portfolio previews gave us confidence to hire instantly. Best platform for creatives.",
        image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
        id: 3,
        name: "James Wilson",
        role: "Director, MarketingInc",
        content: "Zero friction payments and automated compliance saved us hundreds of hours.",
        image: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
    {
        id: 4,
        name: "Priya Sharma",
        role: "VP Engineering, CloudScale",
        content: "We cut our hiring time by 70%. The vetting process ensures only top-tier talent.",
        image: "https://i.pravatar.cc/150?u=a04258114e29026708d",
    },
    {
        id: 5,
        name: "Marcus Lee",
        role: "CEO, InnovateLab",
        content: "The real-time collaboration tools and milestone tracking are game-changers for remote teams.",
        image: "https://i.pravatar.cc/150?u=a04258114e29026902d",
    },
];

export function Testimonials() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!headingRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                headingRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 px-4 overflow-hidden bg-background relative" data-scroll-section>
            {/* Background Glow */}
            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div ref={headingRef} className="max-w-6xl mx-auto text-center mb-16 relative z-10" style={{ opacity: 0 }}>
                <h2 className="text-4xl md:text-5xl font-black mb-6">Trusted by Visionaries</h2>
                <p className="text-muted-foreground text-lg">Hear from the teams building the future with FreelancePro.</p>
            </div>

            {/* Swiper Carousel */}
            <div className="max-w-6xl mx-auto relative z-10">
                <Swiper
                    modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView="auto"
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 200,
                        modifier: 1.5,
                        slideShadows: false,
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{
                        clickable: true,
                        bulletClass: "swiper-pagination-bullet testimonial-bullet",
                        bulletActiveClass: "swiper-pagination-bullet-active testimonial-bullet-active",
                    }}
                    navigation={true}
                    loop={true}
                    spaceBetween={30}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        640: { slidesPerView: 1.5 },
                        1024: { slidesPerView: 2 },
                    }}
                    className="testimonials-swiper !pb-14"
                >
                    {testimonials.map((t) => (
                        <SwiperSlide key={t.id} className="!h-auto">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl text-center h-full flex flex-col items-center justify-center">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary mb-6 shadow-lg shadow-primary/20">
                                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex justify-center gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-xl md:text-2xl font-medium text-foreground mb-8 italic leading-relaxed">
                                    &quot;{t.content}&quot;
                                </p>
                                <div className="mt-auto">
                                    <h4 className="text-xl font-bold">{t.name}</h4>
                                    <p className="text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
