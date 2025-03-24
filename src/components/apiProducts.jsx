import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast"

function ApiFetching(){
 

    const [allproducts , setallproducts] = useState([])

 async function Data(){
    const apiurl = await fetch("http://localhost:3000/users")
    const data = await apiurl.json()
    setallproducts(data)
}

 useEffect(()=>{
    Data()
 },[])


 async function Delete(e){
    const apiurl = await fetch(`http://localhost:3000/users/${e}`,{
        method:"DELETE"
    }).then(()=>{
        toast.success("Data deleted")
        window.location.reload()
    }).catch(()=>{
        toast.error("try again..")
    })
 }


 async function Edit(e){
localStorage.setItem("editid" , e)
 } 

  const [saveddata ,setsaveddata] = useState([])
 
     async function Getdata(){
         const api = await fetch("http://localhost:3000/saveditems")
         const convertdata = await api.json()
         setsaveddata(convertdata)
     }
 
     useEffect(()=>{
         Getdata()
     },[])

   
     

 const SavedItems=async(e)=>{

    const findata = saveddata.find((items) => items.namee === e.namee)

    if(findata){
        toast.error("This item already saved..")
    }else{
        const savedapi = await fetch("http://localhost:3000/saveditems",{
            method : "POST",
            body : JSON.stringify(e)
        }).then(()=>{
           toast.success("Item saved")
        }).catch(()=>{
            toast.error("Item not saved...")
        })
    }

  

 }
 
    return(
        <>
        <Toaster/>
        <h1>All users...</h1>

        <table border="3px" cellPadding="8px" cellSpacing="6px" width="65%" style={{margin:"50px auto"}}>
         <tr>
            <th>Sr. No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Delete</th>
            <th>Edit</th>
            <th>Save</th>
         </tr>
         {
            allproducts.map((items,index)=>{
                return(
                    <>
                    <tr>
                        <td>{index+1}</td>
                        <td>{items.namee}</td>
                        <td>{items.email}</td>
                        <td>{items.dob}</td>
                        <td style={{textAlign:"center"}}>
                            <button onClick={()=>{Delete(items.id);Hello()}}>Delete</button>
                        </td>
                        <td>
                            <button onClick={()=>{Edit(items.id)}}>Edit</button>
                        </td>
                        <td>
                            <button onClick={()=>{SavedItems(items)}} className="save">
                            <i className="fa-regular fa-bookmark"></i>
                            </button>
                        </td>
                    </tr>
                    </>
                )
            })
         }
        </table>
        
        
        </>
    )
}

export{ApiFetching}