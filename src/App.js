import React, { useState } from "react";
import * as XLSX from "xlsx";

import Table from "./components/Table.js";
import Longest from "./components/LongestBullish.js";
import "./App.css";

function App() {
  // contains column names
  const [columns, setColumns] = useState([]);
  // contains data of rows
  const [data, setData] = useState([]);
  // contains the fisrt date
  const [first, setFirst] = useState("");
  // contains the last date
  const [last, setLast] = useState("");

  const processData = (dataString) => {
    // split dataString to Lines
    const dataStringLines = dataString.split(/\r\n|\n/);
    // take the first line that contains headers

    const headers = dataStringLines[0].split(", ");
    headers[1] = "Close";

    const list = [];
    // go through all the lines except the first that has headers
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(", ");

      if (headers && row.length === headers.length) {
        const obj = {};
        // go through all the columns
        for (let j = 0; j < headers.length; j++) {
          // contains data of the column[j]
          let data = row[j];
          if (data.length > 0) {
            if (data[0] === '"') {
              data = data.substring(1, data.length - 1);
            }
            if (data[data.length - 1] === '"') {
              data = data.substring(data.length - 1, 1);
            }
          }
          if (headers[j]) {
            if (j !== 1) {
              obj[headers[j]] = data;
            } else {
              obj["Close"] = data;
            }
          }
        }

        // removes the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
          // set the last date that is put into the data
          if (i === 1) {
            const dateArray = obj.Date.split("/");
            const maxD = new Date(
              "20" + dateArray[2],
              dateArray[0] - 1,
              dateArray[1]
            );
            setLast(
              maxD.getFullYear() +
                "-" +
                maxD.getMonth() +
                1 +
                "-" +
                maxD.getDate()
            );
            // set the first date that is put into the data
          } else if (i === dataStringLines.length - 2) {
            const dateArray = obj.Date.split("/");
            const minD = new Date(
              "20" + dateArray[2],
              dateArray[0] - 1,
              dateArray[1]
            );
            setFirst(
              minD.getFullYear() +
                "-" +
                minD.getMonth() +
                1 +
                "-" +
                minD.getDate()
            );
          }
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    setData(list);
    setColumns(columns);
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      // parse data
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      // get first worksheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // Convert array of arrays
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Read CSV file of Stock Changes</h3>
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileUpload}
        />
        <Longest data={data} max={last} min={first} />
        <h3>All data</h3>
        <Table columns={columns} data={data} />
      </header>
    </div>
  );
}

export default App;
