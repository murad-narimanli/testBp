import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

function App() {
  const [routes, setRoutes] = useState([]);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://31.53.16.222:5000/routes")
        .build();

    connection
        .start()
        .then(() => {
          connection.on("ReceiveMessage", (receivedMessages) => {
            console.log(receivedMessages);

            if (
                !datas.some(
                    (message) =>
                        message.routeId === receivedMessages.routeId &&
                        comparePoints(message.points, receivedMessages.points)
                )
            ) {

              setDatas((prevDatas) => [...prevDatas, receivedMessages]);
            }
          });
        })
        .catch((error) => {
          console.error("SignalR connection error: ", error);
        });

    return () => {
      connection.stop();
    };
  }, [datas]);

  const comparePoints = (points1, points2) => {
    if (points1.length !== points2.length) {
      return false;
    }

    for (let i = 0; i < points1.length; i++) {
      if (points1[i].key !== points2[i].key || points1[i].value !== points2[i].value) {
        return false;
      }
    }

    return true;
  };

  return (
      <div className="App">
        <ul>
          {datas.map((message) => (
              <li key={message.id}>
                {message.points.map((point) => (
                    <div key={point.value}>
                      <b>{point.key}</b>
                      <span>{point.value}</span>
                    </div>
                ))}
              </li>
          ))}
        </ul>
      </div>
  );
}

export default App;
