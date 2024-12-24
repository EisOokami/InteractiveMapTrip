import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingMap() {
    return (
        <div className="w-full h-full">
            <div className="w-full h-full">
                <Skeleton width="100%" height="100%" />
            </div>
        </div>
    );
}
