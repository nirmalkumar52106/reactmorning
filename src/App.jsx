
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages/home";
import { About } from "./pages/about";
import { Errorpage } from "./pages/404page";
import { SavedEnquiry } from "./components/savedEmquiry";

function App(){
  return(
    <>

    <BrowserRouter>
    <Routes>
      <Route path="*" element={<Errorpage/>}/>
      <Route path="/" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/savedenquiry" element={<SavedEnquiry/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export{App}