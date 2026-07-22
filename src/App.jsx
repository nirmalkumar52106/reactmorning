// App.js
import React, { useState, useEffect } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

import { Home } from "./pages/home";
import { Errorpage } from "./pages/404page";
import { LoginForm } from "./pages/EnquiryLogin";
import { EnquiryDetail } from "./pages/enquirydetail";
import { Blog } from "./components/blog/blog";
import { AddCourse } from "./components/courses/adddcourse";
import WebEnquiryTable from "./components/websiteenq";
import StudentPanel from "./components/studentportal/studentregistration";
import FeesTabs from "./components/studentportal/fees/feestabs";
import { Maintest } from "./components/testseries/mainTest";
import { UpdateCourse } from "./components/courses/update";
import { Dashboard } from "./components/dashboard/dashboard";
import { Staff } from "./components/staff/Staff";
import SubadminManagement from "./components/AdminUsers/subadmin";
import Profile from "./components/AdminUsers/profile";
import  { StaffBatchesAll } from "./components/staff/dashcponent/batches";
import { StaffMainSallary } from "./components/staff/dashcponent/staffsallary";
import { Mainstaffdashboard } from "./components/staff/Mainhome";
import EditBlog from "./components/blog/editblog";
import AddNotes from "./components/notes/addnotes";
import AllNotes from "./components/notes/mainnotes";
import EditNotes from "./components/notes/editnotes";
import CertificateAdmin from "./components/certificate/main";
import PlacementAdmin from "./components/studentportal/placedstudents";


// ---------- ProtectedRoute Component ----------
function ProtectedRoute({ children, requiredPermission }) {
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  // Fetch latest profile to check permissions
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("https://dgrnode.vercel.app/admin-profile", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    fetchProfile();
  }, [token]);

  if (!user) return <div style={{ padding: 20 }}>Loading...</div>;

  // Admin can see everything
  if (user.role === "admin") return children;

  // Subadmin: check required permission
  if (requiredPermission && !user.permissions[requiredPermission]) {
    return <Navigate to="/home" />;
  }

  return children;
}

// ---------- App Component ----------
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<Errorpage />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Dashboard />} />

        {/* Enquiry */}
        <Route path="/addenquiry" element={
          <ProtectedRoute requiredPermission="enquiry">
            <Home />
          </ProtectedRoute>
        }/>
        <Route path="/enqdetail" element={
          <ProtectedRoute requiredPermission="enquiry">
            <EnquiryDetail />
          </ProtectedRoute>
        }/>

        {/* Blog */}
        <Route path="/blog" element={
          <ProtectedRoute requiredPermission="manageCourses">
            <Blog />
          </ProtectedRoute>
        }/>

        <Route path="/edit-blog/:id" element={<EditBlog />} />

        {/* Courses */}
        <Route path="/Courses" element={
          <ProtectedRoute requiredPermission="manageCourses">
            <AddCourse />
          </ProtectedRoute>
        }/>
        <Route path="/update/:id" element={
          <ProtectedRoute requiredPermission="manageCourses">
            <UpdateCourse />
          </ProtectedRoute>
        }/>

        {/* Website Enquiries */}
        <Route path="/webenq" element={
          <ProtectedRoute requiredPermission="enquiry">
            <WebEnquiryTable />
          </ProtectedRoute>
        }/>

        {/* Student Portal */}
        <Route path="/studentportal" element={
          <ProtectedRoute requiredPermission="manageStudents">
            <StudentPanel />
          </ProtectedRoute>
        }/>

        <Route path="/placedstudents" element={
          <ProtectedRoute requiredPermission="manageStudents">
            <PlacementAdmin/>
          </ProtectedRoute>
        }/>

        

        <Route path="/studentfeesportal" element={
          <ProtectedRoute requiredPermission="manageFees">
            <FeesTabs />
          </ProtectedRoute>
        }/>

        {/* Test Series */}
        <Route path="/test" element={
          <ProtectedRoute requiredPermission="test">
            <Maintest />
          </ProtectedRoute>
        }/>

        {/* Staff */}
        <Route path="/staff" element={
          <ProtectedRoute requiredPermission="staff">
            <Staff />
          </ProtectedRoute>
        }/>

        {/* Subadmin Management */}
        <Route path="/create-new-admin" element={
          <ProtectedRoute requiredPermission="manageUsers">
            <SubadminManagement />
          </ProtectedRoute>
        }/>

        

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/staffdashboard" element={<Mainstaffdashboard />} />
        <Route path="/staffbatches" element={<StaffBatchesAll />} />
        <Route path="/my/attendance" element={<StaffMainSallary />} />
        <Route path="/add-notes" element={<AddNotes />} />
        <Route path="/notes" element={<AllNotes />} />
         <Route path="/edit/:id" element={<EditNotes />} />
         <Route path="/issuecertificate" element={<CertificateAdmin />} />

      </Routes>
    </HashRouter>
  );
}

export { App };