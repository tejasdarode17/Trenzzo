import useEmblaCarousel from "embla-carousel-react";

const MobileProductImageCarousel = ({ images }) => {

    const [emblaRef] = useEmblaCarousel({
        loop: false,
        align: "start",
        dragFree: true,
    });

    return (
        <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="flex">
                {images?.map((img, index) => (
                    <div
                        key={index}
                        className="min-w-full flex items-center justify-center bg-gray-50"
                    >
                        <img
                            src={img.url}
                            alt=""
                            className="h-[320px] object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MobileProductImageCarousel;
