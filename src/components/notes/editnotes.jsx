// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";

// import toast from "react-hot-toast";

// import { SidebarHeader } from "../sidebarheader";

// const EditNotes = () => {
//   const { id } = useParams();

//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);

//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [shortDescription, setShortDescription] = useState("");
//   const [content, setContent] = useState("");
//   const [metaTitle, setMetaTitle] = useState("");
//   const [metaDescription, setMetaDescription] = useState("");
//   const [metaKeywords, setMetaKeywords] = useState("");
//   const [featuredImage, setFeaturedImage] = useState("");



//   /* =========================================
//       CREATE SLUG
//   ========================================= */

//   const createSlug = (text) => {
//     return text
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-zA-Z0-9 ]/g, "")
//       .replace(/\s+/g, "-");
//   };



//   /* =========================================
//       GET SINGLE NOTE
//   ========================================= */

//   const getSingleNote = async () => {
//     try {
//       const response = await fetch(
//         `https://dgrnode.vercel.app/api/notes/id/${id}`
//       );

//       const data = await response.json();

//       if (data.success) {
//         const note = data.data;

//         setTitle(note.title || "");
//         setCategory(note.category || "");
//         setShortDescription(
//           note.shortDescription || ""
//         );
//         setContent(note.content || "");
//         setMetaTitle(note.metaTitle || "");
//         setMetaDescription(
//           note.metaDescription || ""
//         );
//         setMetaKeywords(
//           note.metaKeywords || ""
//         );
//         setFeaturedImage(
//           note.featuredImage || ""
//         );
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Failed To Load Note");
//     } finally {
//       setLoading(false);
//     }
//   };



//   /* =========================================
//       UPDATE NOTE
//   ========================================= */

//   const updateNote = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(
//         `https://dgrnode.vercel.app/api/notes/update/${id}`,
//         {
//           method: "PATCH",

//           headers: {
//             "Content-Type": "application/json",
//           },

//           body: JSON.stringify({
//             title,
//             category,
//             shortDescription,
//             content,
//             metaTitle,
//             metaDescription,
//             metaKeywords,
//             featuredImage,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Note Updated");

//         navigate("/notes");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Update Failed");
//     }
//   };



//   useEffect(() => {
//     getSingleNote();
//   }, []);



//   return (
//     <div
//       style={{
//         display: "flex",
//         background: "#f3f4f6",
//         minHeight: "100vh",
//       }}
//     >
//       <SidebarHeader />



//       <div
//         style={{
//           width : "80%",
//           margin : "30px auto",
//           padding: "30px",
//         }}
//       >
//         {
//           loading ? (
//             <div
//               style={{
//                 height: "80vh",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 fontSize: "24px",
//                 fontWeight: "700",
//                 color: "#111827",
//               }}
//             >
//               Loading...
//             </div>
//           ) : (
//             <>
//               {/* TOP */}

//               <div
//                 style={{
//                   marginBottom: "25px",
//                 }}
//               >
//                 <h1
//                   style={{
//                     fontSize: "34px",
//                     fontWeight: "700",
//                     color: "#111827",
//                     marginBottom: "6px",
//                   }}
//                 >
//                   Edit Notes
//                 </h1>

//                 <p
//                   style={{
//                     color: "#6b7280",
//                     fontSize: "15px",
//                   }}
//                 >
//                   Update your notes and SEO data
//                 </p>
//               </div>



//               {/* FORM */}

//               <form onSubmit={updateNote}>
//                 <div
//                   style={{
//                     background: "white",
//                     padding: "30px",
//                     borderRadius: "16px",
//                     boxShadow:
//                       "0 4px 14px rgba(0,0,0,0.08)",
//                   }}
//                 >
//                   {/* TITLE */}

//                   <div
//                     style={{
//                       marginBottom: "22px",
//                     }}
//                   >
//                     <label
//                       style={labelStyle}
//                     >
//                       Title
//                     </label>

//                     <input
//                       type="text"
//                       placeholder="Enter Notes Title"
//                       value={title}
//                       onChange={(e) =>
//                         setTitle(e.target.value)
//                       }
//                       style={inputStyle}
//                     />
//                   </div>



//                   {/* SLUG */}

//                   <div
//                     style={{
//                       marginBottom: "22px",
//                     }}
//                   >
//                     <label
//                       style={labelStyle}
//                     >
//                       Slug Preview
//                     </label>

//                     <div
//                       style={{
//                         background: "#f3f4f6",
//                         padding: "14px",
//                         borderRadius: "10px",
//                         color: "#374151",
//                         fontSize: "14px",
//                         wordBreak: "break-all",
//                       }}
//                     >
//                       /{createSlug(title)}
//                     </div>
//                   </div>



