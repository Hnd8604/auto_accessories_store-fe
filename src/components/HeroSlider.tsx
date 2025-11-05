import { useEffect, useState } from "react";
import hero1 from "@/assets/hero-interior.jpg";
import hero2 from "@/assets/seats.jpg";
import hero3 from "@/assets/steering-wheel.jpg";
import hero4 from "@/assets/dashboard.jpg";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const slides = [
  {
    image: hero1,
    title: "Nâng Tầm Đẳng Cấp Nội Thất Xe Hơi",
    desc: "Thiết kế – độ nội thất cao cấp với da thật, carbon fiber và công nghệ hiện đại.",
    cta: "Khám Phá Dịch Vụ",
  },
  {
    image: hero2,
    title: "Bọc Ghế Da Cao Cấp",
    desc: "Da Nappa, Alcantra – chuẩn sang trọng cho khoang lái.",
    cta: "Xem Bảng Giá",
  },
  {
    image: hero3,
    title: "Độ Vô Lăng – Cầm Nắm Hoàn Hảo",
    desc: "Cá nhân hoá chất liệu và đường chỉ theo phong cách của bạn.",
    cta: "Tư Vấn Ngay",
  },
  {
    image: hero4,
    title: "Carbon Fiber & LED Ambient",
    desc: "Nâng cấp taplo, ốp nội thất và hệ thống đèn nội thất ấn tượng.",
    cta: "Xem Thư Viện Ảnh",
  },
];

export const HeroSlider = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Simple autoplay
  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(id);
  }, [api]);

  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh]">
      <Carousel setApi={setApi} opts={{ loop: true }} className="h-full">
        <CarouselContent className="h-full">
          {slides.map((s, idx) => (
            <CarouselItem key={idx} className="h-[80vh] md:h-[90vh]">
              <div className="relative w-full h-full">
                <img
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-deep-black/80 via-deep-black/40 to-transparent" />
                <div className="relative z-10 h-full container flex items-center">
                  <div className="max-w-3xl animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-primary-foreground">
                      {s.title}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-primary-foreground">
                      {s.desc}
                    </p>
                    <div className="mt-8 flex gap-4">
                      <Button variant="hero" size="lg" className="hover-scale">
                        {s.cta}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="
                          bg-transparent 
                          border-2 
                          border-white/30 
                          text-white 
                          backdrop-blur-sm
                          hover:bg-white/10 
                          hover:border-white/60
                          hover:shadow-lg
                          hover:shadow-white/20
                          transition-all 
                          duration-300 
                          font-semibold
                          px-8
                          py-3
                          rounded-lg
                          group
                          relative
                          overflow-hidden
                          before:absolute
                          before:inset-0
                          before:bg-gradient-to-r
                          before:from-white/0
                          before:via-white/5
                          before:to-white/0
                          before:translate-x-[-100%]
                          hover:before:translate-x-[100%]
                          before:transition-transform
                          before:duration-700
                        "
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Tìm Hiểu Thêm
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 md:left-6 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm border-border/40" />
        <CarouselNext className="right-4 md:right-6 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm border-border/40" />
      </Carousel>
    </section>
  );
};

export default HeroSlider;
