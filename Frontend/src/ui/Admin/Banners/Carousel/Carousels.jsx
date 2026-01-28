import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import EditCarousal from "./EditCarousel";
import DeleteCarousel from "./DeleteCarousel";
import { useCarousels } from "@/hooks/admin/useCarousels";
import { Loader2 } from "lucide-react";

const Carousels = () => {

    const { data, isLoading } = useCarousels()
    const carousels = data?.carousels

    if (isLoading) {
        return (
            <div className="w-full h-100 flex my-10 justify-center items-center">
                <Loader2 className="animate-spin"></Loader2>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5">
            {carousels?.map((c, i) => (
                <CarouselCard key={i} carousel={c} />
            ))}
        </div>
    )
}

const CarouselCard = ({ carousel }) => {
    return (
        <Card className="my-10">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>{carousel?.title}</CardTitle>
                <div className="flex gap-3">
                    <EditCarousal carousel={carousel}></EditCarousal>
                    <DeleteCarousel carousel={carousel}></DeleteCarousel>
                </div>
            </CardHeader>
            <CardContent>
                <Carousel
                    className="w-full overflow-hidden"
                    opts={{ loop: true }}
                    plugins={[
                        Autoplay({
                            delay: 3000,
                            stopOnInteraction: false,
                        }),
                    ]}
                >
                    <CarouselContent>
                        {carousel?.images?.map((i) => (
                            <CarouselItem>
                                <img
                                    src={i?.url}
                                    alt=""
                                    className="w-full h-[300px] object-cover"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
                    <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
                </Carousel>
            </CardContent>
        </Card>
    )
}

export default Carousels