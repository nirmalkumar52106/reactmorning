import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import { Errorpage } from "./pages/404page";
import { EnquiryForm } from "./components/addenquiry";
import { LoginForm } from "./pages/EnquiryLogin";
import { EnquiryDetail } from "./pages/enquirydetail";
import { Blog } from "./components/blog/blog";
import { AddCourse } from "./components/courses/adddcourse";
import WebEnquiryTable from "./components/websiteenq";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="*" element={<Errorpage />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/addenquiry" element={<EnquiryForm />} />
          <Route path="/enqdetail" element={<EnquiryDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/Courses" element={<AddCourse />} />
          <Route path="/webenq" element={<WebEnquiryTable/>} />
        </Routes>
      </HashRouter>
    </>
  );
}

export { App };
