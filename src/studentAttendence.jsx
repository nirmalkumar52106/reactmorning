import React, { useState } from "react";

function StudentAttendance() {
    const [status, setStatus] = useState("Present");

    const handleSubmit = () => {
        alert(`Attendance submitted: ${status}`);
    };

    return (
        <div>
            <label htmlFor="attendance">Select Attendance: </label>
            <select 
                id="attendance" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
            </select>
            <button onClick={handleSubmit}>Submit Attendance</button>
        </div>
    );
}

export { StudentAttendance };