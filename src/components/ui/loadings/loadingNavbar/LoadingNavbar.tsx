import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingNavbar() {
    return (
        <section>
            <div className="hidden md:block border-r">
                <div className="w-full">
                    <Skeleton width="112px" height="400px" />
                </div>
            </div>
            <div className="md:hidden border-t">
                <div className="w-full">
                    <Skeleton width="100%" height="55px" />
                </div>
            </div>
        </section>
    );
}
