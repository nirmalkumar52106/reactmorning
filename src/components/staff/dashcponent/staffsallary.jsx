import React from "react";
import StaffLayout from "../staffdashboard";
import BatchPage from "../../studentBatch/BatchPage";
import StaffAttendence from "./sallary";

function StaffMainSallary() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* 🔥 LEFT SIDE (Sidebar + Header inside) */}
      <div style={{ width: "250px" }}>
        <StaffLayout />
      </div>

      {/* 🔥 RIGHT SIDE (Batches Content) */}
      <div style={{
        padding: "20px",
        background: "#f1f5f9",
   
        width : "100%"
      }}>
        <StaffAttendence/>
       
      </div>

    </div>
  );
}

export { StaffMainSallary };