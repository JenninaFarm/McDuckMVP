import React from "react";
import DataTable from "react-data-table-component";

import "./table.css";

const Table = (props) => {
  return (
    <div className="table">
      <DataTable
        pagination
        highlightOnHover
        columns={props.columns}
        data={props.data}
      />
    </div>
  );
};

export default Table;