//                   {/* CATEGORY */}

//                   <div
//                     style={{
//                       marginBottom: "22px",
//                     }}
//                   >
//                     <label
//                       style={labelStyle}
//                     >
//                       Category
//                     </label>

//                     <input
//                       type="text"
//                       placeholder="HTML"
//                       value={category}
//                       onChange={(e) =>
//                         setCategory(e.target.value)
//                       }
//                       style={inputStyle}
//                     />
//                   </div>



//                   {/* IMAGE */}

//                   <div
//                     style={{
//                       marginBottom: "22px",
//                     }}
//                   >
//                     <label
//                       style={labelStyle}
//                     >
//                       Featured Image URL
//                     </label>

//                     <input
//                       type="text"
//                       placeholder="Paste image URL"
//                       value={featuredImage}
//                       onChange={(e) =>
//                         setFeaturedImage(
//                           e.target.value
//                         )
//                       }
//                       style={inputStyle}
//                     />
//                   </div>



//                   {
//                     featuredImage && (
//                       <div
//                         style={{
//                           marginBottom: "25px",
//                         }}
//                       >
//                         <img
//                           src={featuredImage}
//                           alt="preview"
//                           style={{
//                             width: "240px",
//                             height: "140px",
//                             objectFit: "cover",
//                             borderRadius: "12px",
//                             border:
//                               "1px solid #ddd",
//                           }}
//                         />
//                       </div>
//                     )
//                   }



//                   {/* SHORT DESCRIPTION */}

//                   <div
//                     style={{
//                       marginBottom: "22px",
//                     }}
//                   >
//                     <label
//                       style={labelStyle}
//                     >
//                       Short Description
//                     </label>

//                     <textarea
//                       rows="4"
//                       placeholder="Short Description"
//                       value={shortDescription}
//                       onChange={(e) =>
//                         setShortDescription(
//                           e.target.value
//                         )
//                       }
//                       style={textareaStyle}
//                     />
//                   </div>



//                   {/* CONTENT */}

//                   <div
//                     style={{
//                       marginBottom: "30px",
//                     }}
//                   >
//                     <label
//                       style={labelStyle}
//                     >
//                       Content
//                     </label>

//                     <div
//                       style={{
//                         borderRadius: "10px",
//                         overflow: "hidden",
//                         background: "white",
//                       }}
//                     >
//                       <ReactQuill
//                         theme="snow"
//                         value={content}
//                         onChange={setContent}
//                         style={{
//                           background: "white",
//                         }}
//                       />
//                     </div>
//                   </div>



//                   {/* SEO HEADING */}

//                   <div
//                     style={{
//                       marginBottom: "22px",
//                     }}
//                   >
//                     <h2
//                       style={{
//                         fontSize: "28px",
//                         color: "#111827",
//                         fontWeight: "700",
//                       }}
//                     >
//                       SEO Meta Fields
//                     </h2>
//                   </div>



//                   {/* META TITLE */}

//                   <div
//                     style={{
//                       marginBottom: "22px",
//                     }}
//                   >
//                     <label
//                       style={labelStyle}
//                     >
//                       Meta Title
//                     </label>

//                     <input
//                       type="text"
//                       placeholder="Meta Title"
//                       value={metaTitle}
//                       onChange={(e) =>
//                         setMetaTitle(
//                           e.target.value
//                         )
//                       }
//                       style={inputStyle}
//                     />
//                   </div>



//                   {/* META DESCRIPTION */}

//                   <div
//                     style={{
//                       marginBottom: "22px",
//                     }}
//                   >
//                     <label
//                       style={labelStyle}
//                     >
//                       Meta Description
//                     </label>

//                     <textarea
//                       rows="4"
//                       placeholder="Meta Description"
//                       value={metaDescription}
//                       onChange={(e) =>
//                         setMetaDescription(
//                           e.target.value
//                         )
//                       }
//                       style={textareaStyle}
//                     />
//                   </div>



//                   {/* META KEYWORDS */}

//                   <div
//                     style={{
//                       marginBottom: "25px",
//                     }}
//                   >
//                     <label
//                       style={labelStyle}
//                     >
//                       Meta Keywords
//                     </label>

//                     <input
//                       type="text"
//                       placeholder="html notes, html tutorial"
//                       value={metaKeywords}
//                       onChange={(e) =>
//                         setMetaKeywords(
//                           e.target.value
//                         )
//                       }
//                       style={inputStyle}
//                     />
//                   </div>



//                   {/* BUTTON */}

