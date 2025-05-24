import React, { useState } from "react";
import { NavLink } from "react-router-dom";


function SidebarHeader() {
    const [isOpen, setIsOpen] = useState(true);

    const menus = [
        { id: 1, menuname: "Home", path: "home" },
        { id: 2, menuname: "Add Enquiry", path: "addenquiry" },
        { id: 3, menuname: "Courses", path: "courses" },
        { id: 4, menuname: "Blog", path: "blog" },
        { id: 4, menuname: "WebsiteEnquiry", path: "webenq" },
    ];

    function Logout() {
        localStorage.removeItem("userprivatekey");
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    return (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "⮜" : "⮞"}
            </button>

            {isOpen && (
                <>
                    <h2 className="logo">Jdb Admin</h2>
                    <img src="https://jdbinfotech.co.in/images/logo.png" alt="Logo" className="logo-img" />
                </>
            )}

            <ul className="nav-list">
                {menus.map((menuitem) => (
                    <li key={menuitem.id} className="nav-item">
                        <NavLink
                            to={`/${menuitem.path}`}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            {isOpen ? menuitem.menuname : menuitem.menuname.charAt(0)}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {isOpen && (
                <div className="logout-container">
                    <button onClick={Logout} className="logout-button">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export { SidebarHeader };
