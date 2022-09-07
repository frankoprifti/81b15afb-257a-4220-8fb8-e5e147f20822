import React, { useContext, useEffect, useState } from "react";
import styles from "./Bike.module.css";
import { Card } from "antd";
import Rating from "react-rating";
import { AppContext } from "../../Context/AppContext";
import { deleteBike, updateBike } from "../../API/bikes";
import ReserveBikeModal from "../ReserveBikeModal/ReserveBikeModal";
import moment from "moment";

export default function Bike({
  id,
  model,
  color,
  location,
  rating,
  image,
  refresh,
  takenDates,
  editBike,
  selectedDate,
  noActions = false,
  onClick = null,
}) {
  const { Meta } = Card;
  const { user } = useContext(AppContext);
  const [average, setAverage] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [realTakenDates, setRealTakenDates] = useState();

  const review = (val) => {
    const avg = (Number(rating) + val) / (Number(rating) > 0 ? 2 : 1);
    setAverage(avg);
    updateBike(id, "rating", avg);
  };
  useEffect(() => {
    setAverage(rating);
  }, [rating]);

  const toggleModal = () => {
    setIsVisible(!visible);
  };
  useEffect(() => {
    if (takenDates) {
      const values = Object.values(takenDates);
      let realTakenDates = [];
      for (let i = 0; i < values.length; i++) {
        realTakenDates = [...realTakenDates, ...Object.values(values[i])];
      }
      setRealTakenDates(realTakenDates);
    }
  }, [takenDates]);

  return (
    <div className={styles.wrapper}>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          <img
            className={styles.bikeImg}
            onClick={onClick || toggleModal}
            alt={model}
            src={image}
          />
        }
      >
        <Meta
          title={model}
          description={
            <>
              <div>Color: {color}</div>
              <div>Location: {location}</div>
              <Rating
                initialRating={average}
                onChange={(val) => {
                  review(val);
                }}
              />
            </>
          }
        />
      </Card>
      <div
        className={
          realTakenDates?.includes(
            moment(selectedDate).startOf("day").format("x")
          )
            ? styles.notAvail
            : styles.available
        }
      >
        {realTakenDates?.includes(
          moment(selectedDate).startOf("day").format("x")
        )
          ? "Not available"
          : "Available"}
      </div>
      {!noActions && user?.role == 1 && (
        <div
          onClick={() => {
            deleteBike(id);
            refresh();
          }}
          className={styles.delete}
        >
          X
        </div>
      )}
      {!noActions && user?.role == 1 && (
        <div
          onClick={() => {
            editBike(id, model, color, location, image, rating, takenDates);
          }}
          className={styles.edit}
        >
          Edit
        </div>
      )}
      <ReserveBikeModal
        id={id}
        visible={visible}
        toggleModal={toggleModal}
        dates={takenDates}
      />
    </div>
  );
}
