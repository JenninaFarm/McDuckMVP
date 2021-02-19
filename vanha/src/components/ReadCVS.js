import React from "react";
import * as XLSX from "xlsx";

const ReadCVS = (props) => {
  const processData = (dataString) => {
    // split dataString to Lines
    const dataStringLines = dataString.split(/\r\n|\n/);
    // take the first line that contains headers

    const headers = dataStringLines[0].split(", ");
    headers[1] = "Close";

    let range = { firstDate: undefined, lastDate: undefined };

    const list = [];
    // go through all the lines except the firstDate that has headers
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

        // removes the blank rows and sets range
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
          // set the lastDate date that is put into the data
          if (i === 1) {
            const dateArray = obj.Date.split("/");
            const maxD = new Date(
              "20" + dateArray[2],
              dateArray[0] - 1,
              dateArray[1]
            );
            range.lastDate =
              maxD.getFullYear() +
              "-" +
              maxD.getMonth() +
              1 +
              "-" +
              maxD.getDate();
            // set the first date that is put into the data
          } else if (i === dataStringLines.length - 2) {
            const dateArray = obj.Date.split("/");
            const minD = new Date(
              "20" + dateArray[2],
              dateArray[0] - 1,
              dateArray[1]
            );
            range.firstDate =
              minD.getFullYear() +
              "-" +
              minD.getMonth() +
              1 +
              "-" +
              minD.getDate();
          }
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));
    props.setData(list, columns, range);
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      // parse data
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      // get firstDate worksheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // Convert array of arrays
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv, .xlsx, .xls"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default ReadCVS;
