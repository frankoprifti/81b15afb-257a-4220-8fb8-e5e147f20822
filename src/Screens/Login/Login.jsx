import React, { useContext } from "react";
import LoginForm from "../../Components/LoginForm/LoginForm";
import { AppContext } from "../../Context/AppContext";
import styles from "./Login.module.css";

export default function Login() {
  const { signup, login } = useContext(AppContext);
  return (
    <div className={styles.wrapper}>
      <div className={styles.signin}>
        <LoginForm signup={signup} login={login} />
      </div>
    </div>
  );
}
