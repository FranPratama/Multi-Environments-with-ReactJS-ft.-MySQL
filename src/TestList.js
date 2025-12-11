import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TestList.css';

const TestList = () => {
    const [karyawanList, setKaryawanList] = useState([]);
    const [nama, setNama] = useState("");
    const [jabatan, setJabatan] = useState("");
    const [gaji, setGaji] = useState("");

    const API_URL = process.env.REACT_APP_API_URL;

    // DEFINISI FUNGSI FETCH
    const fetchKaryawan = async () => {
        try {
            const res = await axios.get(`${API_URL}/karyawan`);
            setKaryawanList(res.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // READ (Dijalankan saat pertama kali load)
    useEffect(() => {
        fetchKaryawan();
    }, []); 

    // CREATE
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!nama || !jabatan || !gaji) return alert("Mohon lengkapi data karyawan!");
        
        try {
            await axios.post(`${API_URL}/karyawan`, { nama, jabatan, gaji });
            alert("Data berhasil disimpan!"); 
            
            setNama("");
            setJabatan("");
            setGaji("");
            fetchKaryawan(); // Refresh data
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan. Pastikan Backend sudah menyala dan Database terhubung!"); 
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        if(window.confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
            try {
                await axios.delete(`${API_URL}/karyawan/${id}`);
                fetchKaryawan(); // Refresh data
            } catch (error) {
                console.error(error);
            }
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    };

    return (
        <div className="container">
            <h1>👥 Manajemen Karyawan</h1>
            <div className="env-badge">
                Environment: <strong>{process.env.REACT_APP_ENV_NAME}</strong>
            </div>
            
            <div className="form-card">
                <h3>Tambah Karyawan Baru</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            placeholder="Nama Lengkap" 
                            value={nama} 
                            onChange={e => setNama(e.target.value)} 
                        />
                        <input 
                            placeholder="Nama Jabatan" 
                            value={jabatan} 
                            onChange={e => setJabatan(e.target.value)} 
                        />
                        <input 
                            type="number"
                            placeholder="Gaji (Rp)" 
                            value={gaji} 
                            onChange={e => setGaji(e.target.value)} 
                        />
                    </div>
                    <button type="submit" className="save-btn">💾 Simpan Data</button>
                </form>
            </div>

            <table className="employee-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Karyawan</th>
                        <th>Jabatan</th>
                        <th>Gaji</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {karyawanList.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{textAlign: "center", padding: "20px"}}>
                                Belum ada data karyawan. Silakan tambah data baru.
                            </td>
                        </tr>
                    ) : (
                        karyawanList.map((item, index) => (
                            <tr key={item.id}>
                                {/* Perhatikan penambahan data-label di setiap td */}
                                <td data-label="No">{index + 1}</td>
                                <td data-label="Nama Karyawan"><strong>{item.nama}</strong></td>
                                <td data-label="Jabatan"><span className="badge-jabatan">{item.jabatan}</span></td>
                                <td data-label="Gaji">{formatRupiah(item.gaji)}</td>
                                <td data-label="Aksi">
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TestList;