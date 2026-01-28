import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import DeleteBanner from "./DeleteBanner";
import { useBanners } from "@/hooks/admin/useBanners";
import { Loader2 } from "lucide-react";


const FixedBanners = () => {

    const { data, isLoading } = useBanners()
    const banners = data?.banners

    if (isLoading) {
        return (
            <div className="w-full h-100 flex my-10 justify-center items-center">
                <Loader2 className="animate-spin"></Loader2>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5">
            {banners?.map((banner, i) => (
                <FixedBannersCard key={i} banner={banner} />
            ))}
        </div>
    )
}

const FixedBannersCard = ({ banner }) => {

    return (
        <Card className="my-10">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>{banner?.type}</CardTitle>
                <DeleteBanner banner={banner}></DeleteBanner>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    <img className="w-full h-70 object-contain" src={banner?.image?.url} alt="" />
                </div>
            </CardContent>
        </Card>
    )
}


export default FixedBanners