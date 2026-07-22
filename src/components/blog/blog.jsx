// import React, { useState } from "react";
// import { Allblog } from "./allblog";
// import toast, { Toaster } from "react-hot-toast";
// import { SidebarHeader } from "../sidebarheader";


// function Blog() {
//   const token = localStorage.getItem("token")
//   const [show, setshow] = useState(true);

//   const AddblogShow = () => {
//     setshow(false);
//   };

//   const AddblogHide = () => {
//     setshow(true);
//   };



//   //add blog

//   const [blogtitle, setblogtitle] = useState("");
//   const [blogdesc, setblogdesc] = useState("");
//   const [blogimage, setblogimage] = useState(null);
//   const [metatitle, setmetatitle] = useState("");
//   const [metakey, setmetakey] = useState("");
//   const [metadesc, setmetadesc] = useState("");
//   const [slugurl, setslugurl] = useState("");
//   const [blogdate, setblogdate] = useState("");

//  const titlevalue = (e) => {
//   const title = e.target.value;

//   setblogtitle(title);

//   setslugurl(generateSlug(title));
// };

//  const descvalue = (e) => {
//   setblogdesc(e.target.value);
// };

// const imagevalue = (e) => {
//   setblogimage(e.target.files[0]);
// };

//   const metatitlevalue = (e) => {
//     setmetatitle(e.target.value);
//   };

//   const metadescvalue = (e) => {
//     setmetadesc(e.target.value);
//   };

//   const metakeyvalue = (e) => {
//     setmetakey(e.target.value);
//   };

 
//   const blogdatevalue = (e) => {
//     setblogdate(e.target.value);
//   };

//   const generateSlug = (text) => {
//   return text
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/--+/g, "-");
// };

  
//   const Addblog = async (e) => {
//   e.preventDefault();

//   try {
//     const formData = new FormData();

//     formData.append("blogtitle", blogtitle);
//     formData.append("blogdesc", blogdesc);
//     formData.append("blogimage", blogimage);
//     formData.append("metatitle", metatitle);
//     formData.append("metadesc", metadesc);
//     formData.append("metakey", metakey);
//     formData.append("slugurl", slugurl);
//     formData.append("blogdate", blogdate);

//     const response = await fetch(
//       "https://dgrnode.vercel.app/addblog",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }
//     );

//     const data = await response.json();

//     if (data.status) {
//       toast.success("New Blog Added..");

//       setTimeout(() => {
//         window.location.reload();
//       }, 1500);
//     } else {
//       toast.error(data.message);
//     }
//   } catch (err) {
//     console.log(err);
//     toast.error("Something went wrong...!");
//   }
// };

//   return (
//     <>

      
//     <SidebarHeader />

// <div className="filter-section" style={{ margin: "50px auto" }}>
//   <button
//     onClick={AddblogShow}
//     style={{ backgroundColor: "green", fontSize: "16px" }}
//   >
//     <span>+</span> Add Blog
//   </button>
// </div>

// <Allblog />

// <section
//   id="blog"
//   style={{
//     display: `${show === true ? "none" : "block"}`,
//     position: "absolute",
//     top: "0",
//     left: "0",
//     right: "0",
//     zIndex: "9999",
//   }}
// >
//   <Toaster />

//   <h2 style={{ textAlign: "center", marginTop: "30px" }}>
//     Add Blog
//   </h2>

//   <div className="jdb-blog-wrapper">
//     <button
//       className="jdb-close-btn"
//       onClick={() => {
//         AddblogHide();
//       }}
//     >
//       <i className="fa-solid fa-xmark"></i>
//     </button>

//     <form className="jdb-blog-form">
//       <div className="jdb-form-group">
//         <label htmlFor="blogtitle">Blog Title</label>
//         <input
//           onChange={titlevalue}
//           type="text"
//           id="blogtitle"
//           name="blogtitle"
//           placeholder="Enter Blog Title"
//           required
//         />
//       </div>

//       <div className="jdb-form-group">
//         <label htmlFor="blogdate">Blog Date</label>
//         <input
//           onChange={blogdatevalue}
//           type="date"
//           id="blogdate"
//           name="blogdate"
//           required
//         />
//       </div>

//       <div className="jdb-form-group">
//         <label htmlFor="metatitle">Meta Title</label>
//         <input
//           onChange={metatitlevalue}
//           type="text"
//           id="metatitle"
//           name="metatitle"
//           placeholder="Meta Title"
//           required
//         />
//       </div>

//       <div className="jdb-form-group">
//         <label htmlFor="slugurl">Slug URL</label>
//         <input
//           value={slugurl}
//           readOnly
//           type="text"
//           id="slugurl"
//           name="slugurl"
//         />
//       </div>

//       <div className="jdb-full-width">
//         <label htmlFor="metakey">Meta Keywords</label>
//         <input
//           onChange={metakeyvalue}
//           type="text"
//           id="metakey"
//           name="metakey"
//           placeholder="react js, node js, web development"
//           required
//         />
//       </div>

//       <div className="jdb-full-width">
//         <label htmlFor="metadesc">Meta Description</label>
//         <textarea
//           onChange={metadescvalue}
//           id="metadesc"
//           name="metadesc"
//           rows="4"
//           required
//         ></textarea>
//       </div>

//       <div className="jdb-full-width">
//         <label htmlFor="blogdes">Blog Description</label>

