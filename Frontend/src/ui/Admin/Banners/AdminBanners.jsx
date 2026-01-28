import AddCarousal from "./Carousel/AddCarousel";
import Carousels from "./Carousel/Carousels";
import AddBanner from "./Fixed Banner/AddBanner";
import FixedBanners from "./Fixed Banner/FixedBanners";

const AdminBanners = () => {
    return (
        <div className="p-4 sm:p-6 space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Banner Management
                </h1>

                <div className="flex flex-wrap gap-3">
                    <AddCarousal />
                    <AddBanner />
                </div>
            </div>

            {/* Banners List */}
            <div className="flex flex-col gap-10">
                <Carousels />
                <FixedBanners />
            </div>

        </div>
    );
};

export default AdminBanners;
