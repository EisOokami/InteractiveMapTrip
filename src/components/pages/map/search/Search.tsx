import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useCallback,
    useRef,
    useState,
} from "react";
import useClickOutside from "../../../../hooks/UseClickOutside";
import { IPositions } from "../../../../interfaces/search/interface";

interface SearchProps {
    positions: IPositions[];
    setZoomLocationX: Dispatch<SetStateAction<number>>;
    setZoomLocationY: Dispatch<SetStateAction<number>>;
    setSelectedPosition: Dispatch<SetStateAction<number | null>>;
    setOpenPlaceCard: Dispatch<SetStateAction<boolean>>;
}

export default function Search({
    positions,
    setZoomLocationX,
    setZoomLocationY,
    setSelectedPosition,
    setOpenPlaceCard,
}: SearchProps) {
    const [valueLocation, setValueLocation] = useState<string>("");
    const [valueName, setValueName] = useState<string>("");
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const refDropdown = useRef<HTMLDivElement>(null);

    useClickOutside(refDropdown, () => setDropdownVisible(false));

    const handleChangeLocation = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setValueLocation(e.target.value.toLowerCase());
        },
        [setValueLocation],
    );

    const handleChangeName = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setValueName(e.target.value.toLowerCase());
        },
        [setValueName],
    );

    const handleDropdownToggle = useCallback(() => {
        setDropdownVisible(!dropdownVisible);
    }, [setDropdownVisible, dropdownVisible]);

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(category)
                ? prevSelected.filter((cat) => cat !== category)
                : [...prevSelected, category],
        );
    }, []);

    const handleZoomLocation = useCallback(
        (x: number, y: number, key: number) => {
            setZoomLocationX(x);
            setZoomLocationY(y);
            setSelectedPosition(key);
            setOpenPlaceCard(true);
        },
        [
            setZoomLocationX,
            setZoomLocationY,
            setSelectedPosition,
            setOpenPlaceCard,
        ],
    );

    const uniqueCategories = [...new Set(positions.map((pos) => pos.category))];

    const filteredPositions = positions.filter(
        (elem) =>
            elem.name.toLowerCase().includes(valueName) &&
            elem.location.toLowerCase().includes(valueLocation) &&
            (selectedCategories.length === 0 ||
                selectedCategories.includes(elem.category)),
    );

    return (
        <section className="search absolute flex flex-col w-screen md:w-97 h-full px-3 bg-white dark:bg-dark-mode-black z-[1001] transition">
            <h1 className="mt-5 dark:text-white text-2xl sm:text-3xl font-bold">
                Search
            </h1>
            <input
                className="search__input"
                type="text"
                placeholder="Location"
                onChange={handleChangeLocation}
            />
            <input
                className="search__input"
                type="text"
                placeholder="Place name"
                onChange={handleChangeName}
            />
            <div ref={refDropdown} className="relative">
                <input
                    onClick={handleDropdownToggle}
                    className="search__btn--category"
                    type="button"
                    value="Select category"
                />

                {dropdownVisible && (
                    <div className="absolute top-11 w-full mt-2 bg-white dark:bg-dark-mode-black border dark:border-dark-mode-gray-2 rounded-lg shadow z-10 transition">
                        <ul className="p-3 space-y-1 text-sm">
                            {uniqueCategories.map((category, key) => (
                                <li key={key}>
                                    <div className="flex items-center p-2 rounded hover:bg-gray-100 hover:dark:bg-gray-900 transition">
                                        <input
                                            id={`checkbox-item-${key}`}
                                            type="checkbox"
                                            value={category}
                                            checked={selectedCategories.includes(
                                                category,
                                            )}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            onChange={() =>
                                                handleCategoryChange(category)
                                            }
                                        />
                                        <label
                                            htmlFor={`checkbox-item-${key}`}
                                            className="w-full ml-2 text-sm text-gray-900 dark:text-gray-100 font-medium rounded transition"
                                        >
                                            {category}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="search__card grid justify-items-center mt-3 p-2 rounded overflow-x-hidden overflow-y-scroll">
                {filteredPositions.map((elem) => (
                    <a
                        key={elem.id}
                        href="#"
                        className="search__place-card"
                        onClick={() =>
                            handleZoomLocation(elem.x, elem.y, elem.id)
                        }
                    >
                        <img
                            className="object-cover w-full h-36 rounded-t-lg"
                            src={elem.img}
                            alt={elem.name}
                        />
                        <div className="p-4">
                            <h5 className="tracking-tight text-gray-900 dark:text-gray-100 font-bold">
                                {elem.name}
                            </h5>
                            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm font-normal transition">
                                {elem.category}
                            </p>
                            <p className="dark:text-white text-sm italic font-normal transition">
                                {elem.location}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
