import React, { useEffect, useState, useContext } from "react";
import { createBike, getBikes } from "../../API/bikes";
import { getUsers } from "../../API/users";
import styles from "./Reservations.module.css";
import { Collapse } from "antd";
import ReactCardFlip from "react-card-flip";
import moment from "moment";

import Bike from "../../Components/Bike/Bike";
import { AppContext } from "../../Context/AppContext";

export default function Reservations() {
  const { Panel } = Collapse;

  const [data, setData] = useState([]);
  const [bikes, setBikes] = useState();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    loadData();
  }, []);
  const { user } = useContext(AppContext);
  const loadData = async () => {
    const userData = await getUsers();
    const bikes = await getBikes();
    const users =
      user?.role == 1 ? userData : { [user?.uid]: userData[user?.uid] };
    setBikes(bikes);
    if (bikes && users) {
      const reservedBikes = [];
      const reservingData = [];
      for (let i = 0; i < Object.keys(bikes).length; i++) {
        const el = bikes[Object.keys(bikes)[i]];
        if (el.takenDates) {
          reservedBikes.push({ ...el, uid: Object.keys(bikes)[i] });
        }
      }
      for (let i = 0; i < reservedBikes.length; i++) {
        const el = reservedBikes[i];
        for (let j = 0; j < Object.keys(el.takenDates).length; j++) {
          const inEl = Object.keys(el.takenDates)[j];
          if (user?.role == 1) {
            reservingData.push({
              user: { ...users[inEl], uid: Object.keys(el.takenDates)[j] },
              bikes: reservedBikes[i],
            });
          } else {
            if (Object.keys(users).includes(inEl)) {
              reservingData.push({
                user: { ...users[inEl], uid: Object.keys(el.takenDates)[j] },
                bikes: reservedBikes[i],
              });
            }
          }
        }
      }
      const finalData = [];
      for (let i = 0; i < reservingData.length; i++) {
        const el = reservingData[i];
        const existingIndex = finalData.findIndex(
          (data) => data.user.uid == el.user.uid
        );
        if (existingIndex > -1) {
          finalData[existingIndex] = {
            ...finalData[existingIndex],
            bikes: {
              ...finalData[existingIndex].bikes,
              [el.bikes.uid]: el.bikes,
            },
          };
        } else {
          finalData[i] = { ...el, bikes: { [el.bikes.uid]: el.bikes } };
        }
      }
      setData(finalData);
    }
  };
  const cancelReservation = async (userid, bikeid) => {
    const newBike = { ...bikes[bikeid] };
    delete newBike.takenDates[userid];
    createBike({ ...newBike, id: bikeid });
    loadData();
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Reservations</h2>
      <Collapse accordion>
        {data?.length == 0 && <b>You have no reservations</b>}
        {data?.map((reservation) => (
          <Panel
            header={
              <div className={styles.user}>
                {user?.role == 0
                  ? "You "
                  : reservation.user.firstname +
                    " " +
                    reservation.user.lastname +
                    " "}
                {user?.role == 0 ? "have" : "has"} reserved{" "}
                {Object.keys(reservation.bikes).length} bike(s)
              </div>
            }
            key={reservation.user.uid}
          >
            <div className={styles.bikeWrapper}>
              {Object.keys(reservation.bikes).map((bike) => {
                return (
                  <ReactCardFlip
                    key={bike}
                    isFlipped={isFlipped[bike]}
                    flipDirection="horizontal"
                  >
                    <Bike
                      {...reservation.bikes[bike]}
                      onClick={() => setIsFlipped({ [bike]: true })}
                      noActions
                    />

                    <div className={styles.backPart}>
                      <div className={styles.dates}>
                        {Object.values(
                          reservation.bikes[bike].takenDates[
                            reservation.user.uid
                          ]
                        ).map((date, i) => {
                          return (
                            <b key={`date-${i}-${date}`}>
                              {moment(date, "x").format("ddd Do MMMM YYYY")}
                            </b>
                          );
                        })}
                      </div>
                      <button
                        onClick={() =>
                          cancelReservation(reservation.user.uid, bike)
                        }
                      >
                        Cancel reservations
                      </button>
                    </div>
                  </ReactCardFlip>
                );
              })}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}
