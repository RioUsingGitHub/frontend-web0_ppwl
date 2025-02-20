import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/products";
const CATEGORY_URL = "http://localhost:8000/api/categories";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category_id, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [editingProductId, setEditingProductId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editQuantity, setEditQuantity] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
        } catch (error) {
            console.error("Gagal mengambil data produk:", error);
            setError("Gagal mengambil data produk");
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(CATEGORY_URL);
            // Handle both possible API response formats
            const categoryData = response.data.data || response.data;
            if (Array.isArray(categoryData)) {
                setCategories(categoryData);
            } else {
                console.error("Format data kategori tidak sesuai:", response.data);
                setError("Format data kategori tidak sesuai");
            }
        } catch (error) {
            console.error("Gagal mengambil data kategori:", error);
            setError("Gagal mengambil data kategori");
        }
    };

    const startEditProduct = (product) => {
        setEditingProductId(product.id);
        setEditName(product.name || "");
        setEditQuantity(product.quantity || "");
        setEditPrice(product.price || "");
        setEditDescription(product.description || "");
        setEditCategoryId(product.category_id ? String(product.category_id) : "");
    };

    const cancelEditProduct = () => {
        setEditingProductId(null);
        setEditName("");
        setEditQuantity("");
        setEditPrice("");
        setEditDescription("");
        setEditCategoryId("");
    };

    const updateProduct = async () => {
        if (!editName.trim() || !editQuantity || !editPrice || !editDescription.trim() || !editCategoryId) {
            setError("Semua field harus diisi");
            return;
        }

        setLoading(true);
        try {
            await axios.put(
                `${API_URL}/${editingProductId}`,
                {
                    name: editName,
                    quantity: parseInt(editQuantity),
                    price: parseFloat(editPrice),
                    description: editDescription,
                    category_id: parseInt(editCategoryId),
                },
                { headers: { "Content-Type": "application/json" } }
            );
            cancelEditProduct();
            fetchProducts();
            setError("");
        } catch (err) {
            setError("Gagal memperbarui produk");
            console.error(err);
        }
        setLoading(false);
    };

    const addProduct = async () => {
        if (!name.trim() || !quantity || !price || !description.trim() || !category_id) {
            setError("Semua field harus diisi");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                API_URL,
                {
                    name,
                    quantity: parseInt(quantity),
                    price: parseFloat(price),
                    description,
                    category_id: parseInt(category_id),
                },
                { headers: { "Content-Type": "application/json" } }
            );
            setName("");
            setQuantity("");
            setPrice("");
            setDescription("");
            setCategoryId("");
            fetchProducts();
            setError("");
        } catch (err) {
            setError("Gagal menambahkan produk");
            console.error(err);
        }
        setLoading(false);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

        setLoading(true);
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchProducts();
            setError("");
        } catch (err) {
            setError("Gagal menghapus produk");
            console.error(err);
        }
        setLoading(false);
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name: "Tidak ada kategori";
    };

    return (
        <div style={{ padding: "20px", flex: 1 }}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Memuat data...</p>}

            <h1>Daftar Produk</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id} style={{ marginBottom: "10px" }}>
                        <strong>{product.name}</strong> - 
                        Stok: {product.quantity} - 
                        Harga: Rp {parseFloat(product.price).toLocaleString()} - 
                        Keterangan: {product.description} - 
                        <strong> Kategori: {getCategoryName(product.category_id)}</strong>
                        <button
                            onClick={() => startEditProduct(product)}
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
                            onClick={() => deleteProduct(product.id)}
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

            {editingProductId ? (
                <div style={{ marginTop: "20px" }}>
                    <h2>Edit Produk</h2>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <select
                            value={editCategoryId}
                            onChange={(e) => setEditCategoryId(e.target.value)}
                            style={{ padding: "5px", minWidth: "200px" }}
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Nama Produk"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            style={{ padding: "5px" }}
                        />
                        <input
                            type="number"
                            placeholder="Stok"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            style={{ padding: "5px" }}
                        />
                        <input
                            type="number"
                            placeholder="Harga"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            style={{ padding: "5px" }}
                        />
                        <input
                            type="text"
                            placeholder="Keterangan"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            style={{ padding: "5px" }}
                        />
                        <button
                            onClick={updateProduct}
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
                            onClick={cancelEditProduct}
                            style={{
                                padding: "5px 15px",
                                backgroundColor: "gray",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Batal
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: "20px" }}>
                    <h2>Tambah Produk</h2>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <select
                            value={category_id}
                            onChange={(e) => setCategoryId(e.target.value)}
                            style={{ padding: "5px", minWidth: "200px" }}
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Nama Produk"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ padding: "5px" }}
                        />
                        <input
                            type="number"
                            placeholder="Stok"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            style={{ padding: "5px" }}
                        />
                        <input
                            type="number"
                            placeholder="Harga"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            style={{ padding: "5px" }}
                        />
                        <input
                            type="text"
                            placeholder="Keterangan"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ padding: "5px" }}
                        />
                        <button
                            onClick={addProduct}
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
                </div>
            )}
        </div>
    );
};

export default Products;