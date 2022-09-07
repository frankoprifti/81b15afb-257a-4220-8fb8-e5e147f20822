
import React, {
    useState,
    useEffect
} from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

import { toast } from 'react-toastify';


export const AppContext = React.createContext(null);

export function AppContextProvider(props) {
    const auth = getAuth();
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const db = getDatabase();
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            localStorage.setItem('logged-in', 'true')
            setIsLoggedIn(true)
            const data = await (await get(ref(db, 'users/' + user.uid))).toJSON();
            setUser({ ...user, ...data })
        } else {
            localStorage.setItem('logged-in', 'false')
            setIsLoggedIn(false)
        }
    })

    const signup = async (email, password, firstname, lastname) => {
        let usr;
        try {
            usr = await createUserWithEmailAndPassword(auth, email, password);
            await set(ref(db, 'users/' + usr.user.uid), {
                role: 0,
                firstname,
                lastname
            });
            setUser({
                ...usr, role: 0, firstname,
                lastname
            })
            toggleIsLoggedIn()

        } catch (error) {
            let err = JSON.parse(JSON.stringify(error));
            toast(err.code)
        }
    };

    const toggleIsLoggedIn = (isLogged = null) => {
        let isLoggedInStorage = localStorage.getItem('logged-in')
        if (isLoggedInStorage == 'true') {
            localStorage.setItem('logged-in', 'false')
            setIsLoggedIn(false)
            window.location.href = '/login'
        } else {
            localStorage.setItem('logged-in', 'true')
            window.location.href = '/'
            setIsLoggedIn(true)
        }
    }
    const login = async (email, password) => {
        let usr;
        try {
            usr = await signInWithEmailAndPassword(auth, email, password);
            const data = await (await get(ref(db, 'users/' + usr.user.uid))).toJSON();
            setUser({ ...usr, ...data })
            toggleIsLoggedIn()

        } catch (error) {
            let err = JSON.parse(JSON.stringify(error));
            toast(err.code)
        }
    }
    const logout = async () => {
        try {
            await auth.signOut()
            toggleIsLoggedIn()
        } catch (error) {
            let err = JSON.parse(JSON.stringify(error));
            toast(err.code)

        }
    }

    return (
        <AppContext.Provider

            value={{
                user,
                setUser,
                signup,
                login,
                isLoggedIn,
                setIsLoggedIn,
                toast,
                logout,

            }}>

            {props.children}
        </AppContext.Provider>
    );
}
