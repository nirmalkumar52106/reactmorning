import React, {
  useEffect,
  useState,
  useMemo
} from "react";

function AttendanceCalendar({
  staffId,
  month
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const loadAttendance =
      async () => {
        try {
          setLoading(true);

          const res = await fetch(
            `https://dgrnode.vercel.app/api/attendance/${staffId}/${month}`,
            { headers }
          );

          const result =
            await res.json();

          setData(
            Array.isArray(result)
              ? result
              : []
          );
        } catch (error) {
          console.log(error);
          setData([]);
        } finally {
          setLoading(false);
        }
      };

    loadAttendance();
  }, [staffId, month, headers]);

  const getStatusClass = (
    status
  ) => {
    if (status === "present")
      return "present-card";

    if (status === "half")
      return "half-card";

    if (status === "absent")
      return "absent-card";

    return "";
  };

  const getStatusIcon = (
    status
  ) => {
    if (status === "present")
      return "✅";

    if (status === "half")
      return "🕐";

    if (status === "absent")
      return "❌";

    return "•";
  };

  const getFormattedDate = (
    dateString
  ) => {
    const fullDate =
      new Date(dateString);

    const dateLabel =
      fullDate.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      );

    const dayName =
      fullDate.toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
        }
      );

    return {
      dateLabel,
      dayName,
    };
  };

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
          font-family:"Poppins", sans-serif;
        }

        .calendar-wrapper{
          width:100%;
        }

        .calendar-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(170px,1fr));
          gap:15px;
        }

        .attendance-card{
          background:white;
          border-radius:18px;
          padding:18px;
          box-shadow:0 8px 25px rgba(0,0,0,.06);
          border:2px solid transparent;
          transition:.3s;
          text-align:center;
        }

        .attendance-card:hover{
          transform:translateY(-4px);
        }

        .attendance-date{
          font-size:18px;
          font-weight:800;
          color:#0f172a;
          margin-bottom:4px;
        }

        .attendance-day{
          font-size:13px;
          color:#64748b;
          margin-bottom:10px;
          font-weight:500;
        }

        .attendance-status{
          font-size:14px;
          font-weight:700;
        }

        .present-card{
          background:#f0fdf4;
          border-color:#16a34a;
        }

        .present-card .attendance-status{
          color:#15803d;
        }

        .half-card{
          background:#fffbeb;
          border-color:#f59e0b;
        }

        .half-card .attendance-status{
          color:#d97706;
        }

        .absent-card{
          background:#fef2f2;
          border-color:#ef4444;
        }

        .absent-card .attendance-status{
          color:#dc2626;
        }

        .loading-box,
        .empty-box{
          text-align:center;
          padding:35px;
          color:#64748b;
          font-weight:600;
        }

        @media(max-width:768px){
          .calendar-grid{
            grid-template-columns:1fr;
          }
        }

      `}</style>

      <div className="calendar-wrapper">

        {loading ? (
          <div className="loading-box">
            Loading attendance...
          </div>
        ) : data.length === 0 ? (
          <div className="empty-box">
            No attendance found
          </div>
        ) : (
          <div className="calendar-grid">

            {data.map((item) => {
              const {
                dateLabel,
                dayName
              } = getFormattedDate(
                item.date
              );

              return (
                <div
                  key={item._id}
                  className={`attendance-card ${getStatusClass(
                    item.status
                  )}`}
                >

                  <div className="attendance-date">
                    {dateLabel}
                  </div>

                  <div className="attendance-day">
                    {dayName}
                  </div>

                  <div className="attendance-status">
                    {getStatusIcon(
                      item.status
                    )}{" "}
                    {item.status
                      .charAt(0)
                      .toUpperCase() +
                      item.status.slice(
                        1
                      )}
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </>
  );
}

export default AttendanceCalendar;