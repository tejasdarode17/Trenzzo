import { MainCarousel } from "./Banners/Banners";
import Categories from "./Categories/Categories";
import Trending from "./Trending/Trending";

const Home = () => {


    return (
        <div className="flex flex-col bg-white">

            <section>
                <MainCarousel />
            </section>


            <section className="mt-2 md:mt-6">
                <Categories />
            </section>

            <Trending />

        </div>
    );
};

export default Home;
