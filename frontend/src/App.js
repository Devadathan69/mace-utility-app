import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "./config";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/`)
      .then((res) => {
        setMessage(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>Frontend Connected to Backend</h1>
      <p>{message}</p>
    </div>
  );
}
fetch("https://mace-utility-app.onrender.com/api/data")
  .then(res => res.json())
  .then(data => console.log(data));


export default App;