//        <textarea
//   value={blogdesc}
//   onChange={descvalue}
//   placeholder="Paste Full HTML Blog Content Here..."
//   rows="25"
//   style={{
//     width: "100%",
//     minHeight: "500px",
//     padding: "15px",
//     border: "1px solid #dbe3ea",
//     borderRadius: "12px",
//     fontSize: "14px",
//     fontFamily: "monospace",
//     resize: "vertical",
//     background: "#f8fafc"
//   }}
// />
//       </div>

//       <div className="jdb-image-upload-section">
//         <label>Blog Featured Image</label>

//         <div className="jdb-upload-box">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={imagevalue}
//             id="blogimage"
//             hidden
//           />

//           <label
//             htmlFor="blogimage"
//             className="jdb-upload-label"
//           >
//             <i className="fa-solid fa-cloud-arrow-up"></i>

//             <h4>Upload Blog Image</h4>

//             <p>Click To Upload Image</p>

//             <span>PNG • JPG • WEBP</span>
//           </label>
//         </div>

//         {blogimage && (
//           <div className="jdb-preview-box">
//             <img
//               src={URL.createObjectURL(blogimage)}
//               alt="preview"
//             />
//           </div>
//         )}
//       </div>

//       <button
//         onClick={Addblog}
//         type="submit"
//         className="jdb-submit-btn"
//       >
//         Publish Blog
//       </button>
//     </form>
//   </div>
// </section>

// <style>
//   {`
//   .jdb-blog-wrapper{
//     max-width:1100px;
//     margin:auto;
//     background:#fff;
//     padding:30px;
//     border-radius:20px;
//     box-shadow:0 15px 40px rgba(0,0,0,.15);
//     position:relative;
//   }

//   .jdb-blog-form{
//     display:grid;
//     grid-template-columns:repeat(2,1fr);
//     gap:20px;
//     padding : 30px
//   }

//   .jdb-form-group{
//     display:flex;
//     flex-direction:column;
//     margin : 10px
//   }

//   .jdb-form-group label,
//   .jdb-full-width label,
//   .jdb-image-upload-section label{
//     font-weight:600;
//     margin-bottom:8px;
//     color:#1e293b;
//   }

//   .jdb-form-group input,
//   .jdb-full-width input,
//   .jdb-full-width textarea{
//     width:100%;
//     padding:14px;
//     border-radius:12px;
//     border:1px solid #dbe3ea;
//     outline:none;
//   }

//   .jdb-full-width{
//     grid-column:1/3;
//   }

//   .jdb-image-upload-section{
//     grid-column:1/3;
//   }

//   .jdb-upload-box{
//     border:2px dashed #2563eb;
//     border-radius:18px;
//     overflow:hidden;
//     background:#f8fbff;
//   }

//   .jdb-upload-label{
//     height:220px;
//     display:flex;
//     flex-direction:column;
//     justify-content:center;
//     align-items:center;
//     cursor:pointer;
//   }

//   .jdb-upload-label i{
//     font-size:55px;
//     color:#2563eb;
//     margin-bottom:15px;
//   }

//   .jdb-upload-label h4{
//     margin:0;
//     color:#2563eb;
//   }

//   .jdb-preview-box{
//     margin-top:20px;
//   }

//   .jdb-preview-box img{
//     width:100%;
//     max-width:500px;
//     height:280px;
//     object-fit:cover;
//     border-radius:16px; 
//     box-shadow:0 10px 25px rgba(0,0,0,.15);
//   }

//   .jdb-submit-btn{
//     grid-column:1/3;
//     border:none;
//     background:linear-gradient(135deg,#2563eb,#1d4ed8);
//     color:#fff;
//     padding:15px;
//     border-radius:12px;
//     font-size:17px;
//     font-weight:600;
//     cursor:pointer;
//   }

//   .jdb-close-btn{
//     position:absolute;
//     top:15px;
//     right:15px;
//     width:45px;
//     height:45px;
//     border:none;
//     border-radius:50%;
//     background:#ef4444;
//     color:#fff;
//     cursor:pointer;
//   }

//   .ql-editor{
//     min-height:300px;
//   }

//   @media(max-width:768px){

//     .jdb-blog-wrapper{
//       padding:15px;
//     }

//     .jdb-blog-form{
//       grid-template-columns:1fr;
//     }

//     .jdb-full-width,
//     .jdb-image-upload-section,
//     .jdb-submit-btn{
//       grid-column:auto;
//     }

//     .jdb-preview-box img{
//       height:220px;
//     }
//   }
// `}
// </style>
//     </>
//   );
// }

// export { Blog };

// import React, { useState } from "react";
// import { Allblog } from "./allblog";
// import toast, { Toaster } from "react-hot-toast";
// import { SidebarHeader } from "../sidebarheader";

// function Blog() {
//   const token = localStorage.getItem("token");
//   const [show, setshow] = useState(true);
//   const [humanLoading, setHumanLoading] = useState(false);
//   const [analysis, setAnalysis] = useState(null);

//   const AddblogShow = () => {
//     setshow(false);
//   };

//   const AddblogHide = () => {
//     setshow(true);
//   };

//   const [blogtitle, setblogtitle] = useState("");
//   const [blogdesc, setblogdesc] = useState("");
//   const [blogimage, setblogimage] = useState(null);
//   const [metatitle, setmetatitle] = useState("");
//   const [metakey, setmetakey] = useState("");
//   const [metadesc, setmetadesc] = useState("");
//   const [slugurl, setslugurl] = useState("");
//   const [blogdate, setblogdate] = useState("");

