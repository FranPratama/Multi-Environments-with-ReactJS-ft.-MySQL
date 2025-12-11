const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi Database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Cek koneksi saat server mulai (Agar ketahuan jika password salah)
db.getConnection((err, connection) => {
    if (err) {
        console.error('ERROR KONEKSI DATABASE:', err.code);
        console.error('Pesan:', err.message);
    } else {
        console.log('BERHASIL Terkoneksi ke Database MySQL!');
        connection.release();
    }
});

// --- ROUTES CRUD KARYAWAN ---

// 1. READ (Ambil semua karyawan)
app.get('/api/karyawan', (req, res) => {
    db.query("SELECT * FROM karyawan ORDER BY id DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// 2. CREATE (Tambah karyawan)
app.post('/api/karyawan', (req, res) => {
    const { nama, jabatan, gaji } = req.body;
    const sql = "INSERT INTO karyawan (nama, jabatan, gaji) VALUES (?, ?, ?)";
    db.query(sql, [nama, jabatan, gaji], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, nama, jabatan, gaji });
    });
});

// 3. DELETE (Hapus karyawan)
app.delete('/api/karyawan/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM karyawan WHERE id = ?", id, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Berhasil dihapus" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});