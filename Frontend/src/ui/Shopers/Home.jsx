import { MainCarousel, SaleBanner } from "./Banners/Banners";
import Categories from "./Categories/Categories";
import Trending from "./Trending/Trending";

const Home = () => {
    return (
        <div className="flex flex-col bg-white">
            {/* HERO / BANNERS FIRST ON MOBILE */}
            <section>
                <MainCarousel />
            </section>

            <section>
                <SaleBanner />
            </section>

            {/* CATEGORIES */}
            <section className="mt-2 md:mt-6">
                <Categories />
            </section>


            <Trending />

        </div>
    );
};

export default Home;
