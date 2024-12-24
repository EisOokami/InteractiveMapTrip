import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingSearch() {
    return (
        <div className="grid content-center gap-3 p-3 border-r">
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
            <div className="grid gap-2 px-5">
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
