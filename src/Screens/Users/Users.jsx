import React, { useContext, useEffect, useState } from "react";
import { createUser, getUsers } from "../../API/users";
// import AddBikeModal from "../../Components/AddBikeModal/AddBikeModal";
import User from "../../Components/User/User";
import { AppContext } from "../../Context/AppContext";
import styles from "./Users.module.css";
import moment from "moment";
import { DatePicker, Input, Select } from "antd";
import AddUserModal from "../../Components/AddUserModal/AddUserModal";

export default function Main() {
  const { user } = useContext(AppContext);
  const [users, setUsers] = useState({});
  const [userModal, setUserModal] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const { Option } = Select;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    if (data) {
      setUsers(data);
    }
  };
  const toggleModal = () => {
    setUserModal(!userModal);
  };
  const editUser = (id, firstname, lastname, role) => {
    toggleModal();
    setExistingData({ id, firstname, lastname, role });
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Users</h2>

      {user?.role == 1 && (
        <div className={styles.action}>
          <button onClick={toggleModal}>Add User</button>
        </div>
      )}
      <div className={styles.user}>
        {Object.keys(users).map((id) => {
          const user = users[id];
          return (
            <User
              key={id}
              id={id}
              {...user}
              refresh={loadUsers}
              editUser={editUser}
            />
          );
        })}
      </div>
      <AddUserModal
        visible={userModal}
        toggleModal={toggleModal}
        refresh={loadUsers}
        existingData={existingData}
      />
    </div>
  );
}
