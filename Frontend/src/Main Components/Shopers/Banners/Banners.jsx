import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useBanners } from '@/hooks/admin/useBanners';
import { useCarousels } from '@/hooks/admin/useCarousels';
import Autoplay from 'embla-carousel-autoplay';
import { Loader2 } from 'lucide-react';
import React from 'react'

const Banners = () => {

    const { data: bannersData, isLoading: bannersLoading } = useBanners()
    const { data: carouselsData, isLoading: carouselsLoading } = useCarousels()

    const banners = bannersData?.banners
    const carousels = carouselsData?.carousels

    const mainCarousel = carousels?.find((c) => c?.title === "Main") || null
    const saleBanner = banners?.find((b) => b?.type === "sale") || null

    return (
        <div>
            {mainCarousel && <MainCarousal mainCarousel={mainCarousel} loading={bannersLoading} ></MainCarousal>}
            {saleBanner && <SaleBanner saleBanner={saleBanner} loading={carouselsLoading} ></SaleBanner>}
        </div>
    )
}


const MainCarousal = ({ mainCarousel, loading }) => {

    return (
        <div className="relative w-full hidden xl:block mb-2">
            {
                loading ? (
                    <div>
                        <Loader2 className='animate-spin'></Loader2>
                    </div>
                ) : (
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
                            {
                                mainCarousel?.images?.map((image) => (
                                    <CarouselItem key={image._id}>
                                        <img
                                            src={image?.url}
                                            alt=""
                                            className="w-full h-[300px] object-cover"
                                        />
                                    </CarouselItem>
                                ))
                            }
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
                        <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md rounded-full" />
                    </Carousel>
                )
            }
        </div >
    )
}

const SaleBanner = ({ saleBanner, loading }) => {

    if (loading) {
        return (
            <div className='w-full object-contain h-50'>
                <Loader2 className='animate-spin'></Loader2>
            </div>
        )
    }

    return (
        <div className='my-2'>
            <a href={saleBanner?.link} >
                <img className='w-full object-contain h-50' src={saleBanner?.image?.url} alt="" />
            </a>
        </div >
    )
}

export default Banners