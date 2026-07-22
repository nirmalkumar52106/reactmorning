// import React, { useState, useEffect } from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import logo from "../../assets/jdblogo.png";

// export default function StaffLayout() {
//   const [open, setOpen] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [profile, setProfile] = useState(null); // 🔥 NEW

//   const userdata = JSON.parse(localStorage.getItem("user"));
//   const userid = userdata?.id
//   const token = localStorage.getItem("token");
//   const location = useLocation();

//   // 🔥 FETCH PROFILE
//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const res = await fetch(`https://dgrnode.vercel.app/api/staff/${userid}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const data = await res.json();
//       setProfile(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // 🔥 ACTIVE LINK STYLE
//   const getLinkStyle = (path) => ({
//     display: "block",
//     padding: "12px 20px",
//     textDecoration: "none",
//     fontSize: "15px",
//     fontWeight: "bold",
//     borderRadius: "8px",
//     margin: "5px 10px",
//     background:
//       location.pathname === path ? "#2563eb" : "transparent",
//     color:
//       location.pathname === path ? "#fff" : "#0a0a0a",
//     transition: "0.3s"
//   });

//   return (
//     <div style={{ display: "flex", marginTop: "30px" }}>

//       {/* 🔥 SIDEBAR */}
//       <div style={{
//         width: open ? "220px" : "60px",
//         background: "#fff", 
//         color: "#161515",
//         transition: "0.3s",
//         paddingTop: "20px",
//         position: "fixed",
//         height: "100vh",
//         margin: "10px"
//       }}>

//         <h2 style={{ textAlign: "center" }}>
//           {open ? "Staff Panel" : "SP"}
//         </h2>

//         <img
//           style={{ height: "65px", marginLeft: "15px" }}
//           src={logo}
//           alt="Logo"
//         />

//         <nav style={{ marginTop: "20px" }}>
//           <Link style={getLinkStyle("/staffdashboard")} to="/staffdashboard">
//             🏠 {open && "Dashboard"}
//           </Link>

//           <Link style={getLinkStyle("/my/attendance")} to="/my/attendance">
//             📅 {open && "Attendance & Sallary"}
//           </Link>

//           <Link style={getLinkStyle("/staffbatches")} to="/staffbatches">
//             👨‍🎓 {open && "Students"}
//           </Link>

//           <button
//             onClick={() => setShowProfile(true)}
//             style={profileBtn}
//           >
//             👤 {open && "Profile"}
//           </button>
//         </nav>
//       </div>

//       {/* 🔥 MAIN */}
//       <div style={{ flex: 1, background: "#f1f5f9" }}>

//         {/* 🔥 HEADER */}
//         <div style={headerStyle}>
//           <button style={menuBtn} onClick={() => setOpen(!open)}>☰</button>

//           <h3 style={{ margin: 0 }}>
//             👋 Welcome, <span style={{ color: "#2563eb" }}>{profile?.name || userdata?.name}</span>
//           </h3>

//           <button
//             onClick={() => {
//               localStorage.clear();
//               window.location.href = "/";
//             }}
//             style={logoutBtn}
//           >
//             🚪 Logout
//           </button>
//         </div>

//         {/* 🔥 PROFILE MODAL */}
//         {showProfile && (
//           <div style={modalOverlay}>
//             <div style={modalBox}>
//               <h2>👤 Staff Profile</h2>

//               {!profile ? (
//                 <p>Loading...</p>
//               ) : (
//                 <>
//                   <p><strong>Name:</strong> {profile.name}</p>
//                   <p><strong>Mobile:</strong> {profile.mobile}</p>
//                   <p><strong>Grade:</strong> {profile.grade}</p>
//                   <p><strong>Performance:</strong> {profile.performance}</p>
//                   <p><strong>Salary:</strong> ₹{profile.baseSalary}</p>
//                   <p><strong>Status:</strong> {profile.isActive ? "Active" : "Inactive"}</p>
//                 </>
//               )}

//               <button
//                 onClick={() => setShowProfile(false)}
//                 style={closeBtn}
//               >
//                 ❌ Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 🔥 CONTENT */}
//         <div style={{ padding: "20px", marginTop: "60px" }}>
//           <Outlet />
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */

// const profileBtn = {
//   margin: "10px",
//   padding: "10px",
//   width: "90%",
//   background: "#b1b4bc",
//   color: "#fff",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
//   textAlign: "start"
// };

// const headerStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "98%",
//   height: "60px",
//   background: "#fff",
//   padding: "0 20px",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
//   zIndex: 1000
// };

// const menuBtn = {
//   fontSize: "18px",
//   background: "#e2e8f0",
//   border: "none",
//   padding: "8px 12px",
//   borderRadius: "6px",
//   cursor: "pointer"
// };

// const logoutBtn = {
//   background: "linear-gradient(45deg, #ef4444, #dc2626)",
//   color: "#fff",
//   border: "none",
//   padding: "8px 16px",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontWeight: "bold"
// };

// const modalOverlay = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   background: "rgba(0,0,0,0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center"
// };

