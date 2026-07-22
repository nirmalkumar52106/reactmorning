import React, { useState } from "react";
import CreateBatch from "./CreateBatch";
import BatchList from "./BatchList";
import BatchStats from "./batchStatus";
 
export default function BatchPage() {

  const [showCreate, setShowCreate] = useState(false); // ✅ NEW

  return (
    <div className="batch-container">
<h2>📚 Batch Management</h2>
      <BatchStats/>

      <div style={{justifyContent: "end"}} className="batch-header">
        

        {/* ✅ BUTTON */}
        <button
          className="btn btn-primary"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? "Close" : "➕ Create New Batch"}
        </button>
      </div>

      

      {/* ✅ CONDITIONAL RENDER */}
      {showCreate && <CreateBatch />}

      <BatchList />

    </div>
  );
}