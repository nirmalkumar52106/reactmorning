import React, { useEffect, useState } from "react";
import { Header } from "../components/header";
import { useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { SidebarHeader } from "../components/sidebarheader";

function EnquiryDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [userData, setUserData] = useState();

  const fetchData = async () => {
    const response = await fetch(
      `https://dgrnode.vercel.app/allenquiry/${id}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const getdata = await response.json();
    setUserData(getdata.user);
  };

  useEffect(() => {
    fetchData();
  }, []);



  //update enquiry

  const [namee , setname] = useState("")
  const [mobile , setmobile] = useState("")
  const [email , setemail] = useState("")
  const [adress , setadress] = useState("")
  const [dob , setdob] = useState("")
  const [cource , setcource] = useState("")
  const [responsee , setresponsee] = useState("")
  const [statuss , setstatuss] = useState("")
  const [comments , setcomments] = useState("")
  const [enqdate , setenqdate] = useState("")

  const namevalue=(e)=>{
    setname(e.target.value)
  }

  const mobilevalue=(e)=>{
    setmobile(e.target.value)
  }

  const emailvalue=(e)=>{
    setemail(e.target.value)
  }
  
  const adressvalue=(e)=>{
    setadress(e.target.value)
  }
  const dobvalue=(e)=>{
    setdob(e.target.value)
  }
  const courcevalue=(e)=>{
    setcource(e.target.value)
  }
  const responseevalue=(e)=>{
    setresponsee(e.target.value)
  }
  const statusvalue=(e)=>{
    setstatuss(e.target.value)
  }
  const commentsvalue=(e)=>{
    setcomments(e.target.value)
  }
  const enqdatevalue=(e)=>{
    setenqdate(e.target.value)
  }

  const formData = 
  {
    "namee" : namee.length>0  ? namee : userData && userData.namee,
    "mobile" : mobile.length>0  ? mobile : userData && userData.mobile,
    "email" : email.length>0  ? email : userData && userData.email,
    "adress" : adress.length>0  ? adress : userData && userData.adress,
    "dob" : dob.length>0  ? dob : userData && userData.dob,
    "cource" : cource.length>0  ? cource : userData && userData.cource,
    "responsee" : responsee.length>0  ? responsee : userData && userData.responsee,
    "statuss" : statuss.length>0  ? statuss : userData && userData.statuss,
    "comments" : comments.length>0  ? comments : userData && userData.comments,
    "enqdate" : enqdate.length>0  ? enqdate : userData && userData.enqdate,

  }


//loader 
const [loader , setloader] = useState(true)

  const handleSubmit = async(e) => {

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
  };
    e.preventDefault();
    const apiurl = await fetch(`https://dgrnode.vercel.app/allenquiry/${id}`,{
        method : "PATCH",
        body : JSON.stringify(formData),
        headers,
    }).then(()=>{
        toast.success("Enquiry Updated successfulyy..")
        setloader(false)
       setTimeout(() => {
        window.location.reload()
       }, 1500);
       setInterval(() => {
         setloader(true)
       }, 1500);
    }).catch(()=>{
        toast.error("please try again")
    })
  };


  //update hide unhide
  const [showw , setshoww] = useState(true)

  const Show=()=>{
    setshoww(false)
  }

  const Hide=()=>{
    setshoww(true)
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
  

  return (
    <>
    <Toaster/>
      <SidebarHeader/>

      <div className="main-detail-enquiry">
        <div className="card">
          <h2>Enquiry Details</h2>
          <p>
            <strong>Name: </strong> {userData && userData.namee}
          </p>
          <p>
            <strong>Mobile: </strong> {userData && userData.mobile}
          </p>
          <p>
            <strong>Date of Birth: </strong>
            {userData && userData.dob}
          </p>
          <p>
            <strong>Email: </strong> {userData && userData.email}
          </p>
          <p>
            <strong>Address: </strong> {userData && userData.adress}
          </p>
          <p>
            <strong>Course: </strong> {userData && userData.cource}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${userData && userData.statuss}`}>
              {userData && userData.statuss}
            </span>
          </p>
          <p>
            <strong>Response:</strong> {userData && userData.responsee}
          </p>
          <p>
            <strong>comment:</strong> {userData && userData.comments}
          </p>
          <p>
            <strong>Enquiry date:</strong> {userData && formatDate(userData.enqdate)}
          </p>
          <button onClick={()=>{Show()}}>Update Enquiry</button>
        </div>
      </div>

      {/* update enquiry */}
      <div className="enquiry-container" style={{
        position:"absolute",top:"0",left:"0",right:"0",
        zIndex:"9999",
        display:`${showw === true ? "none" : "block"}`
      }}>

        <div className="form-box" style={{margin:"50px auto"}}>
        
        <div style={{display:"flex",
          justifyContent:"space-between",alignItems:"center"
        }}>
        <h2>Update Enquiry</h2>
        <button onClick={()=>{Hide()}} style={{
  width:"50px"
}}><i className="fa-solid fa-xmark"></i></button>
        </div>
        
          
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
            onChange={namevalue}
              type="text"
              name="namee"
              placeholder={userData && userData.namee}
            />

            <label>Mobile:</label>
            <input
               onChange={mobilevalue}
              type="text"
              name="mobile"
              placeholder={userData && userData.mobile}
              
              maxLength={10}
            />

            <label>Email:</label>
            <input
               onChange={emailvalue}
              type="email"
              name="email"
              placeholder={userData && userData.email}
            />
            <label>Adress:</label>
            <input
               onChange={adressvalue}
              type="text"
              name="adress"
              placeholder={userData && userData.adress}
            />
            <label>Date of Birth:</label>
            <input
               onChange={dobvalue}
              type="date"
              name="dob"
               placeholder={userData && userData.dob}
            />
            <label> Update Cource:</label>
            <select  name="cource" onChange={courcevalue}>
              <option disabled selected  value={userData && userData.cource}>
            {userData && userData.cource ?  userData && userData.cource : "Cource"}
              </option>
              <option>Web Development</option>
              <option>Web Design</option>
              <option>Mern stack</option>
              <option>Digital marketing</option>
              <option>App Development</option>
            </select>

            <label>Update Response:</label>
            <select name="responsee"    onChange={responseevalue}>
              <option selected disabled>
              {userData && userData.responsee ?  userData && userData.responsee : "Response"}
              </option>
              <option>Negative</option>
              <option>Positive</option>
            </select>
            <label>Update Status:</label>
            <select name="statuss" onChange={statusvalue} >
              <option disabled selected>
              {userData && userData.statuss ?  userData && userData.statuss : "Status"}
              </option>
              <option>Pending</option>
              <option>NotInterested</option>
              <option>Registered</option>
            </select>
            <label>Update comment: </label>
            <textarea onChange={commentsvalue}
              name="comments" placeholder =  {userData && userData.comments ?  userData && userData.comments : ""}
            >
              {userData && userData.comments ?  userData && userData.comments : ""}
            </textarea>
                       <label>Enquiry date:</label>
           <input
            type="date" onChange={enqdatevalue}
            name="enqdate"
            placeholder= {userData && userData.enqdate ?  userData && userData.enqdate : ""}
            
            
          />

            <button type="submit">
              {loader === true ? "Update Enquiry" : <> <img style={{height:"25px"}} src="https://i.gifer.com/VAyR.gif"/> </>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export { EnquiryDetail };
