import React from "react";
import { Header } from "../components/header";
import { ApiFetching } from "../components/apiProducts";
import { SidebarHeader } from "../components/sidebarheader";


function Home(){

  const userprivatekey = localStorage.getItem("userprivatekey")
    if(!userprivatekey){
      setTimeout(() => {
          window.location.replace("/") 
      }, 500);
    }

    return(
        <>
         <SidebarHeader/>
        <ApiFetching/> 
        </>
    )
}

export{Home}