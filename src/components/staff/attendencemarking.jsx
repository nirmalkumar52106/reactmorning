import React, {
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react";

function AttendanceMarking({
  staffId,
  month,
  onMarked
}) {
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingDate, setSavingDate] = useState("");

  const tokennn = localStorage.getItem("token");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers":
        "Content-Type",
      Authorization: `Bearer ${tokennn}`,
    }),
    [tokennn]
  );

  const daysInMonth = useMemo(() => {
    return new Date(
      month.split("-")[0],
      month.split("-")[1],
      0
    ).getDate();
  }, [month]);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://dgrnode.vercel.app/api/attendance/${staffId}/${month}`,
          { headers }
        );

        const data = await res.json();

        const map = {};

        data.forEach((item) => {
          map[item.date] = item.status;
        });

        setAttendance(map);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [staffId, month, headers]);

  const markAttendance = useCallback(
    async (date, status) => {
      try {
        setSavingDate(date);

        await fetch(
          "https://dgrnode.vercel.app/api/attendance/mark",
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              staffId,
              date,
              status,
            }),
          }
        );

        setAttendance((prev) => ({
          ...prev,
          [date]: status,
        }));

        onMarked && onMarked();
      } catch (error) {
        console.log(error);
      } finally {
        setSavingDate("");
      }
    },
    [staffId, headers, onMarked]
  );

  const getStatusClass = useCallback(
    (status) => {
      if (status === "present")
        return "present";

      if (status === "half")
        return "half";

      if (status === "absent")
        return "absent";

      return "";
    },
    []
  );

  const getFormattedDate = useCallback(
    (day) => {
      const fullDate = new Date(
        `${month}-${day}`
      );

      const dateLabel =
        fullDate.toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
          }
        );

      const weekDay =
        fullDate.toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
          }
        );

      return {
        dateLabel,
        weekDay,
      };
    },
    [month]
  );

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
          font-family:"Poppins", sans-serif;
        }

        .attendance-wrapper{
          width:100%;
        }

        .attendance-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(190px,1fr));
          gap:15px;
        }

        .day-card{
          background:white;
          border-radius:18px;
          padding:16px;
          text-align:center;
          box-shadow:0 8px 25px rgba(0,0,0,.06);
          transition:.3s;
          border:2px solid transparent;
        }

        .day-card:hover{
          transform:translateY(-4px);
        }

        .day-date{
          font-size:18px;
          font-weight:800;
          color:#0f172a;
          margin-bottom:4px;
        }

        .day-name{
          font-size:13px;
          color:#64748b;
          margin-bottom:14px;
          font-weight:500;
        }

        .btn-group{
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .status-btn{
          border:none;
          cursor:pointer;
          padding:10px;
          border-radius:10px;
          color:white;
          font-size:12px;
          font-weight:700;
          transition:.3s;
        }

        .status-btn:disabled{
          opacity:.8;
          cursor:not-allowed;
        }

        .present-btn{
          background:#16a34a;
        }

        .half-btn{
          background:#f59e0b;
        }

        .absent-btn{
          background:#ef4444;
        }

        .present{
          border-color:#16a34a;
          background:#f0fdf4;
        }

        .half{
          border-color:#f59e0b;
          background:#fffbeb;
        }

        .absent{
          border-color:#ef4444;
          background:#fef2f2;
        }

        .loading-box{
          text-align:center;
          padding:40px;
          color:#64748b;
          font-weight:600;
        }

        @media(max-width:768px){
          .attendance-grid{
            grid-template-columns:1fr;
          }
        }

      `}</style>

      <div className="attendance-wrapper">

        {loading ? (
          <div className="loading-box">
            Loading attendance...
          </div>
        ) : (
          <div className="attendance-grid">

            {[...Array(daysInMonth)].map(
              (_, i) => {
                const day = String(
                  i + 1
                ).padStart(2, "0");

                const date = `${month}-${day}`;

                const currentStatus =
                  attendance[date];

                const {
                  dateLabel,
                  weekDay
                } = getFormattedDate(
                  day
                );

                const isSaving =
                  savingDate === date;

                return (
                  <div
                    key={date}
                    className={`day-card ${getStatusClass(
                      currentStatus
                    )}`}
                  >

                    <div className="day-date">
                      {dateLabel}
                    </div>

                    <div className="day-name">
                      {weekDay}
                    </div>

                    <div className="btn-group">

                      <button
                        disabled={isSaving}
                        className="status-btn present-btn"
                        onClick={() =>
                          markAttendance(
                            date,
                            "present"
                          )
                        }
                      >
                        {isSaving
                          ? "Saving..."
                          : currentStatus === "present"
                          ? "✅ Present"
                          : "Present"}
                      </button>

                      <button
                        disabled={isSaving}
                        className="status-btn half-btn"
                        onClick={() =>
                          markAttendance(
                            date,
                            "half"
                          )
                        }
                      >
                        {isSaving
                          ? "Saving..."
                          : currentStatus === "half"
                          ? "✅ Half Day"
                          : "Half Day"}
                      </button>

                      <button
                        disabled={isSaving}
                        className="status-btn absent-btn"
                        onClick={() =>
                          markAttendance(
                            date,
                            "absent"
                          )
                        }
                      >
                        {isSaving
                          ? "Saving..."
                          : currentStatus === "absent"
                          ? "✅ Absent"
                          : "Absent"}
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </>
  );
}

export default AttendanceMarking;