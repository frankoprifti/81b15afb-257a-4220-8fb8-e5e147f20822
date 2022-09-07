import React, { useContext, useEffect, useState } from "react";
import styles from "./AddUserModal.module.css";
import { nanoid } from "nanoid";
import { Modal, Input, Upload, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { createUser } from "../../API/users";
import { AppContext } from "../../Context/AppContext";

export default function AddUserModal({
  visible,
  toggleModal,
  refresh,
  existingData,
}) {
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("0");
  const { toast } = useContext(AppContext);
  const { Option } = Select;
  useEffect(() => {
    if (existingData) {
      setFirstname(existingData.firstname);
      setLastname(existingData.lastname);
      setRole(existingData.role);
    }
  }, [existingData]);

  const handleOk = async () => {
    if (firstname && lastname) {
      createUser({
        id: existingData ? existingData.id : nanoid(),
        firstname,
        lastname,
        role: role + "",
      });
      clearModal();
      toggleModal();
      refresh();
    } else {
      toast("Please enter all fields");
    }
  };
  const clearModal = () => {
    setFirstname("");
    setLastname("");
    setRole("");
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <Modal
      title={existingData ? "Update user" : "Add user"}
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        clearModal();
        toggleModal();
      }}
      destroyOnClose={true}
    >
      {!existingData && (
        <>
          <Input
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
          />
          <Input
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={"password"}
            placeholder="Password"
          />
        </>
      )}
      <Input
        className={styles.input}
        onChange={(e) => setFirstname(e.target.value)}
        value={firstname}
        placeholder="Firstname"
      />
      <Input
        className={styles.input}
        onChange={(e) => setLastname(e.target.value)}
        value={lastname}
        placeholder="Lastname"
      />
      <Select
        defaultValue={"0"}
        style={{
          width: 120,
        }}
        value={role}
        onChange={(val) => setRole(val)}
      >
        <Option value={"0"}>Client</Option>
        <Option value={"1"}>Manager</Option>
      </Select>
    </Modal>
  );
}
