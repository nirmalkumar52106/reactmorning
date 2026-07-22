import React from "react";
import { NavLink } from "react-router-dom";

function Header(){

    const menus = [
        {id : 1 , menuname : "Home" , path : "home"},
        {id: 2 , menuname : "Add Enquiry" , path : "addenquiry"},
        {id: 3 , menuname : "Courses" , path : "Courses"},
        {id: 4 , menuname : "Blog" , path : "blog"},
        {id: 5 , menuname : "StudentPortal" , path : "studentportal"},
    ] 

    function Logout(){
        localStorage.removeItem("userprivatekey")
        setTimeout(() => {
            window.location.reload()
        }, 500);
    }

    return(
        <>

        <div className="main-header">
            <ul>
            {
                menus.map((menuitem)=>{
                    return(
                        <>
                       <NavLink activeClassName="active" to={`/${menuitem.path}`}><li>{menuitem.menuname}</li></NavLink> 
                        </>
                    )
                })
            }
            <button onClick={Logout} style={{
                padding :"13px 45px",
                backgroundColor : "red",
                color:"white",
                fontWeight : "bold",
                border : "none",
                borderRadius : "6px",
                cursor : "pointer",
                margin : "0px 10px"
            }}>Logout</button>
            </ul>
        </div>
        
        
        </>
    )
}

export{Header}