//   const titlevalue = (e) => {
//     const title = e.target.value;
//     setblogtitle(title);
//     setslugurl(generateSlug(title));
//   };

//   const descvalue = (e) => {
//     setblogdesc(e.target.value);
//   };

//   const imagevalue = (e) => {
//     setblogimage(e.target.files[0]);
//   };

//   const metatitlevalue = (e) => {
//     setmetatitle(e.target.value);
//   };

//   const metadescvalue = (e) => {
//     setmetadesc(e.target.value);
//   };

//   const metakeyvalue = (e) => {
//     setmetakey(e.target.value);
//   };

//   const blogdatevalue = (e) => {
//     setblogdate(e.target.value);
//   };

//   const generateSlug = (text) => {
//     return text
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/--+/g, "-");
//   };

//   const analyzeContent = (content) => {
//     const plainText = content.replace(/<[^>]*>/g, " ");
//     const words = plainText.trim().split(/\s+/).filter(Boolean);
//     const sentences = plainText.split(/[.!?]/).filter((s) => s.trim() !== "");

//     const aiPhrases = [
//       "furthermore",
//       "moreover",
//       "additionally",
//       "in conclusion",
//       "digital landscape",
//       "delve",
//       "unlock",
//       "leverage",
//       "utilize",
//       "seamless",
//       "robust",
//       "comprehensive",
//       "cutting-edge",
//       "game-changer",
//       "it is important to note",
//       "it is worth noting",
//       "in today's digital world",
//       "in today's digital landscape",
//       "elevate",
//       "harness",
//       "realm",
//       "landscape",
//     ];

//     let foundAiWords = [];

//     aiPhrases.forEach((item) => {
//       if (plainText.toLowerCase().includes(item)) {
//         foundAiWords.push(item);
//       }
//     });

//     const avgSentenceLength =
//       sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;

//     const aiScore = Math.min(
//       95,
//       foundAiWords.length * 8 + (avgSentenceLength > 20 ? 25 : 10)
//     );

//     return {
//       totalWords: words.length,
//       totalSentences: sentences.length,
//       avgSentenceLength,
//       aiScore,
//       humanScore: 100 - aiScore,
//       foundAiWords,
//     };
//   };

//   const localHumanize = (content) => {
//     let text = content;

//     const replacements = [
//       ["In today's digital landscape", "Today"],
//       ["In today's digital world", "Today"],
//       ["Furthermore", "Also"],
//       ["Moreover", "Also"],
//       ["Additionally", "Along with this"],
//       ["In conclusion", "Overall"],
//       ["It is important to note that", "Keep in mind that"],
//       ["It is worth noting that", "One thing to remember is that"],
//       ["delve into", "understand"],
//       ["Delve into", "Understand"],
//       ["unlock", "learn"],
//       ["Unlock", "Learn"],
//       ["leverage", "use"],
//       ["Leverage", "Use"],
//       ["utilize", "use"],
//       ["Utilize", "Use"],
//       ["enhance", "improve"],
//       ["Enhance", "Improve"],
//       ["seamless", "smooth"],
//       ["Seamless", "Smooth"],
//       ["robust", "strong"],
//       ["Robust", "Strong"],
//       ["comprehensive", "complete"],
//       ["Comprehensive", "Complete"],
//       ["cutting-edge", "modern"],
//       ["Cutting-edge", "Modern"],
//       ["game-changer", "useful solution"],
//       ["Game-changer", "Useful solution"],
//       ["digital landscape", "online world"],
//       ["Digital landscape", "Online world"],
//       ["elevate", "improve"],
//       ["Elevate", "Improve"],
//       ["harness", "use"],
//       ["Harness", "Use"],
//       ["realm", "field"],
//       ["Realm", "Field"],
//     ];

//     replacements.forEach(([oldWord, newWord]) => {
//       const regex = new RegExp(oldWord, "g");
//       text = text.replace(regex, newWord);
//     });

//     text = text
//       .replace(/This article explores/gi, "In this guide, you will learn")
//       .replace(/This blog explores/gi, "In this blog, we will understand")
//       .replace(/This guide explores/gi, "This guide explains")
//       .replace(/plays a crucial role/gi, "is very important")
//       .replace(/has revolutionized/gi, "has changed")
//       .replace(/various industries/gi, "many industries")
//       .replace(/numerous benefits/gi, "many benefits")
//       .replace(/a wide range of/gi, "many")
//       .replace(/due to the fact that/gi, "because")
//       .replace(/in order to/gi, "to")
//       .replace(/with the help of/gi, "using")
//       .replace(/\. /g, ".\n\n")
//       .replace(/\n{3,}/g, "\n\n")
//       .trim();

//     return text;
//   };

//   const HumanizeBlogContent = () => {
//     if (!blogdesc.trim()) {
//       toast.error("Please paste blog content first");
//       return;
//     }

//     setHumanLoading(true);

//     setTimeout(() => {
//       const report = analyzeContent(blogdesc);
//       const humanContent = localHumanize(blogdesc);

//       setAnalysis(report);
//       setblogdesc(humanContent);
//       setHumanLoading(false);

//       toast.success("Content analyzed and converted successfully");
//     }, 600);
//   };

//   const Addblog = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();

//       formData.append("blogtitle", blogtitle);
//       formData.append("blogdesc", blogdesc);
//       formData.append("blogimage", blogimage);
//       formData.append("metatitle", metatitle);
//       formData.append("metadesc", metadesc);
//       formData.append("metakey", metakey);
//       formData.append("slugurl", slugurl);
//       formData.append("blogdate", blogdate);

