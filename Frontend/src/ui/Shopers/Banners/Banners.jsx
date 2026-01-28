import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useBanners } from "@/hooks/admin/useBanners";
import { useCarousels } from "@/hooks/admin/useCarousels";
import Autoplay from "embla-carousel-autoplay";

const Banners = () => {
    const { data: bannersData, isLoading: bannersLoading } = useBanners();
    const { data: carouselsData, isLoading: carouselsLoading } =
        useCarousels();

    const mainCarousel = carouselsData?.carousels?.find(
        (c) => c?.title === "Main"
    );

    const saleBanner = bannersData?.banners?.find(
        (b) => b?.type === "sale"
    );

    return (
        <div className="flex flex-col">
            {mainCarousel && (
                <MainCarousel
                    mainCarousel={mainCarousel}
                    loading={carouselsLoading}
                />
            )}

            {saleBanner && (
                <SaleBanner
                    saleBanner={saleBanner}
                    loading={bannersLoading}
                />
            )}
        </div>
    );
};

/* ================= MAIN CAROUSEL ================= */

const MainCarousel = ({ mainCarousel, loading }) => {
    if (loading) {
        return (
            <div className="w-full h-[180px] md:h-[320px] bg-gray-200 animate-pulse" />
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

const SaleBanner = ({ saleBanner, loading }) => {
    if (loading) {
        return (
            <div className="w-full h-[100px] md:h-[160px] bg-gray-200 animate-pulse" />
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
    );
};

export default Banners;
