import React, { useEffect, useState } from "react";

export default function BatchStats() {

  const [batches, setBatches] = useState([]);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  useEffect(() => {
    fetch("https://dgrnode.vercel.app/api/batch/all", { headers })
      .then(res => res.json())
      .then(data => setBatches(Array.isArray(data) ? data : data.batches || []));
  }, []);

  // ✅ TOTAL
  const totalBatches = batches.length;

  const totalStudents = batches.reduce((acc, b) => {
    return acc + (b.students?.length || 0);
  }, 0);

  // ✅ TIME SLOTS (9 AM – 6 PM)
  const slots = [
    ["09:00","10:00"], ["10:00","11:00"], ["11:00","12:00"],
    ["12:00","13:00"], ["13:00","14:00"], ["14:00","15:00"],
    ["15:00","16:00"], ["16:00","17:00"], ["17:00","18:00"]
  ];

  // 🔥 OVERLAP CHECK FUNCTION
  const isOverlapping = (slotStart, slotEnd, batchStart, batchEnd) => {
    return (
      slotStart < batchEnd && slotEnd > batchStart
    );
  };

  // ✅ FREE SLOTS
  const freeSlots = slots.filter(([start, end]) => {
    return !batches.some(b => {
      const bStart = b.timing?.start;
      const bEnd = b.timing?.end;

      if (!bStart || !bEnd) return false;

      return isOverlapping(start, end, bStart, bEnd);
    });
  });

  return (
    <div style={{
      background: "#f4f6ff",
      padding: "15px",
      borderRadius: "12px",
      marginBottom: "20px"
    }}>
      <h3>📊 Batch Overview</h3>

      <div>📦 Total Batches: <b>{totalBatches}</b></div>
      <div>👥 Total Students: <b>{totalStudents}</b></div>

      {/* <h4 style={{ marginTop: "10px" }}>🟢 Free Time Slots</h4>

      {freeSlots.length === 0 && <div>No Free Slot</div>} */}

      {/* {freeSlots.map((slot, i) => (
        <div key={i}>
          {slot[0]} - {slot[1]}
        </div>
      ))} */}
    </div>
  );
}