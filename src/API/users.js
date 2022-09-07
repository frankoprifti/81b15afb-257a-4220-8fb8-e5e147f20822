import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove, update } from "firebase/database";
import { toast } from "react-toastify";
import { firebaseConfig } from "../firebaseConfig";
const app = initializeApp(firebaseConfig);

const db = getDatabase();

export const getUsers = async () => {
    try {
        const data = await (await get(ref(db, 'users/'))).toJSON();
        return data

    } catch (error) {

        return []
    }

}
export const createUser = async ({ id, firstname, lastname, role }) => {
    try {
        await set(ref(db, 'users/' + id), {
            firstname,
            lastname,
            role,
        });
    } catch (error) {

        return
    }
}
export const updateUser = async (id, field, value) => {
    try {
        await update(ref(db, 'users/' + id), {
            [field]: value
        });
    } catch (error) {

        return
    }
}
export const deleteUser = async (id) => {
    try {
        await remove(ref(db, 'users/' + id))
    } catch (error) {

        return
    }
}