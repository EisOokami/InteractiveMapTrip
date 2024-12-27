import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingSearch() {
    return (
        <div className="absolute grid content-start gap-3 p-3 w-screen md:w-97 h-full bg-white dark:bg-dark-mode-black md:border-r z-[1001]">
            <div className="w-full">
                <Skeleton width="140px" height="40px" />
            </div>
            <div className="w-full">
                <Skeleton width="100%" height="45px" />
            </div>
            <div className="w-full">
                <Skeleton width="100%" height="45px" />
            </div>
            <div className="w-full">
                <Skeleton width="100%" height="45px" />
            </div>
            <div className="search__card grid gap-2 px-5 overflow-x-hidden overflow-y-scroll">
                <div className="w-full">
                    <Skeleton width="100%" height="250px" />
                </div>
                <div className="w-full">
                    <Skeleton width="100%" height="250px" />
                </div>
                <div className="w-full">
                    <Skeleton width="100%" height="250px" />
                </div>
            </div>
        </div>
    );
}
