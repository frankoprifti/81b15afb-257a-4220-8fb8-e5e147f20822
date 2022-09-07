import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import styles from "./Header.module.css";

export default function Header() {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <b onClick={() => navigate("/")}>Bike Rental</b>
      </div>
      <div className={styles.options}>
        {user?.role == 1 && (
          <b
            onClick={() =>
              location.pathname == "/users" ? navigate("/") : navigate("/users")
            }
          >
            Manage {location.pathname == "/users" ? "bikes" : "users"}
          </b>
        )}
        {
          <b onClick={() => navigate("/reservations")}>
            {user?.role == 1 ? "R" : "My r"}eservations
          </b>
        }
        <b>
          {user?.firstname} {user?.lastname}
        </b>
        <b onClick={logout}>Log out</b>
      </div>
    </div>
  );
}
