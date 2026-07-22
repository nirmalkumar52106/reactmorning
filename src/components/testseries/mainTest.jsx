import React, { useState } from "react";
import { SidebarHeader } from "../sidebarheader";
import UploadTest from "./upload";
import { TestList } from "./alltest";

function Maintest() {
  const [activeTab, setActiveTab] = useState("tests");

  return (
    <>
      <SidebarHeader />
      <div style={{ width: "70%", margin: "50px auto" }} className="main-test-dashboard">
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Test Series</h1>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("tests")}
            style={{
              padding: "10px 20px",
              border: "1px solid black",
              backgroundColor: activeTab === "tests" ? "#d3d3d3" : "#fff",
              cursor: "pointer",
            }}
          >
            All & Upcoming Tests
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            style={{
              padding: "10px 20px",
              border: "1px solid black",
              backgroundColor: activeTab === "upload" ? "#d3d3d3" : "#fff",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Add New Exam
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "tests" && (
          <div className="testlist">
            <TestList />
          </div>
        )}

        {activeTab === "upload" && (
          <div className="upload">
            <UploadTest />
          </div>
        )}
      </div>
    </>
  );
}

export { Maintest };
