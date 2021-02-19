const csv = require("csv-parser");
const fs = require("fs");

const data = {
  parseCSV: () => {
    return new Promise((resolve, reject) => {
      const result = [];
      fs.createReadStream("HistoricalQuotes.csv")
        .pipe(
          csv({
            skipLines: 1,
            headers: ["Date", "Close", "Volume", "Open", "High", "Low"],
          })
        )
        .on("data", (data) => result.push(data))
        .on("end", () => {
          resolve(result);
        });
    });
  },
};

module.exports = data;
