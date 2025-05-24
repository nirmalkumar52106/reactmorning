import React from "react";
import { utils, writeFile } from "xlsx";


const ExportExcel = ({ tableData, fileName = "StudentEnquiry" }) => {
  const exportToExcel = () => {
    // Create a worksheet from the table data
    const worksheet = utils.json_to_sheet(tableData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write and save the file
    writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <>
    <div style={{textAlign:"center"}}>
    <button style={{display : "table" , margin : "20px auto",textAlign:"center",
        padding : "13px 40px" , border : "none" , borderRadius : "6px",
        cursor : "pointer",fontWeight : "bold" ,
        backgroundColor : "green" , color : "white"
    }} onClick={exportToExcel}>
      Print in Excel
    </button>
    </div>
    </>
   
  );
};

export{ExportExcel};