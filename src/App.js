import React, { useState } from "react";
import * as XLSX from "xlsx";

import ReadCVS from "./components/ReadCVS.js";
import Table from "./components/Table.js";
import Longest from "./components/LongestBullish.js";
import "./App.css";

function App() {
  // contains column names
  const [columns, setColumns] = useState([]);
  // contains data of rows
  const [data, setData] = useState([]);
  const [firstDate, setFirstDate] = useState("");
  const [lastDate, setlastDate] = useState("");

  const setFileData = (data, columns, range) => {
    console.log(columns);
    setData(data);
    setColumns(columns);
    setFirstDate(range.firstDate);
    setlastDate(range.lastDate);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Read CSV file of Stock Changes</h3>
        <ReadCVS setData={setFileData} />
        <Longest data={data} max={lastDate} min={firstDate} />
        <h3>All data</h3>
        <Table columns={columns} data={data} />
      </header>
    </div>
  );
}

export default App;
