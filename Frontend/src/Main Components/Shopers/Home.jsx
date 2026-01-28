import Banners from "./Banners/Banners";
import Categories from "./Categories/Categories";

const Home = () => {
    return (
        <div className="flex flex-col bg-white">
            {/* HERO / BANNERS FIRST ON MOBILE */}
            <section>
                <Banners />
            </section>

            {/* CATEGORIES */}
            <section className="mt-2 md:mt-6">
                <Categories />
            </section>
        </div>
    );
};

export default Home;
