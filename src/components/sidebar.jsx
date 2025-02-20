import React from "react";


const Sidebar = ({ setPage }) => {
    return (
        <div style={{ width: "200px", height: "100vh", background: "#333", color: "#fff", padding: "20px" }}>
            <h2>Menu</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ padding: "10px 0", cursor: "pointer" }} onClick={() => setPage("users")}>
                    Pengguna
                </li>
                <li style={{ padding: "10px 0", cursor: "pointer" }} onClick={() => setPage("products")}>
                    Produk
                </li>
                <li style={{ padding: "10px 0", cursor: "pointer" }} onClick={() => setPage("categories")}>
                    Categories
                </li>
            </ul>
        </div>
    );
};


export default Sidebar;