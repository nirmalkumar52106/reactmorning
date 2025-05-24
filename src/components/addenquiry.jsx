import { useState } from "react";
import { Header } from "./header";
import toast, { Toaster } from "react-hot-toast";
import { SidebarHeader } from "./sidebarheader";


 function EnquiryForm() {
  const [formData, setFormData] = useState(
    { namee: "", mobile: "", email: "" , 
      adress : "" , dob: "" ,cource : "",
      responsee : "" , statuss : "" , comments : "" ,
      enqdate : ""
     }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
     };
    e.preventDefault();
    const apiurl = await fetch("https://dgrnode.vercel.app/addenquiry",{
        method : "POST",
        body : JSON.stringify(formData),
        headers,
    }).then(()=>{
        toast.success("New Enquiry added..")
       setTimeout(() => {
        window.location.reload()
       }, 1000);
    }).catch(()=>{
        toast.error("please try again")
    })
  };

  const userprivatekey = localStorage.getItem("userprivatekey")
    if(!userprivatekey){
      setTimeout(() => {
          window.location.replace("/")
      }, 500);
    }

  return (
    <>
    <Toaster/>
    <SidebarHeader/>
    <div className="enquiry-container">
      <div className="form-box">
        <h2>Add Enquiry</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="namee"
            value={formData.namee}
            onChange={handleChange}
            required
          />

          <label>Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            maxLength={10}
          />

            <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            
          />
            <label>Adress:</label>
          <input
            type="text"
            name="adress"
            value={formData.adress}
            onChange={handleChange}
            
          />
           <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            
          />
              <label>Cource:</label>
              <select onChange={handleChange} name="cource">
                <option disabled selected>Choose cource</option>
                <option >Web Development</option>
                <option >Web Design</option>
                <option>Mern stack</option>
                <option >Digital marketing</option>
                <option>App Development</option>
             
              </select>
         
              <label>Response:</label>
              <select name="responsee" onChange={handleChange}>
                <option selected disabled>Response</option>
                <option>Negative</option>
                <option>Positive</option>
              </select>
           <label>Status:</label>
           <select name="statuss" onChange={handleChange}>
            <option disabled selected>Status</option>
            <option>Pending</option>
            <option>NotInterested</option>
            <option>Registered</option>
           </select>
           <label>Add comment: </label>
           <textarea name="comments" onChange={handleChange} required ></textarea>
           <label>Enquiry date:</label>
           <input
            type="date"
            name="enqdate"
            onChange={handleChange}
            
          />
          <button type="submit">Add Enquiry</button>
        </form>
      </div>
    </div>
    </>
    
  );
}

export{EnquiryForm}