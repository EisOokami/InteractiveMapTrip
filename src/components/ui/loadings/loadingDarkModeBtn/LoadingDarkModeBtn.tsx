import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingDarkModeBtn() {
    return (
        <section className="absolute top-20 left-2 w-full h-full z-[999]">
            <div className="w-full h-full">
                <Skeleton width="35px" height="35px" />
            </div>
        </section>
    );
}
