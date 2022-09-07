import React, { useContext, useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import styles from "./User.module.css";
import { Card, Avatar } from "antd";
import Rating from "react-rating";
import { AppContext } from "../../Context/AppContext";
import { deleteUser, updateUser } from "../../API/users";
import moment from "moment";

export default function User({
  id,
  firstname,
  lastname,
  role,
  refresh,
  editUser,
}) {
  const { Meta } = Card;
  const { user } = useContext(AppContext);
  const [average, setAverage] = useState(0);

  return (
    <div className={styles.wrapper}>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          <div className={styles.avatarWrapp}>
            <Avatar size={64} icon={<UserOutlined />} />
          </div>
        }
      >
        <Meta
          title={firstname + " " + lastname}
          description={
            <>
              <div>Role: {role == 0 ? "Client" : "Manager"}</div>
            </>
          }
        />
      </Card>
      {user?.role == 1 && (
        <div
          onClick={() => {
            deleteUser(id);
            refresh();
          }}
          className={styles.delete}
        >
          X
        </div>
      )}
      {user?.role == 1 && (
        <div
          onClick={() => {
            editUser(id, firstname, lastname);
          }}
          className={styles.edit}
        >
          Edit
        </div>
      )}
    </div>
  );
}
