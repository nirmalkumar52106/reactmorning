// import React, { useEffect, useState } from "react";
// import { Header } from "../components/header";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import { SidebarHeader } from "../components/sidebarheader";

// function EnquiryDetail() {
//   const [searchParams] = useSearchParams();
//   const id = searchParams.get("id");
//   const token = localStorage.getItem("token");

//   const [userData, setUserData] = useState();

//   const fetchData = async () => {
//     const response = await fetch(
//       `https://dgrnode.vercel.app/allenquiry/${id}`,
//       {
//         method: "get",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`  
//         },
//       }
//     );
//     const getdata = await response.json();
//     setUserData(getdata.user);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);



//   //update enquiry

//   const [namee , setname] = useState("")
//   const [mobile , setmobile] = useState("")
//   const [email , setemail] = useState("")
//   const [adress , setadress] = useState("")
//   const [dob , setdob] = useState("")
//   const [cource , setcource] = useState("")
//   const [responsee , setresponsee] = useState("")
//   const [statuss , setstatuss] = useState("")
//   const [comments , setcomments] = useState("")
//   const [enqdate , setenqdate] = useState("")

//   const namevalue=(e)=>{
//     setname(e.target.value)
//   }

//   const mobilevalue=(e)=>{
//     setmobile(e.target.value)
//   }

//   const emailvalue=(e)=>{
//     setemail(e.target.value)
//   }
  
//   const adressvalue=(e)=>{
//     setadress(e.target.value)
//   }
//   const dobvalue=(e)=>{
//     setdob(e.target.value)
//   }
//   const courcevalue=(e)=>{
//     setcource(e.target.value)
//   }
//   const responseevalue=(e)=>{
//     setresponsee(e.target.value)
//   }
//   const statusvalue=(e)=>{
//     setstatuss(e.target.value)
//   }
//   const commentsvalue=(e)=>{
//     setcomments(e.target.value)
//   }
//   const enqdatevalue=(e)=>{
//     setenqdate(e.target.value)
//   }

//   const formData = 
//   {
//     "namee" : namee.length>0  ? namee : userData && userData.namee,
//     "mobile" : mobile.length>0  ? mobile : userData && userData.mobile,
//     "email" : email.length>0  ? email : userData && userData.email,
//     "adress" : adress.length>0  ? adress : userData && userData.adress,
//     "dob" : dob.length>0  ? dob : userData && userData.dob,
//     "cource" : cource.length>0  ? cource : userData && userData.cource,
//     "responsee" : responsee.length>0  ? responsee : userData && userData.responsee,
//     "statuss" : statuss.length>0  ? statuss : userData && userData.statuss,
//     "comments" : comments.length>0  ? comments : userData && userData.comments,
//     "enqdate" : enqdate.length>0  ? enqdate : userData && userData.enqdate,

//   }


// //loader 
// const [loader , setloader] = useState(true)

//   const handleSubmit = async(e) => {

//     const headers = {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Headers': 'Content-Type',
//       "Authorization": `Bearer ${token}`  
//   };
//     e.preventDefault();
//     const apiurl = await fetch(`https://dgrnode.vercel.app/allenquiry/${id}`,{
//         method : "PATCH",
//         body : JSON.stringify(formData),
//         headers,
//     }).then(()=>{
//         toast.success("Enquiry Updated successfulyy..")
//         setloader(false)
//        setTimeout(() => {
//         window.location.reload()
//        }, 1500);
//        setInterval(() => {
//          setloader(true)
//        }, 1500);
//     }).catch(()=>{
//         toast.error("please try again")
//     })
//   };


//   //update hide unhide
//   const [showw , setshoww] = useState(true)

//   const Show=()=>{
//     setshoww(false)
//   }

//   const Hide=()=>{
//     setshoww(true)
//   }

//   function formatDate(dateString) {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
// }
  
// const goto = useNavigate()

