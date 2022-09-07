import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove, update } from "firebase/database";
import { toast } from "react-toastify";
import { firebaseConfig } from "../firebaseConfig";
const app = initializeApp(firebaseConfig);

const db = getDatabase();

export const getBikes = async () => {
    try {
        const data = await (await get(ref(db, 'bikes/'))).toJSON();
        return data

    } catch (error) {
        return []
    }

}
export const createBike = async ({ id, model, color, location, rating, image, takenDates = null }) => {
    try {
        await set(ref(db, 'bikes/' + id), {
            model,
            color,
            location,
            rating,
            image,
            takenDates
        });
    } catch (error) {
        return
    }
}
export const updateBike = async (id, field, value) => {
    try {
        await update(ref(db, 'bikes/' + id), {
            [field]: value
        });
    } catch (error) {

        return
    }
}
export const deleteBike = async (id) => {
    try {
        await remove(ref(db, 'bikes/' + id))
    } catch (error) {

        return
    }
}