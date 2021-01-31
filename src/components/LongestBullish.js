import React, { useState } from "react";
import "./longest.css";

import Table from "./Table.js";

const LongestBullish = (props) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [pullishDays, setPullish] = useState(0);
  const [answerB, setAnswerB] = useState([]);
  const [answerC, setAnswerC] = useState([]);

  const handleStartChange = (e) => {
    setStart(e.target.value);
  };
  const handleEndChange = (e) => {
    setEnd(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // make date strings comparable and find targetData
    const startDate = new Date(start);
    startDate.setHours(0);
    const endDate = new Date(end);
    endDate.setHours(0);
    const targetData = [];
    for (let row of props.data) {
      const dateArray = row.Date.split("/");
      const date = new Date(
        "20" + dateArray[2],
        dateArray[0] - 1,
        dateArray[1]
      );

      if (date >= startDate && date <= endDate) {
        targetData.push(row);
      }
    }
    //count the days when stocks are rising
    let count = 1;
    const counts = [];
    const values = [];

    for (let row of targetData) {
      const value = Number(row.Close.substring(1));
      values.push(value);
    }
    for (let i = values.length - 1; i > 0; i--) {
      if (values[i] <= values[i - 1]) {
        count++;
      } else {
        counts.push(count);
        count = 1;
      }
    }
    counts.push(count);
    setPullish(Math.max(...counts));

    // make an array with date volumes and price changes
    const arrayB = [];
    for (let row of targetData) {
      const priceChange =
        Math.round(
          Math.abs(Number(row.High.substring(1) - row.Low.substring(1))) * 100
        ) / 100;
      const obj = {
        Date: row.Date,
        Volume: Number(row.Volume),
        PriceChange: priceChange,
      };
      arrayB.push(obj);
    }
    // sort by Volume by default
    arrayB.sort((a, b) => a.Volume - b.Volume);
    setAnswerB(arrayB);

    // SMA5 of the given date range
    const arrayC = [];
    for (let i = 0; i < targetData.length - 5; i++) {
      let sum = 0;
      for (let j = 0; j < 5; j++) {
        sum = sum + Number(targetData[i + j].Close.substring(1));
      }
      const sma5 = Math.round((sum / 5) * 100) / 100;
      const percentage =
        Math.round(
          (Number(targetData[i].Open.substring(1)) / sma5 - 1) * 1000
        ) / 1000;
      const obj = {
        Date: targetData[i].Date,
        Difference: percentage,
      };
      arrayC.push(obj);
    }
    // sort by Difference by default
    arrayC.sort((a, b) => b.Difference - a.Difference);
    setAnswerC(arrayC);
  };

  return (
    <div className="longest">
      <h5>Give the start and end date of review:</h5>
      <form onSubmit={handleSubmit}>
        <label>
          Start date:
          <input
            type="date"
            id="start"
            name="trip-start"
            min={props.min}
            max={props.max}
            onChange={handleStartChange}
          />
        </label>
        <br />
        <label>
          End date:
          <input
            type="date"
            id="end"
            name="trip-end"
            min={props.min}
            max={props.max}
            onChange={handleEndChange}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
      {!!pullishDays && (
        <div>
          <h6>Longest bullish is {pullishDays} days in a row</h6>
          <h6>Volume and Price Change between lowest and highest prices</h6>
          <Table
            columns={[
              { name: "Date", selector: "Date" },
              { name: "Volume", selector: "Volume", sortable: true },
              {
                name: "Price Change $",
                selector: "PriceChange",
                sortable: true,
              },
            ]}
            data={answerB}
          />
          <h6>
            Prize change in % comparing opening price to simple moving average
            of close price
          </h6>
          <Table
            columns={[
              { name: "Date", selector: "Date" },
              {
                name: "Price Change in %",
                selector: "Difference",
                sortable: true,
              },
            ]}
            data={answerC}
          />
        </div>
      )}
      <p>{}</p>
    </div>
  );
};

export default LongestBullish;
