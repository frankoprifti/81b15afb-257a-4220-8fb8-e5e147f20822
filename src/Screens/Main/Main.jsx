import React, { useContext, useEffect, useState } from "react";
import { createBike, getBikes } from "../../API/bikes";
import AddBikeModal from "../../Components/AddBikeModal/AddBikeModal";
import Bike from "../../Components/Bike/Bike";
import { AppContext } from "../../Context/AppContext";
import styles from "./Main.module.css";
import moment from "moment";
import { DatePicker, Input, Select } from "antd";

export default function Main() {
  const { user } = useContext(AppContext);
  const [bikes, setBikes] = useState({});
  const [bikeModal, setBikeModal] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedRating, setSelectedRating] = useState("0");
  const [tempB, setTempB] = useState({});
  const { Option } = Select;

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    const data = await getBikes();
    if (data) {
      setBikes(data);
      setTempB(data);
    }
  };
  const toggleModal = () => {
    setBikeModal(!bikeModal);
  };
  const editBike = (id, model, color, location, image, rating, takenDates) => {
    toggleModal();
    setExistingData({ id, model, color, location, image, rating, takenDates });
  };

  useEffect(() => {
    const tempBikes = {};
    const arr = Object.keys(tempB);
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (
        tempB[element].model.toLowerCase().includes(selectedModel || "") &&
        tempB[element].location
          .toLowerCase()
          .includes(selectedLocation || "") &&
        tempB[element].color.toLowerCase().includes(selectedColor || "") &&
        Number(tempB[element].rating) >= Number(selectedRating)
      ) {
        tempBikes[element] = tempB[element];
      }
    }
    setBikes(tempBikes);
    if (
      !selectedLocation &&
      !selectedColor &&
      !selectedModel &&
      selectedRating == 0
    ) {
      setBikes(tempB);
    }
  }, [selectedLocation, selectedColor, selectedModel, selectedRating]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Bikes</h2>

      {
        <div className={styles.action}>
          <Input
            onChange={(e) => setSelectedModel(e.target.value)}
            value={selectedModel}
            className={styles.colorPicker}
            placeholder="Filter models"
          />
          <DatePicker
            className={styles.selectedDate}
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
          <Input
            onChange={(e) => setSelectedColor(e.target.value)}
            value={selectedColor}
            className={styles.colorPicker}
            placeholder="Filter colors"
          />
          <Input
            onChange={(e) => {
              setSelectedLocation(e.target.value);
            }}
            value={selectedLocation}
            className={styles.colorPicker}
            placeholder="Filter location"
          />
          <Select
            defaultValue={"0"}
            style={{
              width: 120,
            }}
            className={styles.selectedDate}
            onChange={(val) => setSelectedRating(val)}
          >
            <Option value="0">All</Option>
            <Option value="1">1+ stars</Option>
            <Option value="2">2+ stars</Option>
            <Option value="3">3+ stars</Option>
            <Option value="4">4+ stars</Option>
            <Option value="5">5 stars</Option>
          </Select>
          {user?.role == 1 && <button onClick={toggleModal}>Add Bike</button>}
        </div>
      }
      <div className={styles.bikes}>
        {Object.keys(bikes)?.map((id) => {
          const bike = bikes[id];
          return (
            <Bike
              key={id}
              id={id}
              {...bike}
              refresh={loadBikes}
              editBike={editBike}
              selectedDate={selectedDate}
            />
          );
        })}
      </div>
      <AddBikeModal
        visible={bikeModal}
        toggleModal={toggleModal}
        refresh={loadBikes}
        existingData={existingData}
      />
    </div>
  );
}
