import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import Users from "./components/users";
import Products from "./components/products";
import Categories from "./components/categorys";


const App = () => {
  const [page, setPage] = useState("users");


  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />
      <div style={{ flex: 1, padding: "20px" }}>
        {page === "users" && <Users />}
        {page === "products" && <Products />}
        {page === "categories" && <Categories />}
      </div>
    </div>
  );
};


export default App;