//                   <button
//                     type="submit"
//                     style={{
//                       background: "#111827",
//                       color: "white",
//                       padding: "15px 28px",
//                       borderRadius: "10px",
//                       border: "none",
//                       cursor: "pointer",
//                       fontSize: "15px",
//                       fontWeight: "600",
//                       boxShadow:
//                         "0 4px 10px rgba(0,0,0,0.1)",
//                     }}
//                   >
//                     Update Notes
//                   </button>
//                 </div>
//               </form>
//             </>
//           )
//         }
//       </div>
//     </div>
//   );
// };



// /* =========================================
//     INTERNAL STYLES
// ========================================= */

// const labelStyle = {
//   display: "block",
//   marginBottom: "8px",
//   fontWeight: "600",
//   color: "#111827",
//   fontSize: "15px",
// };

// const inputStyle = {
//   width: "100%",
//   padding: "14px",
//   border: "1px solid #d1d5db",
//   borderRadius: "10px",
//   outline: "none",
//   fontSize: "15px",
//   background: "white",
// };

// const textareaStyle = {
//   width: "100%",
//   padding: "14px",
//   border: "1px solid #d1d5db",
//   borderRadius: "10px",
//   outline: "none",
//   fontSize: "15px",
//   resize: "vertical",
//   background: "white",
// };



// export default EditNotes;


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import toast from "react-hot-toast";

import { SidebarHeader } from "../sidebarheader";