//       const response = await fetch("https://dgrnode.vercel.app/addblog", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.status) {
//         toast.success("New Blog Added..");

//         setTimeout(() => {
//           window.location.reload();
//         }, 1500);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error("Something went wrong...!");
//     }
//   };

//   return (
//     <>
//       <SidebarHeader />

//       <div className="filter-section" style={{ margin: "50px auto" }}>
//         <button
//           onClick={AddblogShow}
//           style={{ backgroundColor: "green", fontSize: "16px" }}
//         >
//           <span>+</span> Add Blog
//         </button>
//       </div>

//       <Allblog />

//       <section
//         id="blog"
//         style={{
//           display: `${show === true ? "none" : "block"}`,
//           position: "absolute",
//           top: "0",
//           left: "0",
//           right: "0",
//           zIndex: "9999",
//         }}
//       >
//         <Toaster />

//         <h2 style={{ textAlign: "center", marginTop: "30px" }}>Add Blog</h2>

//         <div className="jdb-blog-wrapper">
//           <button
//             className="jdb-close-btn"
//             onClick={() => {
//               AddblogHide();
//             }}
//           >
//             <i className="fa-solid fa-xmark"></i>
//           </button>

//           <form className="jdb-blog-form">
//             <div className="jdb-form-group">
//               <label htmlFor="blogtitle">Blog Title</label>
//               <input
//                 onChange={titlevalue}
//                 type="text"
//                 id="blogtitle"
//                 name="blogtitle"
//                 placeholder="Enter Blog Title"
//                 required
//               />
//             </div>

//             <div className="jdb-form-group">
//               <label htmlFor="blogdate">Blog Date</label>
//               <input
//                 onChange={blogdatevalue}
//                 type="date"
//                 id="blogdate"
//                 name="blogdate"
//                 required
//               />
//             </div>

//             <div className="jdb-form-group">
//               <label htmlFor="metatitle">Meta Title</label>
//               <input
//                 onChange={metatitlevalue}
//                 type="text"
//                 id="metatitle"
//                 name="metatitle"
//                 placeholder="Meta Title"
//                 required
//               />
//             </div>

//             <div className="jdb-form-group">
//               <label htmlFor="slugurl">Slug URL</label>
//               <input
//                 value={slugurl}
//                 readOnly
//                 type="text"
//                 id="slugurl"
//                 name="slugurl"
//               />
//             </div>

//             <div className="jdb-full-width">
//               <label htmlFor="metakey">Meta Keywords</label>
//               <input
//                 onChange={metakeyvalue}
//                 type="text"
//                 id="metakey"
//                 name="metakey"
//                 placeholder="react js, node js, web development"
//                 required
//               />
//             </div>

//             <div className="jdb-full-width">
//               <label htmlFor="metadesc">Meta Description</label>
//               <textarea
//                 onChange={metadescvalue}
//                 id="metadesc"
//                 name="metadesc"
//                 rows="4"
//                 required
//               ></textarea>
//             </div>

//             <div className="jdb-full-width">
//               <label htmlFor="blogdes">Blog Description</label>

//               <div className="humanize-box">
//                 <button
//                   type="button"
//                   onClick={HumanizeBlogContent}
//                   className="humanize-btn"
//                   disabled={humanLoading}
//                 >
//                   {humanLoading ? "Converting..." : "Analyze & Convert Content"}
//                 </button>

//                 {analysis && (
//                   <div className="analysis-card">
//                     <p>
//                       <b>Total Words:</b> {analysis.totalWords}
//                     </p>
//                     <p>
//                       <b>Total Sentences:</b> {analysis.totalSentences}
//                     </p>
//                     <p>
//                       <b>Avg Sentence:</b> {analysis.avgSentenceLength} words
//                     </p>
//                     <p>
//                       <b>AI Score:</b> {analysis.aiScore}%
//                     </p>
//                     <p>
//                       <b>Human Score:</b> {analysis.humanScore}%
//                     </p>
//                     <p>
//                       <b>AI Words:</b>{" "}
//                       {analysis.foundAiWords.length > 0
//                         ? analysis.foundAiWords.join(", ")
//                         : "No major AI words found"}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <textarea
//                 value={blogdesc}
//                 onChange={descvalue}
//                 placeholder="Paste Full HTML Blog Content Here..."
//                 rows="25"
//                 style={{
//                   width: "100%",
//                   minHeight: "500px",
//                   padding: "15px",
//                   border: "1px solid #dbe3ea",
//                   borderRadius: "12px",
//                   fontSize: "14px",
//                   fontFamily: "monospace",
//                   resize: "vertical",
//                   background: "#f8fafc",
//                 }}
//               />
//             </div>

//             <div className="jdb-image-upload-section">
//               <label>Blog Featured Image</label>

//               <div className="jdb-upload-box">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={imagevalue}
//                   id="blogimage"
//                   hidden
//                 />

//                 <label htmlFor="blogimage" className="jdb-upload-label">
//                   <i className="fa-solid fa-cloud-arrow-up"></i>

//                   <h4>Upload Blog Image</h4>

//                   <p>Click To Upload Image</p>

//                   <span>PNG • JPG • WEBP</span>
//                 </label>
//               </div>

//               {blogimage && (
//                 <div className="jdb-preview-box">
//                   <img src={URL.createObjectURL(blogimage)} alt="preview" />
//                 </div>
//               )}
//             </div>

