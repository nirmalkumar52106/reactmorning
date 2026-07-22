import React, { useEffect, useState } from "react";
import BatchCard from "./BatchCard";

export default function BatchList() {
  const [batches, setBatches] = useState([]);

  // 🔥 FILTER STATE
  const [selectedCourse, setSelectedCourse] = useState("All");

  // ✅ FIXED (SAFE STAFF NAME)
  let staffName = null;
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    staffName = userData?.name || null;
  } catch (e) {
    staffName = null;
  }

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Authorization": `Bearer ${token}`
  };

  const fetchBatches = () => {
    fetch("https://dgrnode.vercel.app/api/batch/all", {
      headers,
    })
      .then(res => res.json())
      .then(data => setBatches(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // ✅ UNIQUE COURSES (NO DUPLICATE)
  const courses = [
    "All",
    ...Array.from(
      new Set(
        batches
          .map(b => b.course?.trim())
          .filter(c => c && c !== "")
      )
    )
  ];

  // ✅ 🔥 MERGED FILTER LOGIC (COURSE + STAFF)
  const filteredBatches =
    selectedCourse === "All"
      ? batches
      : batches.filter(b => b.course === selectedCourse);

  // ✅ SAME LOGIC (sirf safe staffName use kiya)
  const finalBatches = staffName
    ? filteredBatches.filter(
        (b) =>
          b?.staffId?.name?.toLowerCase().trim() ===
          staffName.toLowerCase().trim()
      )
    : filteredBatches;

  return (
    <div>

      {/* 🔥 TOP FILTER TABS (ONLY ONCE) */}
      <div style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "20px"
      }}>
        {courses.map((course, index) => (
          <button
            key={index}
            onClick={() => setSelectedCourse(course)}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: selectedCourse === course ? "#667eea" : "#eee",
              color: selectedCourse === course ? "#fff" : "#000",
              fontWeight: "500",
              transition: "0.3s"
            }}
          >
            {course}
          </button>
        ))}
      </div>
      

      {/* 🔥 BATCH LIST */}
      {finalBatches.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          No batches found
        </div>
      ) : (
        finalBatches.map(batch => (
          <BatchCard
            key={batch._id}
            batch={batch}
            refresh={fetchBatches}
          />
        ))
      )}

    </div>
  );
}