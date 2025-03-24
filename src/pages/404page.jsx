import React from "react";
import { Link } from "react-router-dom";

function Errorpage(){
    return(
        <>
        <h1>You have entered wrong page </h1>
        <Link to="/home">Go back to home page</Link>
        </>
    )
}

export{Errorpage}