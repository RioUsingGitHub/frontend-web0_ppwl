import React, { useEffect, useState } from "react";
import axios from "axios";


const API_URL = "http://localhost:8000/api/users";


const Users = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const [editingUserId, setEditingUserId] = useState(null); // State untuk menyimpan ID user yang sedang diedit
    const [editName, setEditName] = useState(""); // State untuk menyimpan nama yang sedang diedit
    const [editEmail, setEditEmail] = useState(""); // State untuk menyimpan email yang sedang diedit
    const [editPassword, setEditPassword] = useState(""); // State untuk menyimpan password yang sedang diedit




    useEffect(() => {
        fetchUsers();
    }, []);


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setUsers(response.data);
        } catch (error) {
            console.error("Gagal mengambil data pengguna:", error);
        }
        setLoading(false);
    };


    const addUser = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("Nama, email, dan password tidak boleh kosong.");
            return;
        }


        setLoading(true);
        try {
            await axios.post(
                API_URL,
                { name, email, password },
                { headers: { "Content-Type": "application/json" } }
            );
            setName("");
            setEmail("");
            setPassword("");
            fetchUsers();
            setError("");
        } catch (err) {
            setError("Gagal menambahkan pengguna. Pastikan email unik.");
            console.error(err.response?.data || err.message);
        }
        setLoading(false);
    };


    const deleteUser = async (id) => {
        if (!window.confirm("Yakin ingin menghapus pengguna ini?")) return;


        setLoading(true);
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchUsers();
            setError("");
        } catch (err) {
            setError("Gagal menghapus pengguna.");
            console.error(err);
        }
        setLoading(false);
    };


    const startEditUser = (user) => {
        setEditingUserId(user.id);
        setEditName(user.name || ""); // Gunakan "" jika undefined
        setEditEmail(user.email || "");
        setEditPassword(""); // Tidak menggunakan user.password karena mungkin tidak tersedia
    };


    const cancelEditUser = () => {
        setEditingUserId(null);
        setEditName("");
        setEditEmail("");
        setEditPassword("");
    };


    const updateUser = async () => {
        console.log("editName:", editName);
        console.log("editEmail:", editEmail);
        console.log("editPassword:", editPassword);


        if (!editName.trim() || !editEmail.trim() || !editPassword.trim()) {
            setError("Nama, email, dan password tidak boleh kosong.");
            return;
        }


        setLoading(true);
        try {
            await axios.put(
                `${API_URL}/${editingUserId}`,
                { name: editName, email: editEmail, password: editPassword },
                { headers: { "Content-Type": "application/json" } }
            );
            setEditingUserId(null);
            setEditName("");
            setEditEmail("");
            setEditPassword("");
            fetchUsers();
            setError("");
        } catch (err) {
            setError("Gagal memperbarui pengguna. Pastikan email unik.");
            console.error(err.response?.data || err.message);
        }
        setLoading(false);
    };


    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>


            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading ? <p>Memuat data...</p> : null}
            <h2>Daftar Pengguna</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <button onClick={() => startEditUser(user)}
                            style={
                                {
                                    marginLeft: "10px",
                                    color: "white",
                                    backgroundColor: "green",
                                    border: "none",
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                }
                            }>
                            EDIT
                        </button>
                        <button
                            onClick={() => deleteUser(user.id)}
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


            {editingUserId && (
                <div>
                    <h2>Edit Pengguna</h2>
                    <input
                        type="text"
                        placeholder="Nama"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <button
                        onClick={updateUser}
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
                        onClick={cancelEditUser}
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
            )}


            <h2>Tambah Pengguna</h2>
            <input
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginRight: "10px", padding: "5px" }}
            />
            <button
                onClick={addUser}
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


    );
};


export default Users;