//             <button onClick={Addblog} type="submit" className="jdb-submit-btn">
//               Publish Blog
//             </button>
//           </form>
//         </div>
//       </section>

//       <style>
//         {`
//   .jdb-blog-wrapper{
//     max-width:1100px;
//     margin:auto;
//     background:#fff;
//     padding:30px;
//     border-radius:20px;
//     box-shadow:0 15px 40px rgba(0,0,0,.15);
//     position:relative;
//   }

//   .jdb-blog-form{
//     display:grid;
//     grid-template-columns:repeat(2,1fr);
//     gap:20px;
//     padding : 30px
//   }

//   .jdb-form-group{
//     display:flex;
//     flex-direction:column;
//     margin : 10px
//   }

//   .jdb-form-group label,
//   .jdb-full-width label,
//   .jdb-image-upload-section label{
//     font-weight:600;
//     margin-bottom:8px;
//     color:#1e293b;
//   }

//   .jdb-form-group input,
//   .jdb-full-width input,
//   .jdb-full-width textarea{
//     width:100%;
//     padding:14px;
//     border-radius:12px;
//     border:1px solid #dbe3ea;
//     outline:none;
//   }

//   .jdb-full-width{
//     grid-column:1/3;
//   }

//   .jdb-image-upload-section{
//     grid-column:1/3;
//   }

//   .humanize-box{
//     background:#f1f5f9;
//     border:1px solid #dbe3ea;
//     border-radius:14px;
//     padding:15px;
//     margin-bottom:15px;
//   }

//   .humanize-btn{
//     border:none;
//     background:linear-gradient(135deg,#16a34a,#15803d);
//     color:white;
//     padding:12px 18px;
//     border-radius:10px;
//     font-size:15px;
//     font-weight:600;
//     cursor:pointer;
//     margin-bottom:12px;
//   }

//   .humanize-btn:disabled{
//     opacity:.7;
//     cursor:not-allowed;
//   }

//   .analysis-card{
//     display:grid;
//     grid-template-columns:repeat(3,1fr);
//     gap:10px;
//     background:#fff;
//     padding:12px;
//     border-radius:12px;
//     border:1px solid #e2e8f0;
//   }

//   .analysis-card p{
//     margin:0;
//     font-size:14px;
//     color:#334155;
//   }

//   .jdb-upload-box{
//     border:2px dashed #2563eb;
//     border-radius:18px;
//     overflow:hidden;
//     background:#f8fbff;
//   }

//   .jdb-upload-label{
//     height:220px;
//     display:flex;
//     flex-direction:column;
//     justify-content:center;
//     align-items:center;
//     cursor:pointer;
//   }

//   .jdb-upload-label i{
//     font-size:55px;
//     color:#2563eb;
//     margin-bottom:15px;
//   }

//   .jdb-upload-label h4{
//     margin:0;
//     color:#2563eb;
//   }

//   .jdb-preview-box{
//     margin-top:20px;
//   }

//   .jdb-preview-box img{
//     width:100%;
//     max-width:500px;
//     height:280px;
//     object-fit:cover;
//     border-radius:16px; 
//     box-shadow:0 10px 25px rgba(0,0,0,.15);
//   }

//   .jdb-submit-btn{
//     grid-column:1/3;
//     border:none;
//     background:linear-gradient(135deg,#2563eb,#1d4ed8);
//     color:#fff;
//     padding:15px;
//     border-radius:12px;
//     font-size:17px;
//     font-weight:600;
//     cursor:pointer;
//   }

//   .jdb-close-btn{
//     position:absolute;
//     top:15px;
//     right:15px;
//     width:45px;
//     height:45px;
//     border:none;
//     border-radius:50%;
//     background:#ef4444;
//     color:#fff;
//     cursor:pointer;
//   }

//   .ql-editor{
//     min-height:300px;
//   }

//   @media(max-width:768px){

//     .jdb-blog-wrapper{
//       padding:15px;
//     }

//     .jdb-blog-form{
//       grid-template-columns:1fr;
//     }

//     .jdb-full-width,
//     .jdb-image-upload-section,
//     .jdb-submit-btn{
//       grid-column:auto;
//     }

//     .analysis-card{
//       grid-template-columns:1fr;
//     }

//     .jdb-preview-box img{
//       height:220px;
//     }
//   }
// `}
//       </style>
//     </>
//   );
// }

// export { Blog };


import React, { useState } from "react";
import { Allblog } from "./allblog";
import toast, { Toaster } from "react-hot-toast";
import { SidebarHeader } from "../sidebarheader";

