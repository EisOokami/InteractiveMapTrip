import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingPlaceCard() {
    return (
        <section className="absolute grid content-start w-screen md:w-97 h-full bg-white dark:bg-dark-mode-black md:border-r z-[1100]">
            <div className="w-full">
                <Skeleton width="100%" height="250px" />
            </div>
            <div className="grid gap-3 p-3">
                <div className="w-full">
                    <Skeleton width="220px" height="40px" />
                </div>
                <div className="w-full">
                    <Skeleton width="100%" height="40px" />
                </div>
                <div className="w-full">
                    <Skeleton width="100%" height="40px" />
                </div>
            </div>
            <div className="flex gap-5 p-3">
                <div className="">
                    <Skeleton width="65px" height="60px" />
                </div>
                <div className="">
                    <Skeleton width="65px" height="60px" />
                </div>
            </div>
        </section>
    );
}
