import { useEffect, useState } from "react";
import { SidebarHeader } from "../sidebarheader";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const goto = useNavigate();

  const [allproducts, setAllProducts] = useState([]);
  const [onlineenq, setOnlineEnq] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [dailyFees, setDailyFees] = useState(0);
  const [monthlyFees, setMonthlyFees] = useState(0);
  const [dailyChange, setDailyChange] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  // 🔥 TOKEN CHECK FUNCTION
  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Decode token
  const token = localStorage.getItem("token");
  let role = null;
  let permissions = {};
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
      permissions = payload.permissions || {};
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    "Authorization": `Bearer ${token}`
  };

  // 🔥 AUTO LOGOUT (TOKEN EXPIRE)
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.clear();
      window.location.replace("/");
    }
  }, [goto]);

  // 🔥 SAFE FETCH
  const safeFetch = async (url) => {
    try {
      const res = await fetch(url, { headers });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        window.location.href = "/";
        return null;
      }

      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const enquiryData = await safeFetch("https://dgrnode.vercel.app/allenquiry");
        const onlineData = await safeFetch("https://dgrnode.vercel.app/allwebaddenq");
        const studentData = await safeFetch("https://dgrnode.vercel.app/allstudents");

        if (!enquiryData || !onlineData || !studentData) return;

        setAllProducts(enquiryData);
        setOnlineEnq(onlineData);
        setStudentsData(studentData.students || []);

        calculateFees(studentData.students || []);
      } catch (err) {
        alert("Failed to fetch data");
      }
    }
    fetchData();
  }, []);

  // Recalculate fees on filter change
  useEffect(() => {
    if (studentsData.length > 0) {
      calculateFees(studentsData);
    }
  }, [selectedMonth, selectedYear, selectedDate]);

  // Fees calculation (🔥 FIXED)
  const calculateFees = (students) => {
    let dayTotal = 0;
    let prevDayTotal = 0;
    let monthTotal = 0;
    let prevMonthTotal = 0;

    const selDate = new Date(selectedDate);
    const prevDate = new Date(selDate);
    prevDate.setDate(selDate.getDate() - 1);

    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

    students.forEach(student => {
      student?.fees?.paymentHistory?.forEach(payment => {
        const payDate = new Date(payment.date);
        const paidAmount = payment.amount || 0; // 🔥 FIX

        // Daily
        if (payDate.toDateString() === selDate.toDateString()) dayTotal += paidAmount;
        if (payDate.toDateString() === prevDate.toDateString()) prevDayTotal += paidAmount;

        // Monthly
        if (payDate.getMonth() === selectedMonth && payDate.getFullYear() === selectedYear) {
          monthTotal += paidAmount;
        }

        if (payDate.getMonth() === prevMonth && payDate.getFullYear() === prevYear) {
          prevMonthTotal += paidAmount;
        }
      });
    });

    setDailyFees(dayTotal);
    setMonthlyFees(monthTotal);

    setDailyChange(prevDayTotal ? (((dayTotal - prevDayTotal) / prevDayTotal) * 100).toFixed(1) : 0);
    setMonthlyChange(prevMonthTotal ? (((monthTotal - prevMonthTotal) / prevMonthTotal) * 100).toFixed(1) : 0);
  };

  const registeredCount = allproducts.filter(i => i.statuss === "Registered").length;
  const pendingCount = allproducts.filter(i => i.statuss === "Pending").length;

  const stats = [
    { title: "Total Enquiry", value: allproducts.length || "Loading...", permission: null },
    { title: "Registered Enquiry", value: registeredCount || "Loading...", permission: null },
    { title: "Pending Enquiry", value: pendingCount || "Loading...", permission: null },
    { title: "Online Enquiry", value: onlineenq.length || "Loading...", permission: "enquiry" },
    { title: "Daily Fees Collection", value: `₹${dailyFees} ${dailyChange >= 0 ? "⬆️" : "⬇️"} ${Math.abs(dailyChange)}%`, permission: "manageFees" },
    { title: "Monthly Fees Collection", value: `₹${monthlyFees} ${monthlyChange >= 0 ? "⬆️" : "⬇️"} ${Math.abs(monthlyChange)}%`, permission: "manageFees" },
    { title: "Course Sale", value: "10 -- Digital + Web...", permission: "manageCourses" },
    { title: "Total Courses", value: 8, permission: "manageCourses" },
    { title: "Total Blogs", value: 22, permission: "manageCourses" },
  ];

  const attendanceData = [
    { name: "Present", value: 85 },
    { name: "Absent", value: 15 }
  ];

  const weeklyTestData = [
    { week: "Week 1", students: 40 },
    { week: "Week 2", students: 55 },
    { week: "Week 3", students: 70 },
    { week: "Week 4", students: 62 }
  ];

  return (
    <div className="dashboard-wrapper">
      <SidebarHeader />

      <div className="dashboard-content">
        <h1 className="dashboard-title">{role === "admin" ? "Admin Dashboard" : "Subadmin Dashboard"}</h1>

        <div className="stats-grid">
          {stats.map((s, i) => {
            if (role === "admin" || !s.permission || permissions[s.permission]) {
              return (
                <div className="stat-card" key={i}>
                  <div className="stat-title">{s.title}</div>
                  <div className="stat-value">{s.value}</div>

                  {s.title === "Daily Fees Collection" && role === "admin" && (
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{ marginBottom: "6px" }}
                    />
                  )}

                  {s.title === "Monthly Fees Collection" && role === "admin" && (
                    <div style={{ display: "flex", gap: "5px", marginBottom: "6px" }}>
                      <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)}>
                        {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=>(<option key={i} value={i}>{m}</option>))}
                      </select>

                      <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)}>
                        {[2023,2024,2025,2026].map(y=>(<option key={y} value={y}>{y}</option>))}
                      </select>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>

        {role === "admin" && (
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-title">Todays Attendance</div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={attendanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div className="chart-title">Weekly Test Series</div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyTestData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="students" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export { Dashboard };