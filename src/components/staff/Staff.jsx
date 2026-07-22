import { useState } from "react";
import StaffTable from "./stafftable";
import AddEditStaff from "./addeditstaff";
import StaffDetails from "./staffdetails";
import { SidebarHeader } from "../sidebarheader";
import { FaUsers, FaUserPlus } from "react-icons/fa";

function Staff() {
  const [tab, setTab] = useState("table");
  const [selectedStaff, setSelectedStaff] = useState(null);

  return (
    <>
      <SidebarHeader />
      <div className="staff-main" style={{width : "75%"}}>
        <h2>Staff Management</h2>

        <div
          className="staff-tabs"
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
        >
          <button
            onClick={() => setTab("table")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#f0f4f8",
              color: "#333",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <FaUsers /> All Staff
          </button>

          <button
            onClick={() => setTab("add")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#e6f0ff",
              color: "#1a73e8",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <FaUserPlus /> Add New Staff
          </button>
        </div>

        {tab === "table" && (
          <StaffTable
            onView={(staff) => {
              setSelectedStaff(staff);
              setTab("details");
            }}
            onEdit={(staff) => {
              setSelectedStaff(staff);
              setTab("add");
            }}
          />
        )}

        {tab === "add" && (
          <AddEditStaff
            staff={selectedStaff}
            onDone={() => {
              setSelectedStaff(null);
              setTab("table");
            }}
          />
        )}

        {tab === "details" && (
          <StaffDetails staff={selectedStaff} onBack={() => setTab("table")} />
        )}
      </div>
    </>
  );
}

export { Staff };
