import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingTrip() {
    return (
        <div className="grid content-center gap-4 p-3 border-r">
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
            <div className="w-full px-5">
                <Skeleton width="100px" height="40px" />
            </div>
            <div className="grid gap-2 px-5">
                <div className="w-full">
                    <Skeleton width="100%" height="200px" />
                </div>
                <div className="w-full">
                    <Skeleton width="100%" height="200px" />
                </div>
            </div>
            <div className="w-full px-5">
                <Skeleton width="150px" height="50px" />
            </div>
        </div>
    );
}
