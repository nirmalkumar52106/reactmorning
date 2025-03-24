import React, { useState } from "react";
import { blogdata } from "./mywebsitedata/blog";

function Myblog(){

    const [alldata , setalldata] = useState(blogdata)
    const [filterdata , setfilterdata] = useState(alldata)


    const handlesearch=(e)=>{
        const searchvalue = e.target.value;
        
        const searchdata = alldata.filter((items)=>items.blogname.toLowerCase().startsWith(searchvalue))
        
        if(searchvalue){
            setfilterdata(searchdata)
        }else{
            setfilterdata(alldata)
        }
        
    }

    return(
        <>
        <input onChange={handlesearch} type="text" placeholder="search any blogs"/>
        <div className="blog-container">
            {
                filterdata.length>0 ? <>
                 {
filterdata.map((items)=>{
    return(
        <>
        <div className="blog">
            <h2>{items.blogname}</h2>
            <h3>{items.category}</h3>
            <button>Read More</button>
        </div>
        </>
    )
})
            }
                
                </> : <> <h3 style={{color:"white"}}>Not found</h3></>
            }
           
        </div>
        </>
    )
}

export{Myblog}