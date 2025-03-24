import React from "react";
import { Header } from "../components/header";
import { ApiFetching } from "../components/apiProducts";


function Home(){
    return(
        <>
        <Header/>
        <ApiFetching/>
        </>
    )
}

export{Home}