const EditNotes = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [originalData, setOriginalData] = useState({});

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");



  /* =========================================
      CREATE SLUG
  ========================================= */

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  };



  /* =========================================
      GET SINGLE NOTE
  ========================================= */

  const getSingleNote = async () => {
    try {

      const response = await fetch(
        `https://dgrnode.vercel.app/api/notes/id/${id}`
      );

      const data = await response.json();

      if (data.success) {

        const note = data.data;

        setOriginalData(note);

        setTitle(note.title || "");
        setCategory(note.category || "");
        setShortDescription(
          note.shortDescription || ""
        );
        setContent(note.content || "");
        setMetaTitle(note.metaTitle || "");
        setMetaDescription(
          note.metaDescription || ""
        );
        setMetaKeywords(
          note.metaKeywords || ""
        );
        setFeaturedImage(
          note.featuredImage || ""
        );

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error("Failed To Load Note");

    } finally {

      setLoading(false);

    }
  };



  /* =========================================
      UPDATE NOTE
  ========================================= */

  const updateNote = async (e) => {

    e.preventDefault();

    try {

      setUpdating(true);

      const updatedFields = {};



      if (title !== originalData.title) {
        updatedFields.title = title;
      }

      if (category !== originalData.category) {
        updatedFields.category = category;
      }

      if (
        shortDescription !==
        originalData.shortDescription
      ) {
        updatedFields.shortDescription =
          shortDescription;
      }

      if (content !== originalData.content) {
        updatedFields.content = content;
      }

      if (
        metaTitle !== originalData.metaTitle
      ) {
        updatedFields.metaTitle = metaTitle;
      }

      if (
        metaDescription !==
        originalData.metaDescription
      ) {
        updatedFields.metaDescription =
          metaDescription;
      }

      if (
        metaKeywords !==
        originalData.metaKeywords
      ) {
        updatedFields.metaKeywords =
          metaKeywords;
      }

      if (
        featuredImage !==
        originalData.featuredImage
      ) {
        updatedFields.featuredImage =
          featuredImage;
      }



      if (
        Object.keys(updatedFields).length === 0
      ) {

        toast.error("No Changes Found");

        setUpdating(false);

        return;
      }



      const response = await fetch(
        `https://dgrnode.vercel.app/api/notes/update/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updatedFields),
        }
      );



      const data = await response.json();



      if (data.success) {

        toast.success("Note Updated");

        navigate("/notes");

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error("Update Failed");

    } finally {

      setUpdating(false);

    }
  };



  useEffect(() => {

    getSingleNote();

  }, []);



  return (
    <div
      style={{
        display: "flex",
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <SidebarHeader />



      <div
        style={{
          width: "80%",
          margin: "30px auto",
          padding: "30px",
        }}
      >
        {
          loading ? (
            <div
              style={{
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Loading...
            </div>
          ) : (
            <>
              {/* TOP */}

              <div
                style={{
                  marginBottom: "25px",
                }}
              >
                <h1
                  style={{
                    fontSize: "34px",
                    fontWeight: "700",
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  Edit Notes
                </h1>

                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "15px",
                  }}
                >
                  Update your notes and SEO data
                </p>
              </div>



              {/* FORM */}

              <form onSubmit={updateNote}>
                <div
                  style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "16px",
                    boxShadow:
                      "0 4px 14px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* TITLE */}

                  <div
                    style={{
                      marginBottom: "22px",
                    }}
                  >
                    <label style={labelStyle}>
                      Title
                    </label>

                    <input
                      type="text"
                      placeholder="Enter Notes Title"
                      value={title}
                      onChange={(e) =>
                        setTitle(e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>



                  {/* SLUG */}

                  <div
                    style={{
                      marginBottom: "22px",
                    }}
                  >
                    <label style={labelStyle}>
                      Slug Preview
                    </label>

                    <div
                      style={{
                        background: "#f3f4f6",
                        padding: "14px",
                        borderRadius: "10px",
                        color: "#374151",
                        fontSize: "14px",
                        wordBreak: "break-all",
                      }}
                    >
                      /{createSlug(title)}
                    </div>
                  </div>



                  {/* CATEGORY */}

                  <div
                    style={{
                      marginBottom: "22px",
                    }}
                  >
                    <label style={labelStyle}>
                      Category
                    </label>

                    <input
                      type="text"
                      placeholder="HTML"
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>



                  {/* IMAGE */}

                  <div
                    style={{
                      marginBottom: "22px",
                    }}
                  >
                    <label style={labelStyle}>
                      Featured Image URL
                    </label>

                    <input
                      type="text"
                      placeholder="Paste image URL"
                      value={featuredImage}
                      onChange={(e) =>
                        setFeaturedImage(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />
                  </div>



                  {
                    featuredImage && (
                      <div
                        style={{
                          marginBottom: "25px",
                        }}
                      >
                        <img
                          src={featuredImage}
                          alt="preview"
                          style={{
                            width: "240px",
                            height: "140px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            border:
                              "1px solid #ddd",
                          }}
                        />
                      </div>
                    )
                  }



                  {/* SHORT DESCRIPTION */}

                  <div
                    style={{
                      marginBottom: "22px",
                    }}
                  >
                    <label style={labelStyle}>
                      Short Description
                    </label>

                    <textarea
                      rows="4"
                      placeholder="Short Description"
                      value={shortDescription}
                      onChange={(e) =>
                        setShortDescription(
                          e.target.value
                        )
                      }
                      style={textareaStyle}
                    />
                  </div>



                  {/* CONTENT */}

                  <div
                    style={{
                      marginBottom: "30px",
                    }}
                  >
                    <label style={labelStyle}>
                      Content
                    </label>

                    <div
                      style={{
                        borderRadius: "10px",
                        overflow: "hidden",
                        background: "white",
                      }}
                    >
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        style={{
                          background: "white",
                        }}
                      />
                    </div>
                  </div>



                  {/* SEO HEADING */}

                  <div
                    style={{
                      marginBottom: "22px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "28px",
                        color: "#111827",
                        fontWeight: "700",
                      }}
                    >
                      SEO Meta Fields
                    </h2>
                  </div>



                  {/* META TITLE */}

                  <div
                    style={{
                      marginBottom: "22px",
                    }}
                  >
                    <label style={labelStyle}>
                      Meta Title
                    </label>

                    <input
                      type="text"
                      placeholder="Meta Title"
                      value={metaTitle}
                      onChange={(e) =>
                        setMetaTitle(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />
                  </div>



                  {/* META DESCRIPTION */}

                  <div
                    style={{
                      marginBottom: "22px",
                    }}
                  >
                    <label style={labelStyle}>
                      Meta Description
                    </label>

                    <textarea
                      rows="4"
                      placeholder="Meta Description"
                      value={metaDescription}
                      onChange={(e) =>
                        setMetaDescription(
                          e.target.value
                        )
                      }
                      style={textareaStyle}
                    />
                  </div>



                  {/* META KEYWORDS */}

                  <div
                    style={{
                      marginBottom: "25px",
                    }}
                  >
                    <label style={labelStyle}>
                      Meta Keywords
                    </label>

                    <input
                      type="text"
                      placeholder="html notes, html tutorial"
                      value={metaKeywords}
                      onChange={(e) =>
                        setMetaKeywords(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />
                  </div>



                  {/* BUTTON */}

                  <button
                    type="submit"
                    disabled={updating}
                    style={{
                      background: updating
                        ? "#6b7280"
                        : "#111827",
                      color: "white",
                      padding: "15px 28px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: updating
                        ? "not-allowed"
                        : "pointer",
                      fontSize: "15px",
                      fontWeight: "600",
                      boxShadow:
                        "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    {
                      updating
                        ? "Updating..."
                        : "Update Notes"
                    }
                  </button>
                </div>
              </form>
            </>
          )
        }
      </div>
    </div>
  );
};



/* =========================================
    INTERNAL STYLES
========================================= */

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#111827",
  fontSize: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  outline: "none",
  fontSize: "15px",
  background: "white",
};

const textareaStyle = {
  width: "100%",
  padding: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  outline: "none",
  fontSize: "15px",
  resize: "vertical",
  background: "white",
};

export default EditNotes;