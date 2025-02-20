import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/categories";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setNameCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editCategory, setEditCategory] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setCategories(response.data);
            setError("");
        } catch (error) {
            setError("Gagal mengambil data kategori.");
            console.error("Error fetching categories:", error);
        }
        setLoading(false);
    };

    const addCategory = async () => {
        if (!name.trim()) {
            setError("Nama kategori tidak boleh kosong.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                API_URL,
                { name },
                { headers: { "Content-Type": "application/json" } }
            );
            setNameCategory("");
            fetchCategories();
            setError("");
        } catch (err) {
            setError("Gagal menambahkan kategori. Pastikan nama kategori unik.");
            console.error(err.response?.data || err.message);
        }
        setLoading(false);
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;

        setLoading(true);
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchCategories();
            setError("");
        } catch (err) {
            setError("Gagal menghapus kategori.");
            console.error(err);
        }
        setLoading(false);
    };

    const startEditCategory = (category) => {
        setEditingCategoryId(category.id);
        setEditCategory(category.name);
    };

    const cancelEditCategory = () => {
        setEditingCategoryId(null);
        setEditCategory("");
    };

    const updateCategory = async () => {
        if (!editCategory.trim()) {
            setError("Nama kategori tidak boleh kosong.");
            return;
        }

        setLoading(true);
        try {
            await axios.put(
                `${API_URL}/${editingCategoryId}`,
                { name: editCategory },
                { headers: { "Content-Type": "application/json" } }
            );
            setEditingCategoryId(null);
            setEditCategory("");
            fetchCategories();
            setError("");
        } catch (err) {
            setError("Gagal memperbarui kategori. Pastikan nama kategori unik.");
            console.error(err.response?.data || err.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Memuat data...</p>}
            
            <h2>Daftar Kategori</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        {category.name}
                        <button 
                            onClick={() => startEditCategory(category)}
                            style={{
                                marginLeft: "10px",
                                color: "white",
                                backgroundColor: "green",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteCategory(category.id)}
                            style={{
                                marginLeft: "10px",
                                color: "white",
                                backgroundColor: "red",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                            }}
                        >
                            Hapus
                        </button>
                    </li>
                ))}
            </ul>

            {editingCategoryId ? (
                <div>
                    <h2>Edit Kategori</h2>
                    <input
                        type="text"
                        placeholder="Nama Kategori"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <button
                        onClick={updateCategory}
                        style={{
                            padding: "5px 15px",
                            backgroundColor: "blue",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {loading ? "Memperbarui..." : "Perbarui"}
                    </button>
                    <button
                        onClick={cancelEditCategory}
                        style={{
                            padding: "5px 15px",
                            backgroundColor: "gray",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            marginLeft: "10px",
                        }}
                    >
                        Batal
                    </button>
                </div>
            ) : (
                <div>
                    <h2>Tambah Kategori</h2>
                    <input
                        type="text"
                        placeholder="Nama Kategori"
                        value={name}
                        onChange={(e) => setNameCategory(e.target.value)}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <button
                        onClick={addCategory}
                        style={{
                            padding: "5px 15px",
                            backgroundColor: "blue",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {loading ? "Menambahkan..." : "Tambah"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Categories;