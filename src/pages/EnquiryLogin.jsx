import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
  });

  const [loginType, setLoginType] = useState("admin"); // 🔥 NEW
  const [loading, setLoading] = useState(false); // 🔥 NEW LOADER STATE
  const [showPassword, setShowPassword] = useState(false); // 🔥 SHOW/HIDE PASSWORD

  const goto = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.replace("#/home");
    }
  }, [goto]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function Login(e) {
    e.preventDefault();

    setLoading(true); // 🔥 START LOADER

    try {
      const url =
        loginType === "staff"
          ? "https://dgrnode.vercel.app/api/staff/login"
          : "https://dgrnode.vercel.app/adminlogin";

      const payload =
        loginType === "staff"
          ? {
              mobile: formData.emailOrMobile,
              password: formData.password,
            }
          : {
              emailOrMobile: formData.emailOrMobile,
              password: formData.password,
            };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // 🔥 Admin Block Check
        if (loginType === "admin") {
          if (data?.user?.isBlocked === false) {
            toast.success("Admin Login successful 🔥");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setTimeout(() => {
              goto("/home");
            }, 1500);
          } else {
            toast.error("You are Blocked..! Contact Admin..!");
          }
        }

        // 🔥 Staff Login
        if (loginType === "staff") {
          toast.success("Staff Login successful 🔥");

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.staff));

          setTimeout(() => {
            goto("/staffdashboard");
          }, 1500);
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Server error...");
    } finally {
      setLoading(false); // 🔥 STOP LOADER
    }
  }

  return (
    <>
      <Toaster />
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #667eea;
          font-family: Arial, Helvetica, sans-serif;
          position: relative;
        }

        .login-form {
          background: #ffffff;
          padding: 30px 45px;
          width: 100%;
          max-width: 380px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .login-form h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .login-form input {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          outline: none;
        }

        .login-form input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .login-form button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #667eea;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .login-form button:hover {
          background: #5a67d8;
        }

        .login-form select {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
        }

        .password-wrapper {
          position: relative;
          margin-bottom: 15px;
        }

        .password-wrapper input {
          margin-bottom: 0;
          padding-right: 70px;
        }

        .toggle-password {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #667eea;
          user-select: none;
        }

        /* 🔥 LOADER CSS */
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loader-box {
          background: #fff;
          padding: 25px 35px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .spinner {
          width: 45px;
          height: 45px;
          border: 4px solid #ddd;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: auto;
          margin-bottom: 12px;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }

        .loader-text {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }
      `}</style>

      <div className="login-container">

        {/* 🔥 LOADER */}
        {loading && (
          <div className="loader-overlay">
            <div className="loader-box">
              <div className="spinner"></div>
              <div className="loader-text">Logging in...</div>
            </div>
          </div>
        )}

        <form className="login-form" onSubmit={Login}>
          <h2>Login</h2>

          {/* 🔥 LOGIN TYPE SELECT */}
          <select
            value={loginType}
            onChange={(e) => setLoginType(e.target.value)}
          >
            <option value="admin">Admin Login</option>
            <option value="staff">Staff Login</option>
          </select>

          <input
            type="text"
            name="emailOrMobile"
            placeholder={
              loginType === "staff"
                ? "Enter Mobile Number"
                : "Email or Mobile Number"
            }
            value={formData.emailOrMobile}
            onChange={handleChange}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required 
              style={{paddingRight  :"15px"}}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit">
            {loading ? "Please Wait..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export { LoginForm };