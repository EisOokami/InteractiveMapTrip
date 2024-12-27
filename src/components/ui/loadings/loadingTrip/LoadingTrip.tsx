import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingTrip() {
    return (
        <div className="absolute grid content-start gap-4 p-3 w-screen md:w-97 h-full bg-white dark:bg-dark-mode-black md:border-r z-[1999]">
            <div className="w-full">
                <Skeleton width="140px" height="40px" />
            </div>
            <div className="grid md:flex gap-3">
                <div className="w-full">
                    <Skeleton width="100%" height="40px" />
                </div>
                <div className="w-full">
                    <Skeleton width="100%" height="40px" />
                </div>
                <div className="w-full">
                    <Skeleton width="100%" height="40px" />
                </div>
            </div>
            <div className="trip__cards grid gap-2 px-5 overflow-x-hidden overflow-y-scroll">
                <div className="w-full">
                    <Skeleton width="100px" height="40px" />
                </div>
                <div className="grid gap-2">
                    <div className="w-full">
                        <Skeleton width="100%" height="200px" />
                    </div>
                    <div className="w-full">
                        <Skeleton width="100%" height="200px" />
                    </div>
                </div>
                <div className="w-full">
                    <Skeleton width="150px" height="50px" />
                </div>
            </div>
        </div>
    );
}
