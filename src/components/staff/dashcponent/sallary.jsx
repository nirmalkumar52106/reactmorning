import React, { useEffect, useState } from "react";

export default function StaffAttendence() {
  const token = localStorage.getItem("token");
   const userData = JSON.parse(localStorage.getItem("user"));
   const userid = userData?.id

  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [salary, setSalary] = useState(null);
  const [month, setMonth] = useState("");

  // 🔥 Default Month
  useEffect(() => {
    const today = new Date();
    setMonth(today.toISOString().slice(0, 7));
  }, []);

  // 🔥 Load Profile
  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔥 Load Attendance + Salary
  useEffect(() => {
    if (profile && month) {
      fetchAttendance(profile._id);
      fetchSalary(profile._id);
    }
  }, [profile, month]);

  // ================= PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await fetch(`https://dgrnode.vercel.app/api/staff/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= ATTENDANCE =================
  const fetchAttendance = async () => {
    try {
      const res = await fetch(`https://dgrnode.vercel.app/api/attendance/${userid}/${month}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setAttendance(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SALARY =================
  const fetchSalary = async () => {
    try {
      const res = await fetch(`https://dgrnode.vercel.app/api/salary/${userid}/${month}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setSalary(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={container}>

      {/* 🔥 HEADER */}
      <h2 style={title}>Attendence & Sallary</h2>

      {/* 🔥 PROFILE CARD */}
      {/* {profile && (
        <div style={card}>
          <h3>{profile.name}</h3>
          <p>📱 {profile.mobile}</p>
          <p>📧 {profile.email || "N/A"}</p>
          <p>🎯 Grade: {profile.grade}</p>
          <p>📊 Performance: {profile.performance}</p>
        </div>
      )} */}

      {/* 🔥 MONTH SELECT */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        style={input}
      />

      {/* 🔥 SALARY */}
      {salary && (
        <div style={salaryCard}>
          <h3>💰 Salary Details</h3>
          <p>Month: {salary.month}</p>
          <p>Present: {salary.presentDays}</p>
          <p>Half Days: {salary.halfDays}</p>
          <p>Absent: {salary.absentDays}</p>

          <h2 style={{ color: "green" }}>
            ₹ {salary.totalSalary}
          </h2>
        </div>
      )}

      {/* 🔥 ATTENDANCE GRID */}
      <div style={grid}>
        {attendance.map((a, i) => (
          <div
            key={i}
            style={{
              ...dayBox,
              background:
                a.status === "present"
                  ? "#22c55e"
                  : a.status === "half"
                  ? "#facc15"
                  : "#ef4444"
            }}
          >
            {a.date.split("-")[2]}
          </div>
        ))}
      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "20px",
  maxWidth: "1200px",
  margin: "auto"
};

const title = {
  textAlign: "center",
  marginBottom: "10px",
  marginTop : "35px"
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
};

const salaryCard = {
  ...card,
  background: "#ecfdf5"
};

const input = {
  padding: "10px",
  marginBottom: "20px",
  width: "100%",
  maxWidth: "200px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
  gap: "10px"
};

const dayBox = {
  padding: "10px",
  textAlign: "center",
  borderRadius: "6px",
  color: "#fff",
  fontWeight: "bold"
};