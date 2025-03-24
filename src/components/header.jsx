import React from "react";
import { Link, NavLink } from "react-router-dom";

function Header(){

    const menus = [
        {id : 1 , menuname : "Home" , path : "home"},
        {id: 2 , menuname : "About" , path : "about"},
        {id: 4 , menuname : "Saved Enquiry" , path : "savedenquiry"},
        {id: 3 , menuname : "Logout" , path : ""},

    ] 

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
            </ul>
        </div>
        
        
        </>
    )
}

export{Header}