// const modalBox = {
//   background: "#fff",
//   padding: "25px",
//   borderRadius: "10px",
//   width: "300px",
//   boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
// };

// const closeBtn = {
//   marginTop: "15px",
//   padding: "8px 12px",
//   background: "#1e293b",
//   color: "#fff",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer"
// };

import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/jdblogo.png";

export default function StaffLayout() {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(null); // 🔥 NEW

  const userdata = JSON.parse(localStorage.getItem("user"));
  const userid = userdata?.id
  const token = localStorage.getItem("token");
  const location = useLocation();

  // 🔥 FETCH PROFILE
  useEffect(() => {
    fetchProfile();
  }, []);

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

  // 🔥 ACTIVE LINK STYLE
  const getLinkStyle = (path) => ({
    display: "block",
    padding: "13px 18px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "bold",
    borderRadius: "12px",
    margin: "8px 10px",
    background:
      location.pathname === path
        ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
        : "rgba(255,255,255,0.08)",
    color:
      location.pathname === path ? "#fff" : "#e5e7eb",
    transition: "0.3s",
    boxShadow:
      location.pathname === path
        ? "0 10px 20px rgba(37,99,235,0.30)"
        : "none"
  });

  return (
    <div style={{ display: "flex", marginTop: "30px" }}>

      {/* 🔥 SIDEBAR */}
      <div style={{
        width: open ? "240px" : "72px",
        background: "linear-gradient(180deg,#0f172a,#111827,#1e293b)",
        color: "#ffffff",
        transition: "0.3s",
        paddingTop: "20px",
        position: "fixed",
        height: "100vh",
        margin: "10px",
        borderRadius: "20px",
        boxShadow: "0 20px 35px rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.08)"
      }}>

        <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "12px" }}>
          {open ? "Jdb Staff Panel" : "SP"}
        </h2>

        {/* <img
          style={{
            height: "65px",
            width: "65px",
            marginLeft: "15px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid rgba(255,255,255,0.15)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.25)"
          }}
          src={logo}
          alt="Logo"
        /> */}

        <nav style={{ marginTop: "20px" }}>
          <Link style={getLinkStyle("/staffdashboard")} to="/staffdashboard">
            🏠 {open && "Dashboard"}
          </Link>

          <Link style={getLinkStyle("/my/attendance")} to="/my/attendance">
            📅 {open && "Attendance & Sallary"}
          </Link>

          <Link style={getLinkStyle("/staffbatches")} to="/staffbatches">
            👨‍🎓 {open && "Students"}
          </Link>

          <button
            onClick={() => setShowProfile(true)}
            style={profileBtn}
          >
            👤 {open && "Profile"}
          </button>
        </nav>
      </div>

      {/* 🔥 MAIN */}
      <div style={{ flex: 1, background: "#f1f5f9" }}>

        {/* 🔥 HEADER */}
        <div style={headerStyle}>
          <button style={menuBtn} onClick={() => setOpen(!open)}>☰</button>

          <h3 style={{ margin: 0, color: "#111827" }}>
            👋 Welcome, <span style={{ color: "#2563eb" }}>{profile?.name || userdata?.name}</span>
          </h3>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            style={logoutBtn}
          >
            🚪 Logout
          </button>
        </div>

        {/* 🔥 PROFILE MODAL */}
        {showProfile && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <h2 style={{ marginTop: 0, color: "#111827" }}>👤 Staff Profile</h2>

              {!profile ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Mobile:</strong> {profile.mobile}</p>
                  <p><strong>Grade:</strong> {profile.grade}</p>
                  <p><strong>Performance:</strong> {profile.performance}</p>
                  <p><strong>Salary:</strong> ₹{profile.baseSalary}</p>
                  <p><strong>Status:</strong> {profile.isActive ? "Active" : "Inactive"}</p>
                </>
              )}

              <button
                onClick={() => setShowProfile(false)}
                style={closeBtn}
              >
                ❌ Close
              </button>
            </div>
          </div>
        )}

        {/* 🔥 CONTENT */}
        <div style={{ padding: "20px", marginTop: "60px" }}>
          <Outlet />
        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const profileBtn = {
  margin: "10px",
  padding: "12px",
  width: "90%",
  background: "linear-gradient(135deg,#14b8a6,#0d9488)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  textAlign: "start",
  fontWeight: "bold",
  boxShadow: "0 10px 20px rgba(20,184,166,0.25)"
};

const headerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "98%",
  height: "65px",
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(12px)",
  padding: "0 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  zIndex: 1000,
  borderBottom: "1px solid #e5e7eb"
};

const menuBtn = {
  fontSize: "18px",
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
  border: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(37,99,235,0.25)"
};

const logoutBtn = {
  background: "linear-gradient(45deg, #ef4444, #dc2626)",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 10px 20px rgba(239,68,68,0.25)"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(15,23,42,0.65)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalBox = {
  background: "#fff",
  padding: "28px",
  borderRadius: "18px",
  width: "320px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
};

const closeBtn = {
  marginTop: "15px",
  padding: "10px 14px",
  background: "linear-gradient(135deg,#1e293b,#0f172a)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};