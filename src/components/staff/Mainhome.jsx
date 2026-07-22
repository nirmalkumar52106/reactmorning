import React from "react";


import StaffAnalytics from "./dashcponent/dashboardcontent";
import StaffLayout from "./staffdashboard";

function Mainstaffdashboard() {
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
      <StaffAnalytics/>
       
      </div>

    </div>
  );
}

export { Mainstaffdashboard };