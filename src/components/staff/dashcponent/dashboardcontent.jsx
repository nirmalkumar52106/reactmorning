import React, { useEffect, useState } from "react";

export default function StaffAnalytics() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [stats, setStats] = useState({
    batches: 0,
    students: 0,
    present: 0,
    absent: 0,
    today: "—",
    salary: 0
  });

  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");

  useEffect(() => {
    const today = new Date();
    setMonth(today.toISOString().slice(0, 7));
  }, []);

  useEffect(() => {
    if (month && userId) fetchDashboard();
  }, [month, userId]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [batchRes, attendanceRes, salaryRes] = await Promise.all([
        fetch("https://dgrnode.vercel.app/api/batch/all", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://dgrnode.vercel.app/api/attendance/${userId}/${month}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://dgrnode.vercel.app/api/salary/${userId}/${month}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const allBatches = await batchRes.json();
      const attendance = await attendanceRes.json();
      const salary = await salaryRes.json();

      // ✅ SAFE STAFF FILTER (FIXED)
      const myBatches = allBatches.filter((b) => {
        if (!b.staffId) return false;

        if (typeof b.staffId === "object") {
          return String(b.staffId._id) === String(userId);
        }

        return String(b.staffId) === String(userId);
      });

      // ✅ STUDENT COUNT
      let totalStudents = 0;
      myBatches.forEach(b => {
        totalStudents += b.students?.length || 0;
      });

      // ✅ ATTENDANCE COUNT
      let present = 0;
      let absent = 0;

      attendance.forEach(a => {
        if (a.status === "present") present++;
        else absent++;
      });

      // ✅ TODAY STATUS
      const todayDate = new Date().toISOString().slice(0, 10);
      const todayData = attendance.find(a => a.date === todayDate);

      setStats({
        batches: myBatches.length,
        students: totalStudents,
        present,
        absent,
        today: todayData?.status || "Absent",
        salary: salary?.totalSalary || 0
      });

    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <h2>📊 Dashboard</h2>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={input}
        />
      </div>

      {/* LOADING */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <div style={grid}>

          <Card title="📚 Batches" value={stats.batches} color="#3b82f6" />
          <Card title="👨‍🎓 Students" value={stats.students} color="#8b5cf6" />
          <Card title="✅ Present" value={stats.present} color="#22c55e" />
          <Card title="❌ Absent" value={stats.absent} color="#ef4444" />
          <Card title="📅 Today" value={stats.today} color="#f59e0b" />
          <Card title="💰 Salary" value={`₹ ${stats.salary}`} color="#10b981" />

        </div>
      )}

    </div>
  );
}

/* 🔥 CARD */
function Card({ title, value, color }) {
  return (
    <div
      style={{
        ...card,
        borderTop: `4px solid ${color}`
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <h4 style={{ marginBottom: "10px", color: "#555" }}>{title}</h4>
      <h2 style={{ color }}>{value}</h2>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "20px",
  maxWidth: "1200px",
  margin: "auto"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: "20px"
};

const input = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ddd"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px"
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  textAlign: "center",
  transition: "0.3s",
  cursor: "pointer"
};