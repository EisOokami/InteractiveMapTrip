import { Dispatch, SetStateAction } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "./firebaseConfig";
import { IPositions } from "../interfaces/services/interface";

export const fetchPositions = (
    setImages: Dispatch<SetStateAction<IPositions[]>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
) => {
    const database = getDatabase(app);
    const imagesRef = ref(database, "positions");

    onValue(imagesRef, (snapshot) => {
        setLoading(true);

        const data = snapshot.val();

        if (data) {
            const imagesArray: IPositions[] = Object.values(data);

            setLoading(false);
            setImages(imagesArray);
        }
    });
};
