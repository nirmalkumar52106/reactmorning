import React, { useState, useEffect } from 'react';

const EditTestForm = ({ testId }) => {
  const [title, setTitle] = useState('');
  const [startDateTime, setStartTime] = useState('');
  const [loading, setLoading] = useState(false);

   const tokennn = localStorage.getItem("token");
   const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Authorization": `Bearer ${tokennn}`
    };

  useEffect(() => {
    // Fetch test details 
    const fetchTest = async () => {
      try {
        const res = await fetch(`https://dgrnode.vercel.app/tests/${testId}`);
        const data = await res.json();
        setTitle(data.title);
        setStartTime(new Date(data.startDateTime).toISOString().slice(0, 16)); // yyyy-MM-ddThh:mm
      } catch (err) {
        console.error('Failed to fetch test:', err);
      }
    };

    fetchTest();
  }, [testId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`https://dgrnode.vercel.app/tests/${testId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ title,   startDateTime: new Date(startDateTime).toISOString() }),
      });

      if (res.ok) {
        alert('Test updated successfully');
        window.location.reload()
      } else {
        alert('Failed to update test');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating test');
    } finally {
      setLoading(false);
    }
  };

  const [open , setopen] = useState(true)

  const handleopenform=()=>{
    setopen(false)
  }

    const handlecloseform=()=>{
    setopen(true)
  }

  return (
    <> 
    <div className='btn'>
      {
        open === true ? 
        <>
           <button onClick={handleopenform} style={{marginBottom : "10px" , padding:"10px 20px",
    cursor :"pointer" , border : "none", backgroundColor :"green",
    color : "white",borderRadius : "8px"
   }}>Update</button>
        </> : <>
              <button onClick={handlecloseform} style={{marginBottom : "10px" , padding:"10px 20px",
    cursor :"pointer" , border : "none", backgroundColor :"red",
    color : "white",borderRadius : "8px"
   }}>Close Form</button>
        
        </>
      }

    </div>
 
    <form style={{display : `${open === true ? "none" : "block"}`}} onSubmit={handleSubmit} className="edit-form">
      <h2>Edit Test</h2>
      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Start Time:</label>
      <input
        type="datetime-local"
        value={startDateTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Test'}
      </button>
    </form>
    
    </>
    
  );
};

export default EditTestForm;
