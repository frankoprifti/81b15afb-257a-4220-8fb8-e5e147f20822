import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Screens/Main/Main';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { getAuth } from "firebase/auth";
import Login from './Screens/Login/Login'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import {
  AppContextProvider
} from './Context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Components/Header/Header';
import { firebaseConfig } from './firebaseConfig';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import Users from './Screens/Users/Users';
import Reservations from './Screens/Reservations/Reservations';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



// Initialize Firebase
const app = initializeApp(firebaseConfig);


const root = ReactDOM.createRoot(document.getElementById('root'));
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

const isLoggedIn = () => {
  const loggedIn = localStorage.getItem('logged-in')
  if (loggedIn == 'true') {
    return true
  } else {
    return false
  }
}
root.render(
  <AppContextProvider>
    <React.StrictMode>
      <BrowserRouter>
        {isLoggedIn() && <Header />}
        <Routes>
          <Route path="/reservations" element={isLoggedIn() ? <Reservations /> : <Navigate to={'login'} />} />
          <Route path="/users" element={isLoggedIn() ? <Users /> : <Navigate to={'login'} />} />
          <Route path="/" element={isLoggedIn() ? <Main /> : <Navigate to={'login'} />} />
          <Route path="login" element={isLoggedIn() ? <Navigate to={'/'} /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
    <ToastContainer />
  </AppContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
