import React, { useEffect, useState } from "react";
import { Header } from "./header";
import "./app.css"

function CartSection(){

  const [data,setdata] = useState([])

  async function Apidata(){
    const apiurl = await fetch("http://localhost:3000/users")
    const finaldata = await apiurl.json()
    setdata(finaldata)
  }

  useEffect(()=>{
    Apidata()
  },[])

  const [cartdata , setcartdata] = useState([])

  async function Cartapi(){
    const cartapidata = await fetch("http://localhost:3000/cart")
    const finalcart = await  cartapidata.json()
    setcartdata(finalcart)
  }
  
  useEffect(()=>{
    Cartapi()
  })

  const addtocart=async(e)=>{

    const dataofAlreadyCart = cartdata.find((items)=>items.id)

      if(dataofAlreadyCart?.namee === e?.namee){
        alert("This product has already added to cart...")
      }else{
        const cartapi = await fetch("http://localhost:3000/cart" , {
          method : "POST" , 
          body : JSON.stringify(e)
        }).then(()=>{
          alert("Item added to cart")
        }).catch(()=>{
          alert("please try again")
        })
        
      }
      
    }


    const deleteproduct=async(e)=>{
      const deleteapi = await fetch(`http://localhost:3000/cart/${e}` , {
        method : "DELETE"
      }).then(()=>{
        alert("Item Deleted")
      }).catch(()=>{
        alert("Try again...")
      })

    }
  



  return(
    <>
    <Header totalitem={cartdata.length}/>
    <div>

    <h1>Products</h1>
      {
        data.map((items)=>{
          return(
            <>
            <div>
              <h1>{items.namee}</h1>
              <h2>{items.email}</h2>
              <h3>{items.dob}</h3>
              <button onClick={()=>{addtocart(items)}}>Add to cart</button>
            </div>
            </>
          )
        })
      }
    </div>

    <h1>Cart</h1>

    <div className="cart">


    {
      cartdata.length > 0 ? 
      <>
      {
cartdata.map((items)=>{
  return(
    <>
  
    <h1>{items.namee}</h1>
    <h2>{items.email}</h2>
    <h3>{items.dob}</h3>
    <button onClick={()=>{deleteproduct(items.id)}}>Delete</button>
    
    </>
  )
})
      }
       </>
        : 
       <>
       <h1>Cart is Empty...</h1>
        </>
    }

      
    </div>
    
    
    
    </>
  )
}

export{CartSection}