import { IoWarningOutline } from "react-icons/io5";

export default function Modal({ show, onClose }) {
    if (!show) return null;
  
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className="bg-white pb-6 rounded-lg shadow-lg sm:w-96 w-72">
                <div className="flex justify-center bg-red-400 p-6 rounded-t-lg">
                    <IoWarningOutline className="text-white text-6xl"/>
                </div>
                <div className="px-6 pt-4">
                    <h2 className="text-2xl font-bold mb-4">Warning!</h2>
                    <p className="mb-4">The website is still under development. Thank you for understanding!</p>
                    <button
                        className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}  