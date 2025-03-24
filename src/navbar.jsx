import React, { useState } from "react";


function Navbar(){

    const [classs , setclasss] = useState("close")

    function Open(){
        setclasss("open")
    }

    function Close(){
        setclasss("close")
    }

    return(
        <>
        <div className="btn-wrapper">
            {
                classs==="close" ? <button onClick={Open}>Open</button> : <button onClick={Close}>Close</button>
            }
        </div>
 
        <ul className={`${classs}`}>
            <li>Home</li>
        </ul>
        </>
    )
}

export{Navbar}