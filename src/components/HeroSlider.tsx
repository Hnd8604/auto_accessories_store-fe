import { useEffect, useState, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import hero1 from "@/assets/hero-interior.jpg";
import hero2 from "@/assets/seats.jpg";
import hero3 from "@/assets/steering-wheel.jpg";
import hero4 from "@/assets/dashboard.jpg";
import { Button } from "@/components/ui/button";
import { BannersApi } from "@/features/banners/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Slide {
  image: string;
  title: string;
  desc: string;
  cta: string;
  redirectUrl?: string;
}

const defaultSlides: Slide[] = [
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

const AUTOPLAY_INTERVAL = 5000;

export const HeroSlider = memo(() => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const navigate = useNavigate();

  // Fetch banners from API
  const { data: bannersData } = useQuery({
    queryKey: ["banners"],
    queryFn: BannersApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Convert banners to slides format and filter active ones
  const apiSlides: Slide[] = (bannersData?.result || [])
    .filter(banner => banner.isActive)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .map(banner => ({
      image: banner.imageUrl,
      title: banner.title || "AutoLux Interior",
      desc: banner.altText || "",
      cta: "Tìm Hiểu Thêm",
      redirectUrl: banner.redirectUrl,
    }));

  // Use API banners if available, otherwise use default slides
  const slides = apiSlides.length > 0 ? apiSlides : defaultSlides;

  // Simple autoplay
  useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [api]);

  return (
    <section className="relative pt-[140px] min-h-[60vh] md:min-h-[70vh]">
      <Carousel setApi={setApi} opts={{ loop: true }} className="h-full">
        <CarouselContent className="h-full">
          {slides.map((s, idx) => (
            <CarouselItem key={idx} className="h-[60vh] md:h-[70vh]">
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
                      <Button
                        variant="hero"
                        size="lg"
                        className="hover-scale"
                        onClick={() => {
                          if (s.redirectUrl) {
                            navigate(s.redirectUrl);
                          }
                        }}
                      >
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
});

HeroSlider.displayName = "HeroSlider";

export default HeroSlider;
