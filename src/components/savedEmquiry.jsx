import React, { useEffect, useState } from "react";
import { Header } from "./header";
import toast, { Toaster } from "react-hot-toast";


function SavedEnquiry(){

    const [saveddata ,setsaveddata] = useState([])

    async function Getdata(){
        const api = await fetch("http://localhost:3000/saveditems")
        const convertdata = await api.json()
        setsaveddata(convertdata)
    }

    useEffect(()=>{
        Getdata()
    },[])

     const deletee = async(e)=>{

        const deleteitems =  await fetch(`http://localhost:3000/saveditems/${e}`,{
        method : "DELETE",
        }).then(()=>{ 
            toast.success("Item Deleted")
            setTimeout(() => {
                window.location.reload()
            }, 500);
        }).catch(()=>{
            toast.error("Try again")
        })

    }
    return(
        <>
        <Toaster/>
        <Header/>
      
        <div className="container">
        <h2>Saved Items</h2>
        {
            saveddata.map((items,index)=>{
                return(
                    <>
                    <div className="item">
            
            <div className="item-details">
                <div className="item-title">Item {index+1}</div>
                <div className="item-description">{items.namee}</div>
                <div className="item-description">{items.email}</div>
                <div className="item-description">{items.dob}</div>
            </div>
            <button onClick={()=>{deletee(items.id)}} className="remove-btn">Remove</button>
        </div>
                    
                    </>
                )
            })
        }
        
        
    </div>
        
        
        </>
    )
}

export{SavedEnquiry}