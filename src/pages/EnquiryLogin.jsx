import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const users = [
    {id : 1 , username : "nirmal" , password : "1"},
    {id : 2 , username : "pankaj" , password : "gttrrtrtrt"},
  ]

  const goto =  useNavigate()


function Login(e){
    e.preventDefault();
   const userfind = users.find((items)=>items.username === formData.username && items.password === formData.password)

   if(userfind){
    toast.success("Login successfulyy....")
    localStorage.setItem("userprivatekey" , formData.username)
    setTimeout(() => {
        goto("/home")
    }, 1500);
   }else{
    toast.error("User not found...")
   }
  };

  return (
    <>
    <Toaster/>
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button onClick={Login} type="submit">Login</button>
      </form>
    </div>
    
    </>
    
  );
};

export{LoginForm};
