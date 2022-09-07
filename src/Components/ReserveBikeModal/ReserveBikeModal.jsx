import React, { useContext, useEffect, useState } from "react";
import styles from "./ReserveBikeModal.module.css";
import { nanoid } from "nanoid";
import { Modal, Input, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { createBike, updateBike } from "../../API/bikes";
import { AppContext } from "../../Context/AppContext";
import { DatePicker, Space } from "antd";
import moment from "moment";

export default function ReserveBikeModal({ id, visible, toggleModal, dates }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [dateValues, setDateValues] = useState();
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [takenDates, setTakenDates] = useState([]);
  const [realTakenDates, setRealTakenDates] = useState([]);

  const { toast } = useContext(AppContext);
  const { RangePicker } = DatePicker;
  const { user } = useContext(AppContext);

  const handleOk = () => {
    if (takenDates) {
      updateBike(id, "takenDates", {
        ...dates,
        [user.uid]: takenDates,
      });
      setDateValues(null);
      toggleModal();
    }
  };

  const clearModal = () => {
    setDateValues(null);
  };

  useEffect(() => {
    if (dates) {
      const values = Object.values(dates);
      let realTakenDates = [];
      for (let i = 0; i < values.length; i++) {
        realTakenDates = [...realTakenDates, ...Object.values(values[i])];
      }
      setRealTakenDates(realTakenDates);
    }
  }, [dates]);

  const calculate = (values) => {
    setDateValues(values);
    const date1 = moment(values[0]);
    const date2 = moment(values[1]);
    const takenDates =
      dates && dates[user.uid] ? [...Object.values(dates?.[user.uid])] : [];
    const diff = date2.diff(date1, "days");
    for (let i = 0; i <= diff; i++) {
      const dateToAdd = moment(moment(date1).add(i, "day"))
        .startOf("day")
        .format("x");
      takenDates.push(dateToAdd);
    }
    setTakenDates(takenDates);
  };
  return (
    <Modal
      title="Reserve bike"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        clearModal();
        toggleModal();
      }}
      destroyOnClose={true}
    >
      <label>Choose dates: </label>
      <br />
      <RangePicker
        onChange={calculate}
        value={dateValues}
        disabledDate={(date) => {
          if (
            Number(date.startOf("day").format("x")) <
            Number(moment().startOf("day").format("x"))
          ) {
            return true;
          } else if (realTakenDates.includes(date.startOf("day").format("x"))) {
            return true;
          } else {
            return false;
          }
        }}
      />
    </Modal>
  );
}
