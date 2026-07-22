import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import AttendanceCalendar from "./attendenecalender";
import AttendanceMarking from "./attendencemarking";

function StaffDetails({ staff, onBack }) {
  const [month, setMonth] = useState("2026-01");
  const [salary, setSalary] = useState(null);

  const [showMarkAttendance, setShowMarkAttendance] =
    useState(false);

  const [showAttendanceCalendar, setShowAttendanceCalendar] =
    useState(false);

  const tokennn = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type",
    Authorization: `Bearer ${tokennn}`,
  };

  const fetchSalary = useCallback(() => {
    fetch(
      `https://dgrnode.vercel.app/api/salary/${staff._id}/${month}`,
      { headers }
    )
      .then((res) => res.json())
      .then((data) => setSalary(data));
  }, [staff, month]);

  useEffect(() => {
    fetchSalary();
  }, [fetchSalary]);

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
          font-family:"Poppins", sans-serif;
        }

        .details-wrapper{
          width:100%;
          padding:25px;
          background:#f8fafc;
          border-radius:25px;
        }

        .back-btn{
          border:none;
          background:linear-gradient(90deg,#1e293b,#334155);
          color:white;
          padding:12px 18px;
          border-radius:12px;
          cursor:pointer;
          font-weight:600;
          margin-bottom:25px;
          transition:.3s;
        }

        .back-btn:hover{
          transform:translateY(-2px);
        }

        .profile-card{
          background:white;
          border-radius:24px;
          box-shadow:0 10px 35px rgba(0,0,0,.08);
          overflow:hidden;
          margin-bottom:25px;
        }

        .profile-header{
          background:linear-gradient(90deg,#2563eb,#7c3aed);
          padding:30px;
          color:white;
        }

        .profile-name{
          margin:0;
          font-size:30px;
          font-weight:800;
        }

        .profile-subtitle{
          margin-top:8px;
          opacity:.9;
          font-size:14px;
        }

        .profile-body{
          padding:25px;
        }

        .info-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:20px;
        }

        .info-card{
          background:#f8fafc;
          padding:18px;
          border-radius:18px;
          border:1px solid #e2e8f0;
        }

        .info-label{
          color:#64748b;
          font-size:13px;
          margin-bottom:8px;
          font-weight:600;
        }

        .info-value{
          color:#0f172a;
          font-size:17px;
          font-weight:700;
        }

        .month-section{
          margin:25px 0;
          display:flex;
          align-items:center;
          gap:15px;
          flex-wrap:wrap;
        }

        .month-label{
          font-weight:700;
          color:#1e293b;
          font-size:15px;
        }

        .month-input{
          border:none;
          outline:none;
          padding:14px 18px;
          border-radius:14px;
          background:white;
          box-shadow:0 4px 15px rgba(0,0,0,.08);
          font-size:15px;
          cursor:pointer;
        }

        .section-box{
          background:white;
          border-radius:22px;
          box-shadow:0 8px 30px rgba(0,0,0,.08);
          padding:20px;
          margin-bottom:25px;
        }

        .section-title{
          margin:0;
          color:#0f172a;
          font-size:20px;
          font-weight:700;
        }

        .toggle-btn{
          width:100%;
          border:none;
          background:#f8fafc;
          padding:15px 18px;
          border-radius:14px;
          font-size:16px;
          font-weight:700;
          color:#1e293b;
          cursor:pointer;
          text-align:left;
          margin-top:15px;
          transition:.3s;
        }

        .toggle-btn:hover{
          background:#eef2ff;
        }

        .toggle-content{
          margin-top:20px;
        }

        .salary-box{
          background:linear-gradient(135deg,#0f172a,#1e3a8a);
          color:white;
          border-radius:22px;
          padding:30px;
          box-shadow:0 12px 35px rgba(0,0,0,.15);
        }

        .salary-title{
          margin:0 0 20px 0;
          font-size:28px;
          font-weight:800;
        }

        .salary-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:15px;
        }

        .salary-item{
          background:rgba(255,255,255,.12);
          padding:18px;
          border-radius:16px;
        }

        .salary-item p{
          margin:0;
        }

        .salary-label{
          font-size:13px;
          opacity:.85;
          margin-bottom:8px !important;
        }

        .salary-value{
          font-size:20px;
          font-weight:700;
        }

        @media(max-width:768px){
          .details-wrapper{
            padding:15px;
          }

          .profile-name{
            font-size:24px;
          }

          .salary-title{
            font-size:22px;
          }
        }

      `}</style>

      <div className="details-wrapper">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="profile-card">

          <div className="profile-header">
            <h2 className="profile-name">
              {staff.name}
            </h2>

            <div className="profile-subtitle">
              Staff Profile Details
            </div>
          </div>

          <div className="profile-body">

            <div className="info-grid">

              <div className="info-card">
                <div className="info-label">
                  Mobile Number
                </div>
                <div className="info-value">
                  {staff.mobile}
                </div>
              </div>

              <div className="info-card">
                <div className="info-label">
                  Grade
                </div>
                <div className="info-value">
                  {staff.grade}
                </div>
              </div>

              <div className="info-card">
                <div className="info-label">
                  Performance
                </div>
                <div className="info-value">
                  {staff.performance}
                </div>
              </div>

              <div className="info-card">
                <div className="info-label">
                  Monthly Salary
                </div>
                <div className="info-value">
                  ₹{staff.baseSalary}
                </div>
              </div>

            </div>

          </div>

        </div>

        <div className="month-section">

          <span className="month-label">
            Select Month:
          </span>

          <input
            type="month"
            className="month-input"
            value={month}
            onChange={(e) =>
              setMonth(e.target.value)
            }
          />

        </div>

        <div className="section-box">

          <button
            className="toggle-btn"
            onClick={() =>
              setShowMarkAttendance(
                !showMarkAttendance
              )
            }
          >
            {showMarkAttendance ? "▼" : "▶"} Mark Daily Attendance
          </button>

          {showMarkAttendance && (
            <div className="toggle-content">
              <AttendanceMarking
                staffId={staff._id}
                month={month}
                onMarked={fetchSalary}
              />
            </div>
          )}

        </div>

        <div className="section-box">

          <button
            className="toggle-btn"
            onClick={() =>
              setShowAttendanceCalendar(
                !showAttendanceCalendar
              )
            }
          >
            {showAttendanceCalendar ? "▼" : "▶"} Staff Attendance
          </button>

          {showAttendanceCalendar && (
            <div className="toggle-content">
              <AttendanceCalendar
                staffId={staff._id}
                month={month}
              />
            </div>
          )}

        </div>

        {salary && (
          <div className="salary-box">

            <h3 className="salary-title">
              This Month Salary: ₹{salary.totalSalary}
            </h3>

            <div className="salary-grid">

              <div className="salary-item">
                <p className="salary-label">
                  Present Days
                </p>
                <p className="salary-value">
                  {salary.presentDays}
                </p>
              </div>

              <div className="salary-item">
                <p className="salary-label">
                  Half Days
                </p>
                <p className="salary-value">
                  {salary.halfDays}
                </p>
              </div>

              <div className="salary-item">
                <p className="salary-label">
                  Absent Days
                </p>
                <p className="salary-value">
                  {salary.absentDays}
                </p>
              </div>

              <div className="salary-item">
                <p className="salary-label">
                  Total Days
                </p>
                <p className="salary-value">
                  {salary.totalDays}
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default StaffDetails;