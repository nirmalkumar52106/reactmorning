import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){

    const Goto = useNavigate()

    const [email,setemail] = useState("")
    const [password , setpassword] = useState("")
    const [confirm , setconfirm] = useState("")

    const [errormsg , seterrormsg] = useState("")
    const [success , setsuccess] = useState(false)
    const [loader , setloader] = useState(false)

    const emailvalue=(e)=>{
       setemail(e.target.value)
    }
    const passwordvalue=(e)=>{
        setpassword(e.target.value)
     }
     const confirmvlaue=(e)=>{
        setconfirm(e.target.value)
     }
    

     const handleLogin=(e)=>{
        e.preventDefault()
        const data = {"email" : email , "password" : password , "confirm" : confirm}
         if(email.length>0){
            if(password.length>0){
                if(confirm.length>0){
                    if(password===confirm){
                        console.log(data)
                        setInterval(() => {
                            seterrormsg("User Login successfulyy...")
                            Goto("/home")
                        setsuccess(true)
                        setloader(false)
                        }, 2000);
                        
                        setloader(true)
                    }else{
                        seterrormsg("password and confirm password not matched")
                    }
                }else{
                    seterrormsg("please enter confirm password")
                }
            }else{
                seterrormsg("please enter password")
            }
     }else{
        seterrormsg("please enter email adress")
     }
    }

    return(
        <>

        <form>
            <input onChange={emailvalue} type="text" placeholder="enter your email"/>
            <br/>
            <input onChange={passwordvalue} type="text" placeholder="enter your password"/>
            <br/>
            <input onChange={confirmvlaue} type="text" placeholder="confirm password"/>
            <br/>
            <p style={{color: success==false ? "red" : "green"}}>{errormsg}</p>
            <button onClick={handleLogin}>
                {loader===true ? <img style={{height:"30px",width:"30px"}} src="https://i.gifer.com/origin/8b/8b4d5872105584fe9e2d445bea526eb5_w200.gif"/> : "Login"}
            </button>
        </form>
        
        
        </>
    )
}

export{Login}