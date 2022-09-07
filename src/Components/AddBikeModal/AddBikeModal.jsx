import React, { useContext, useEffect, useState } from "react";
import styles from "./AddBikeModal.module.css";
import { nanoid } from "nanoid";
import { Modal, Input, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { createBike } from "../../API/bikes";
import { AppContext } from "../../Context/AppContext";

export default function AddBikeModal({
  visible,
  toggleModal,
  refresh,
  existingData,
}) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useContext(AppContext);
  useEffect(() => {
    if (existingData) {
      setImageUrl(existingData.image);
      setModel(existingData.model);
      setLocation(existingData.location);
      setColor(existingData.color);
    }
  }, [existingData]);

  const handleOk = () => {
    if (model && color && location) {
      createBike({
        id: existingData ? existingData.id : nanoid(),
        model,
        color,
        location,
        rating: existingData ? existingData.rating : 0,
        image: imageUrl,
        takenDate: existingData ? existingData.takenDates : null,
      });
      clearModal();
      toggleModal();
      refresh();
    } else {
      toast("Please enter all fields");
    }
  };
  const clearModal = () => {
    setModel("");
    setColor("");
    setLocation("");
    setImageUrl("");
  };

  const handleChange = (info) => {
    setLoading(true);
    getBase64(info.file.originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
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
      title={existingData ? "Update bike" : "Add bike"}
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        clearModal();
        toggleModal();
      }}
      destroyOnClose={true}
    >
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={() => {}}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
      <Input
        className={styles.input}
        onChange={(e) => setModel(e.target.value)}
        value={model}
        placeholder="Bike model"
      />
      <Input
        className={styles.input}
        onChange={(e) => setColor(e.target.value)}
        value={color}
        placeholder="Color"
      />
      <Input
        className={styles.input}
        onChange={(e) => setLocation(e.target.value)}
        value={location}
        placeholder="Location"
      />
    </Modal>
  );
}