//   useEffect(()=>{
//     const tokennn = localStorage.getItem("token")
//     if(!tokennn){
//       window.location.replace("/")
//     }
//   },[goto])

//   return (
//     <>
//     <Toaster/>
//       <SidebarHeader/>

//       <div className="main-detail-enquiry">
//         <div className="card">
//           <h2>Enquiry Details</h2>
//           <p>
//             <strong>Name: </strong> {userData && userData.namee}
//           </p>
//           <p>
//             <strong>Mobile: </strong> {userData && userData.mobile}
//           </p>
//           <p>
//             <strong>Date of Birth: </strong>
//             {userData && userData.dob}
//           </p>
//           <p>
//             <strong>Email: </strong> {userData && userData.email}
//           </p>
//           <p>
//             <strong>Address: </strong> {userData && userData.adress}
//           </p>
//           <p>
//             <strong>Course: </strong> {userData && userData.cource}
//           </p>
//           <p>
//             <strong>Status:</strong>{" "}
//             <span className={`status ${userData && userData.statuss}`}>
//               {userData && userData.statuss}
//             </span>
//           </p>
//           <p>
//             <strong>Response:</strong> {userData && userData.responsee}
//           </p>
//           <p>
//             <strong>comment:</strong> {userData && userData.comments}
//           </p>
//           <p>
//             <strong>Enquiry date:</strong> {userData && formatDate(userData.enqdate)}
//           </p>
//           <button onClick={()=>{Show()}}>Update Enquiry</button>
//         </div>
//       </div>

//       {/* update enquiry */}
//       <div className="enquiry-container" style={{
//         position:"absolute",top:"0",left:"0",right:"0",
//         zIndex:"9999", 
//         display:`${showw === true ? "none" : "block"}` 
//       }}>

//         <div className="form-box" style={{margin:"50px auto"}}>
        
//         <div style={{display:"flex",
//           justifyContent:"space-between",alignItems:"center"
//         }}>
//         <h2>Update Enquiry</h2>
//         <button  onClick={()=>{Hide()}} style={{
//           border : "none",
//           background : "transparent"
// }}><i style={{
//    background : "red",
//   color : "white",
//   border : "none" ,
//   borderRadius : "10px",
//   padding : "10px 20px",
//   fontSize : "20px",
//   textAlign : "center",
//   cursor : "pointer"
// }} className="fa-solid fa-xmark"></i></button>
//         </div>
        
          
//           <form className="form-group" onSubmit={handleSubmit}>
//             <label>Name:</label>
//             <input
//             onChange={namevalue}
//               type="text"
//               name="namee"
//               placeholder={userData && userData.namee}
//             />

//             <label>Mobile:</label>
//             <input
//                onChange={mobilevalue}
//               type="text"
//               name="mobile"
//               placeholder={userData && userData.mobile}
              
//               maxLength={10}
//             />

//             <label>Email:</label>
//             <input
//                onChange={emailvalue}
//               type="email"
//               name="email"
//               placeholder={userData && userData.email}
//             />
//             <label>Adress:</label>
//             <input
//                onChange={adressvalue}
//               type="text"
//               name="adress"
//               placeholder={userData && userData.adress}
//             />
//             <label>Date of Birth:</label>
//             <input
//                onChange={dobvalue}
//               type="date"
//               name="dob"
//                placeholder={userData && userData.dob}
//             />
//             <label> Update Cource:</label>
//             <select  name="cource" onChange={courcevalue}>
//               <option disabled selected  value={userData && userData.cource}>
//             {userData && userData.cource ?  userData && userData.cource : "Cource"}
//               </option>
//               <option>Web Development</option>
//               <option>Web Design</option>
//               <option>Mern stack</option>
//               <option>Digital marketing</option>
//               <option>App Development</option>
//             </select>

