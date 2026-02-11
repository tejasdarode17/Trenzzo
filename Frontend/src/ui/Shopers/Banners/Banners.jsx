import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";
import { useBanners } from "@/hooks/admin/useBanners";
import { useCarousels } from "@/hooks/admin/useCarousels";
import Autoplay from "embla-carousel-autoplay";


export const MainCarousel = () => {

    const { data: carouselsData, isLoading: carouselsLoading } = useCarousels();
    const mainCarousel = carouselsData?.carousels?.find(
        (c) => c?.title === "main"
    );

    if (carouselsLoading) {
        return (
            <div className="relative w-full overflow-hidden">
                <div className="w-full h-[180px] md:h-[320px] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                        style={{
                            animation: 'shimmer 1.5s infinite',
                            backgroundSize: '200% 100%',
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full">
            <Carousel
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                        stopOnInteraction: false,
                    }),
                ]}
            >
                <CarouselContent>
                    {mainCarousel?.images?.map((image) => (
                        <CarouselItem key={image._id}>
                            <img
                                src={image.url}
                                alt=""
                                className="w-full h-[180px] md:h-[320px] object-cover"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Desktop arrows only */}
                <CarouselPrevious className="hidden md:flex left-3 bg-white/80 hover:bg-white shadow-md" />
                <CarouselNext className="hidden md:flex right-3 bg-white/80 hover:bg-white shadow-md" />
            </Carousel>
        </div>
    );
};

/* ================= SALE BANNER ================= */

export const SaleBanner = () => {

    const { data: bannersData, isLoading: bannersLoading } = useBanners();
    const saleBanner = bannersData?.banners?.find(
        (b) => b?.type === "fixed"
    )

    if (bannersLoading) {
        return (
            <div className="relative w-full mt-2 overflow-hidden rounded-md">
                <div className="w-full h-[100px] md:h-[160px] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse">
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />

                    {/* Optional content placeholders */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="h-4 w-2/3 bg-gray-200/50 rounded-full animate-pulse" />
                        <div className="h-3 w-1/2 bg-gray-200/50 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <a href={saleBanner?.link} className="block w-full mt-2">
            <img
                src={saleBanner?.image?.url}
                alt="Sale"
                className="w-full h-[100px] md:h-[160px] object-cover"
            />
        </a>
    )
}

