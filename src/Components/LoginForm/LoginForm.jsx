import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "./LoginForm.module.css";

export default function LoginForm({ signup, login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [loginOrRegister, setLoginOrRegister] = useState("login");

  const validate = () => {
    if (loginOrRegister == "login") {
      setLoginOrRegister("register");
    } else {
      if (password == verifyPassword) {
        signup(email, password, firstname, lastname);
      } else {
        toast("Passwords do not match");
      }
    }
  };
  return (
    <form className={styles.wrapper} onSubmit={() => login(email, password)}>
      {loginOrRegister == "register" && (
        <>
          <label>First name: </label>
          <input
            placeholder="Your first name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <label>Last name: </label>
          <input
            placeholder="Your last name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </>
      )}
      <label>Email: </label>
      <input
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password: </label>
      <input
        placeholder="strong-password"
        type={"password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {loginOrRegister == "register" && (
        <>
          <label>Verify password: </label>
          <input
            placeholder="Enter a strong password"
            value={verifyPassword}
            type={"password"}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
        </>
      )}
      <button
        type="button"
        onClick={() =>
          loginOrRegister == "register"
            ? setLoginOrRegister("login")
            : login(email, password)
        }
      >
        Login
      </button>
      <button type="button" onClick={validate}>
        Register
      </button>
    </form>
  );
}