function Blog() {
  const token = localStorage.getItem("token");
  const [show, setshow] = useState(true);
  const [humanLoading, setHumanLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [slugSuggestions, setSlugSuggestions] = useState([]);

  const AddblogShow = () => {
    setshow(false);
  };

  const AddblogHide = () => {
    setshow(true);
  };

  const [blogtitle, setblogtitle] = useState("");
  const [blogdesc, setblogdesc] = useState("");
  const [blogimage, setblogimage] = useState(null);
  const [metatitle, setmetatitle] = useState("");
  const [metakey, setmetakey] = useState("");
  const [metadesc, setmetadesc] = useState("");
  const [slugurl, setslugurl] = useState("");
  const [blogdate, setblogdate] = useState("");

  const [publishLoading, setPublishLoading] = useState(false);

const generateSlug = (text) => {
  if (!text) return "";

  // Common useless words
  const stopWords = [
    "a","an","the","and","or","but","for","to","of","with","on","at","by",
    "from","into","about","after","before","under","over","step","steps",
    "step-by-step","guide","tutorial","complete","full","ultimate","easy",
    "learn","learning","how","what","when","where","top",
    "latest","new","updated","free","online"
  ];

  let slug = text
    .toLowerCase()

    // Remove everything after |
    .split("|")[0]

    // Remove everything inside brackets
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")

    // Remove special characters except . and -
    .replace(/[^\w\s.-]/g, "")

    .trim();

  let words = slug.split(/\s+/);

  words = words.filter(word => {
    return !stopWords.includes(word.replace(/\./g, ""));
  });

  return words.join("-")
    .replace(/\.+/g, "")      // remove dots
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
};

  const titlevalue = (e) => {
    const title = e.target.value;
    setblogtitle(title);

    const mainSlug = generateSlug(title);

    setslugurl(mainSlug);

    if (mainSlug) {
      setSlugSuggestions([
        mainSlug,
        `${mainSlug}-jaipur`,
        `best-${mainSlug}`,
      ]);
    } else {
      setSlugSuggestions([]);
    }
  };

  const slugvalue = (e) => {
    const manualSlug = generateSlug(e.target.value);
    setslugurl(manualSlug);
  };

  const selectSlug = (slug) => {
    setslugurl(slug);
    setSlugSuggestions([]);
  };

  const descvalue = (e) => {
    setblogdesc(e.target.value);
  };

  const imagevalue = (e) => {
    setblogimage(e.target.files[0]);
  };

  const metatitlevalue = (e) => {
    setmetatitle(e.target.value);
  };

  const metadescvalue = (e) => {
    setmetadesc(e.target.value);
  };

  const metakeyvalue = (e) => {
    setmetakey(e.target.value);
  };

  const blogdatevalue = (e) => {
    setblogdate(e.target.value);
  };

  const analyzeContent = (content) => {
    const plainText = content.replace(/<[^>]*>/g, " ");
    const words = plainText.trim().split(/\s+/).filter(Boolean);
    const sentences = plainText.split(/[.!?]/).filter((s) => s.trim() !== "");

    const aiPhrases = [
      "furthermore",
      "moreover",
      "additionally",
      "in conclusion",
      "digital landscape",
      "delve",
      "unlock",
      "leverage",
      "utilize",
      "seamless",
      "robust",
      "comprehensive",
      "cutting-edge",
      "game-changer",
      "it is important to note",
      "it is worth noting",
      "in today's digital world",
      "in today's digital landscape",
      "elevate",
      "harness",
      "realm",
      "landscape",
    ];

    let foundAiWords = [];

    aiPhrases.forEach((item) => {
      if (plainText.toLowerCase().includes(item)) {
        foundAiWords.push(item);
      }
    });

    const avgSentenceLength =
      sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;

    const aiScore = Math.min(
      95,
      foundAiWords.length * 8 + (avgSentenceLength > 20 ? 25 : 10)
    );

    return {
      totalWords: words.length,
      totalSentences: sentences.length,
      avgSentenceLength,
      aiScore,
      humanScore: 100 - aiScore,
      foundAiWords,
    };
  };

  const localHumanize = (content) => {
    let text = content;

    const replacements = [
      ["In today's digital landscape", "Today"],
      ["In today's digital world", "Today"],
      ["Furthermore", "Also"],
      ["Moreover", "Also"],
      ["Additionally", "Along with this"],
      ["In conclusion", "Overall"],
      ["It is important to note that", "Keep in mind that"],
      ["It is worth noting that", "One thing to remember is that"],
      ["delve into", "understand"],
      ["Delve into", "Understand"],
      ["unlock", "learn"],
      ["Unlock", "Learn"],
      ["leverage", "use"],
      ["Leverage", "Use"],
      ["utilize", "use"],
      ["Utilize", "Use"],
      ["enhance", "improve"],
      ["Enhance", "Improve"],
      ["seamless", "smooth"],
      ["Seamless", "Smooth"],
      ["robust", "strong"],
      ["Robust", "Strong"],
      ["comprehensive", "complete"],
      ["Comprehensive", "Complete"],
      ["cutting-edge", "modern"],
      ["Cutting-edge", "Modern"],
      ["game-changer", "useful solution"],
      ["Game-changer", "Useful solution"],
      ["digital landscape", "online world"],
      ["Digital landscape", "Online world"],
      ["elevate", "improve"],
      ["Elevate", "Improve"],
      ["harness", "use"],
      ["Harness", "Use"],
      ["realm", "field"],
      ["Realm", "Field"],
    ];

    replacements.forEach(([oldWord, newWord]) => {
      const regex = new RegExp(oldWord, "g");
      text = text.replace(regex, newWord);
    });

    text = text
      .replace(/This article explores/gi, "In this guide, you will learn")
      .replace(/This blog explores/gi, "In this blog, we will understand")
      .replace(/This guide explores/gi, "This guide explains")
      .replace(/plays a crucial role/gi, "is very important")
      .replace(/has revolutionized/gi, "has changed")
      .replace(/various industries/gi, "many industries")
      .replace(/numerous benefits/gi, "many benefits")
      .replace(/a wide range of/gi, "many")
      .replace(/due to the fact that/gi, "because")
      .replace(/in order to/gi, "to")
      .replace(/with the help of/gi, "using")
      .replace(/\. /g, ".\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return text;
  };

  const HumanizeBlogContent = () => {
    if (!blogdesc.trim()) {
      toast.error("Please paste blog content first");
      return;
    }

    setHumanLoading(true);

    setTimeout(() => {
      const report = analyzeContent(blogdesc);
      const humanContent = localHumanize(blogdesc);

      setAnalysis(report);
      setblogdesc(humanContent);
      setHumanLoading(false);

      toast.success("Content analyzed and converted successfully");
    }, 600);
  };

 const Addblog = async (e) => {
  e.preventDefault();

  if (publishLoading) return;

  setPublishLoading(true);

  try {
    const formData = new FormData();

    formData.append("blogtitle", blogtitle);
    formData.append("blogdesc", blogdesc);
    formData.append("blogimage", blogimage);
    formData.append("metatitle", metatitle);
    formData.append("metadesc", metadesc);
    formData.append("metakey", metakey);
    formData.append("slugurl", slugurl);
    formData.append("blogdate", blogdate);

    const response = await fetch("https://dgrnode.vercel.app/addblog", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.status) {
      toast.success("New Blog Added..");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast.error(data.message);
      setPublishLoading(false);
    }
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong...!");
    setPublishLoading(false);
  }
};

  return (
    <>
      <SidebarHeader />

      <div className="filter-section" style={{ margin: "50px auto" }}>
        <button
          onClick={AddblogShow}
          style={{ backgroundColor: "green", fontSize: "16px" }}
        >
          <span>+</span> Add Blog
        </button>
      </div>

      <Allblog />

      <section
        id="blog"
        style={{
          display: `${show === true ? "none" : "block"}`,
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "9999",
        }}
      >
        <Toaster />

        <h2 style={{ textAlign: "center", marginTop: "30px" }}>Add Blog</h2>

        <div className="jdb-blog-wrapper">
          <button className="jdb-close-btn" onClick={AddblogHide}>
            <i className="fa-solid fa-xmark"></i>
          </button>

          <form className="jdb-blog-form">
            <div className="jdb-form-group">
              <label htmlFor="blogtitle">Blog Title</label>
              <input
                value={blogtitle}
                onChange={titlevalue}
                type="text"
                id="blogtitle"
                name="blogtitle"
                placeholder="Enter Blog Title"
                required
              />
            </div>

            <div className="jdb-form-group">
              <label htmlFor="blogdate">Blog Date</label>
              <input
                onChange={blogdatevalue}
                type="date"
                id="blogdate"
                name="blogdate"
                required
              />
            </div>

            <div className="jdb-form-group">
              <label htmlFor="metatitle">Meta Title</label>
              <input
                onChange={metatitlevalue}
                type="text"
                id="metatitle"
                name="metatitle"
                placeholder="Meta Title"
                required
              />
            </div>

            <div className="jdb-form-group slug-parent">
              <label htmlFor="slugurl">Slug URL</label>

              <input
                value={slugurl}
                onChange={slugvalue}
                type="text"
                id="slugurl"
                name="slugurl"
                placeholder="enter-custom-slug"
                required
              />

              {slugSuggestions.length > 0 && (
                <div className="slug-dropdown">
                  {slugSuggestions.map((slug, index) => (
                    <div
                      key={index}
                      className="slug-option"
                      onClick={() => selectSlug(slug)}
                    >
                      {slug}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="jdb-full-width">
              <label htmlFor="metakey">Meta Keywords</label>
              <input
                onChange={metakeyvalue}
                type="text"
                id="metakey"
                name="metakey"
                placeholder="react js, node js, web development"
                required
              />
            </div>

            <div className="jdb-full-width">
              <label htmlFor="metadesc">Meta Description</label>
              <textarea
                onChange={metadescvalue}
                id="metadesc"
                name="metadesc"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="jdb-full-width">
              <label htmlFor="blogdes">Blog Description</label>

              <div className="humanize-box">
                <button
                  type="button"
                  onClick={HumanizeBlogContent}
                  className="humanize-btn"
                  disabled={humanLoading}
                >
                  {humanLoading ? "Converting..." : "Analyze & Convert Content"}
                </button>

                {analysis && (
                  <div className="analysis-card">
                    <p>
                      <b>Total Words:</b> {analysis.totalWords}
                    </p>
                    <p>
                      <b>Total Sentences:</b> {analysis.totalSentences}
                    </p>
                    <p>
                      <b>Avg Sentence:</b> {analysis.avgSentenceLength} words
                    </p>
                    <p>
                      <b>AI Score:</b> {analysis.aiScore}%
                    </p>
                    <p>
                      <b>Human Score:</b> {analysis.humanScore}%
                    </p>
                    <p>
                      <b>AI Words:</b>{" "}
                      {analysis.foundAiWords.length > 0
                        ? analysis.foundAiWords.join(", ")
                        : "No major AI words found"}
                    </p>
                  </div>
                )}
              </div>

              <textarea
                value={blogdesc}
                onChange={descvalue}
                placeholder="Paste Full HTML Blog Content Here..."
                rows="25"
                style={{
                  width: "100%",
                  minHeight: "500px",
                  padding: "15px",
                  border: "1px solid #dbe3ea",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  resize: "vertical",
                  background: "#f8fafc",
                }}
              />
            </div>

            <div className="jdb-image-upload-section">
              <label>Blog Featured Image</label>

              <div className="jdb-upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={imagevalue}
                  id="blogimage"
                  hidden
                />

                <label htmlFor="blogimage" className="jdb-upload-label">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <h4>Upload Blog Image</h4>
                  <p>Click To Upload Image</p>
                  <span>PNG • JPG • WEBP</span>
                </label>
              </div>

              {blogimage && (
                <div className="jdb-preview-box">
                  <img src={URL.createObjectURL(blogimage)} alt="preview" />
                </div>
              )}
            </div>

            <button
  onClick={Addblog}
  type="submit"
  className="jdb-submit-btn"
  disabled={publishLoading}
>
  {publishLoading ? (
    <span className="btn-loader-wrap">
      <span className="btn-loader"></span>
      Publishing...
    </span>
  ) : (
    "Publish Blog"
  )}
</button>
          </form>
        </div>
      </section>

      <style>
        {`

.jdb-submit-btn:disabled{
  opacity:.8;
  cursor:not-allowed;
}

.btn-loader-wrap{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
}

.btn-loader{
  width:18px;
  height:18px;
  border:3px solid rgba(255,255,255,.45);
  border-top-color:#fff;
  border-radius:50%;
  animation:spinLoader .8s linear infinite;
}

@keyframes spinLoader{
  to{
    transform:rotate(360deg);
  }
}

  .slug-parent{
    position:relative;
  }

  .slug-dropdown{
    position:absolute;
    top:78px;
    left:10px;
    right:10px;
    background:#fff;
    border:1px solid #dbe3ea;
    border-radius:12px;
    box-shadow:0 10px 25px rgba(0,0,0,.12);
    z-index:99999;
    overflow:hidden;
  }

  .slug-option{
    padding:12px 14px;
    font-size:14px;
    cursor:pointer;
    color:#1e293b;
    border-bottom:1px solid #eef2f7;
    transition:.2s;
  }

  .slug-option:hover{
    background:#eff6ff;
    color:#2563eb;
  }

  .slug-option:last-child{
    border-bottom:none;
  }

  .jdb-blog-wrapper{
    max-width:1100px;
    margin:auto;
    background:#fff;
    padding:30px;
    border-radius:20px;
    box-shadow:0 15px 40px rgba(0,0,0,.15);
    position:relative;
  }

  .jdb-blog-form{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:20px;
    padding:30px;
  }

  .jdb-form-group{
    display:flex;
    flex-direction:column;
    margin:10px;
  }

  .jdb-form-group label,
  .jdb-full-width label,
  .jdb-image-upload-section label{
    font-weight:600;
    margin-bottom:8px;
    color:#1e293b;
  }

  .jdb-form-group input,
  .jdb-full-width input,
  .jdb-full-width textarea{
    width:100%;
    padding:14px;
    border-radius:12px;
    border:1px solid #dbe3ea;
    outline:none;
  }

  .jdb-full-width{
    grid-column:1/3;
  }

  .jdb-image-upload-section{
    grid-column:1/3;
  }

  .humanize-box{
    background:#f1f5f9;
    border:1px solid #dbe3ea;
    border-radius:14px;
    padding:15px;
    margin-bottom:15px;
  }

  .humanize-btn{
    border:none;
    background:linear-gradient(135deg,#16a34a,#15803d);
    color:white;
    padding:12px 18px;
    border-radius:10px;
    font-size:15px;
    font-weight:600;
    cursor:pointer;
    margin-bottom:12px;
  }

  .humanize-btn:disabled{
    opacity:.7;
    cursor:not-allowed;
  }

  .analysis-card{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
    background:#fff;
    padding:12px;
    border-radius:12px;
    border:1px solid #e2e8f0;
  }

  .analysis-card p{
    margin:0;
    font-size:14px;
    color:#334155;
  }

  .jdb-upload-box{
    border:2px dashed #2563eb;
    border-radius:18px;
    overflow:hidden;
    background:#f8fbff;
  }

  .jdb-upload-label{
    height:220px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    cursor:pointer;
  }

  .jdb-upload-label i{
    font-size:55px;
    color:#2563eb;
    margin-bottom:15px;
  }

  .jdb-upload-label h4{
    margin:0;
    color:#2563eb;
  }

  .jdb-preview-box{
    margin-top:20px;
  }

  .jdb-preview-box img{
    width:100%;
    max-width:500px;
    height:280px;
    object-fit:cover;
    border-radius:16px; 
    box-shadow:0 10px 25px rgba(0,0,0,.15);
  }

  .jdb-submit-btn{
    grid-column:1/3;
    border:none;
    background:linear-gradient(135deg,#2563eb,#1d4ed8);
    color:#fff;
    padding:15px;
    border-radius:12px;
    font-size:17px;
    font-weight:600;
    cursor:pointer;
  }

  .jdb-close-btn{
    position:absolute;
    top:15px;
    right:15px;
    width:45px;
    height:45px;
    border:none;
    border-radius:50%;
    background:#ef4444;
    color:#fff;
    cursor:pointer;
  }

  .ql-editor{
    min-height:300px;
  }

  @media(max-width:768px){
    .jdb-blog-wrapper{
      padding:15px;
    }

    .jdb-blog-form{
      grid-template-columns:1fr;
      padding:15px;
    }

    .jdb-full-width,
    .jdb-image-upload-section,
    .jdb-submit-btn{
      grid-column:auto;
    }

    .analysis-card{
      grid-template-columns:1fr;
    }

    .jdb-preview-box img{
      height:220px;
    }

    .slug-dropdown{
      left:10px;
      right:10px;
    }
  }
`}
      </style>
    </>
  );
}

export { Blog };