import React from "react";

function Header(props){
    return(
        <>
        <div className="cart-header">
        <h2>Total product in cart {props.totalitem} </h2>
        </div> 
        </>
    )
}

export{Header}