//             <label>Update Response:</label>
//             <select name="responsee"    onChange={responseevalue}>
//               <option selected disabled>
//               {userData && userData.responsee ?  userData && userData.responsee : "Response"}
//               </option>
//               <option>Negative</option>
//               <option>Positive</option>
//             </select>
//             <label>Update Status:</label>
//             <select name="statuss" onChange={statusvalue} >
//               <option disabled selected>
//               {userData && userData.statuss ?  userData && userData.statuss : "Status"}
//               </option>
//               <option>Pending</option>
//               <option>NotInterested</option>
//               <option>Registered</option>
//             </select>
//             <label>Update comment: </label>
//             <textarea onChange={commentsvalue}
//               name="comments" placeholder =  {userData && userData.comments ?  userData && userData.comments : ""}
//             >
//               {userData && userData.comments ?  userData && userData.comments : ""}
//             </textarea>
//                        <label>Enquiry date:</label>
//            <input
//             type="date" onChange={enqdatevalue}
//             name="enqdate"
//             placeholder= {userData && userData.enqdate ?  userData && userData.enqdate : ""}
            
            
//           />

//             <button type="submit">
//               {loader === true ? "Update Enquiry" : <> <img style={{height:"25px"}} src="https://i.gifer.com/VAyR.gif"/> </>}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export { EnquiryDetail };

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { SidebarHeader } from "../components/sidebarheader";

function EnquiryDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const token = localStorage.getItem("token");
  const goto = useNavigate();

  const [userData, setUserData] = useState(null);
  const [showw, setshoww] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [loader, setloader] = useState(false);

  const [namee, setname] = useState("");
  const [mobile, setmobile] = useState("");
  const [email, setemail] = useState("");
  const [adress, setadress] = useState("");
  const [dob, setdob] = useState("");
  const [cource, setcource] = useState("");
  const [responsee, setresponsee] = useState("");
  const [statuss, setstatuss] = useState("");
  const [comments, setcomments] = useState("");
  const [enqdate, setenqdate] = useState("");

  useEffect(() => {
    const tokennn = localStorage.getItem("token");
    if (!tokennn) {
      window.location.replace("/");
    }
  }, [goto]);

  const fetchData = useCallback(async () => {
    try {
      setPageLoading(true);

      const response = await fetch(
        `https://dgrnode.vercel.app/allenquiry/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const getdata = await response.json();
      setUserData(getdata.user);
    } catch (error) {
      toast.error("Failed to load enquiry.");
    } finally {
      setPageLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formData = useMemo(
    () => ({
      namee: namee || userData?.namee,
      mobile: mobile || userData?.mobile,
      email: email || userData?.email,
      adress: adress || userData?.adress,
      dob: dob || userData?.dob,
      cource: cource || userData?.cource,
      responsee: responsee || userData?.responsee,
      statuss: statuss || userData?.statuss,
      comments: comments || userData?.comments,
      enqdate: enqdate || userData?.enqdate,
    }),
    [
      namee,
      mobile,
      email,
      adress,
      dob,
      cource,
      responsee,
      statuss,
      comments,
      enqdate,
      userData,
    ]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setloader(true);

      await fetch(
        `https://dgrnode.vercel.app/allenquiry/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Enquiry Updated successfully..");

      setUserData(formData);
      setshoww(true);
    } catch (error) {
      toast.error("please try again");
    } finally {
      setloader(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (pageLoading) {
    return (
      <>
        <SidebarHeader />
        <div style={styles.loaderWrap}>
          <div style={styles.bigLoader}></div>
          <h3>Loading Enquiry...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <SidebarHeader />

      <div style={styles.mainWrap}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Enquiry Details</h2>

          <p><strong>Name:</strong> {userData?.namee}</p>
          <p><strong>Mobile:</strong> {userData?.mobile}</p>
          <p><strong>Date of Birth:</strong> {userData?.dob}</p>
          <p><strong>Email:</strong> {userData?.email}</p>
          <p><strong>Address:</strong> {userData?.adress}</p>
          <p><strong>Course:</strong> {userData?.cource}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                ...styles.status,
                background:
                  userData?.statuss === "Registered"
                    ? "#16a34a"
                    : userData?.statuss === "Pending"
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            >
              {userData?.statuss}
            </span>
          </p>

          <p><strong>Response:</strong> {userData?.responsee}</p>
          <p><strong>Comment:</strong> {userData?.comments}</p>
          <p><strong>Enquiry Date:</strong> {formatDate(userData?.enqdate)}</p>

          <button
            style={styles.btn}
            onClick={() => setshoww(false)}
          >
            Update Enquiry
          </button>
        </div>
      </div>

      {showw === false && (
        <div style={styles.overlay}>
          <div style={styles.popup}>

            <div style={styles.popupHead}>
              <h2>Update Enquiry</h2>

              <button
                style={styles.closeBtn}
                onClick={() => setshoww(true)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              style={styles.form}
            >
              <input
                type="text"
                placeholder={userData?.namee}
                onChange={(e) => setname(e.target.value)}
              />

              <input
                type="text"
                placeholder={userData?.mobile}
                maxLength={10}
                onChange={(e) => setmobile(e.target.value)}
              />

              <input
                type="email"
                placeholder={userData?.email ? userData?.email : "Email"}
                onChange={(e) => setemail(e.target.value)}
              />

              <input
                type="text"
                placeholder={userData?.adress ? userData?.adress : "Adress"}
                onChange={(e) => setadress(e.target.value)}
              />

              {/* <input
                type="date"
                onChange={(e) => setdob(e.target.value)}
              /> */}
              <h4 style={{margin : "0"}}>Course: </h4>
              <select onChange={(e) => setcource(e.target.value)}>
                <option>{userData?.cource}</option>
            <option>Web Development</option>
            <option>Web Design</option>
            <option>Digital marketing</option>
            <option>App Development</option>
            <option>Graphic Design</option>
            <option>Video Editing</option>
            <option>Data Science</option>
              </select>

<h4 style={{margin : "0"}}>Response: </h4>
              <select onChange={(e) => setresponsee(e.target.value)}>
                <option>{userData?.responsee}</option>
                <option>Negative</option>
                <option>Positive</option>
              </select>

<h4 style={{margin : "0"}}>Status: </h4>
              <select onChange={(e) => setstatuss(e.target.value)}>
                <option>{userData?.statuss}</option>
                <option>Pending</option>
                <option>NotInterested</option>
                <option>Registered</option>
              </select> 
              <label><strong>Update Follow up Comment:</strong></label>            
              <textarea
                placeholder={userData?.comments}
                onChange={(e) => setcomments(e.target.value)}
              ></textarea>

              <input
                type="date"
                onChange={(e) => setenqdate(e.target.value)}
              />

              <button
                type="submit"
                style={styles.submitBtn}
                disabled={loader}
              >
                {loader ? (
                  <>
                    <span style={styles.smallLoader}></span>
                    Updating...
                  </>
                ) : (
                  "Update Enquiry"
                )}
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  mainWrap: {
    padding: "30px",
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  card: {
    maxWidth: "700px",
    margin: "auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,.08)",
  },

  heading: {
    marginBottom: "20px",
    color: "#111827",
  },

  btn: {
    marginTop: "20px",
    padding: "14px 22px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  status: {
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "30px",
    fontSize: "13px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  popup: {
    width: "700px",
    maxWidth: "95%",
    maxHeight: "90vh",
    overflow: "auto",
    background: "#fff",
    borderRadius: "18px",
    padding: "25px",
  },

  popupHead: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  closeBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 14px",
    cursor: "pointer",
  },

  form: {
    display: "grid",
    gap: "14px",
  },

  submitBtn: {
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#16a34a",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
  },

  loaderWrap: {
    height: "100vh",
    display: "grid",
    placeItems: "center",
  },

  bigLoader: {
    width: "55px",
    height: "55px",
    border: "5px solid #ddd",
    borderTop: "5px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  smallLoader: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(255,255,255,.4)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
};

export { EnquiryDetail };
