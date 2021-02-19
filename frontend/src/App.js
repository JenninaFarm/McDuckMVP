import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "./App.css";

import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080/api";

function App() {
  const [data, setData] = useState({});
  const [startDate, setStartDate] = useState(new Date());

  // LoadData gets data with axios.
  const loadData = async () => {
    try {
      const result = await axios.get("/");
      console.log(result.data);
      setData(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Get data from server when component has been mounted
  useEffect(() => {
    loadData();
  }, []);

  const handleDateSubmit = (start, end) => {
    console.log("handle date");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Read CSV file of Stock Changes</h3>
        <DatePicker submitText="Ok" onSubmitPressed={handleDateSubmit} />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </header>
    </div>
  );
}

export default App;
