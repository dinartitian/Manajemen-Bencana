import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Button from "../components/Button.jsx";
import Table from "../components/Tabel.jsx";
import Header from "../layouts/Header.jsx";
import axios from "axios";
import Sider from "../layouts/Sider.jsx";
import Footer from "../layouts/Footer.jsx";
import ModalTambah from "../layouts/ModalTambah.jsx";
import ModalProfile from "../layouts/ModalProfile.jsx";
import { v4 as uuidv4 } from "uuid"; // Untuk ID unik

function AdminLayout({ type }) {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleOpenProfileModal = () => setIsProfileModalOpen(true);
    const handleCloseProfileModal = () => setIsProfileModalOpen(false);

    return (
        <div className="bg-gray-100">
            <div className="flex min-h-screen">
                <Sider />
                <div className="flex-1 flex flex-col">
                    <Header onProfileClick={handleOpenProfileModal} />
                    <Content type={type} />
                    <Footer />
                </div>
            </div>
            {isProfileModalOpen && (
                <ModalProfile isOpen={isProfileModalOpen} onClose={handleCloseProfileModal} />
            )}
        </div>
    );
}

AdminLayout.propTypes = {
    type: PropTypes.oneOf(["bencana", "donasi"]).isRequired,
};

const Content = ({ type }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const endpoint = type === "bencana" ? "disasters" : "donations";

    const initialFormState = useCallback(() => (
        type === "bencana"
            ? { id: null, namaBencana: "", lokasi: "", tanggal: "", keparahan: "", jumlahKorban: 0 }
            : { id: null, namaDonatur: "", jumlahDonasi: 0, tanggalDonasi: "", metodePembayaran: "", pesan: "" }
    ), [type]);

    const [formData, setFormData] = useState(initialFormState);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/${endpoint}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Gagal mengambil data ${type}`,
                confirmButtonColor: "#dc3545",
            });
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, type]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = () => {
        setFormData(initialFormState());
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setFormData(initialFormState());
        setIsModalOpen(false);
    };

    const handleSaveData = async (savedFormData) => {
        setIsLoading(true);
        try {
            if (savedFormData.id) {
                const response = await axios.put(`http://localhost:3001/${endpoint}/${savedFormData.id}`, savedFormData);
                setData((prev) => prev.map((item) => (item.id === savedFormData.id ? response.data : item)));
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: `${type === "bencana" ? "Bencana" : "Donasi"} berhasil diperbarui.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                const response = await axios.post(`http://localhost:3001/${endpoint}`, {
                    ...savedFormData,
                    id: uuidv4(),
                });
                setData((prev) => [...prev, response.data]);
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: `${type === "bencana" ? "Bencana" : "Donasi"} berhasil ditambahkan.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error(`Error saving ${type}:`, error);
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: `Terjadi kesalahan saat menyimpan ${type}.`,
                confirmButtonColor: "#dc3545",
            });
        } finally {
            setIsLoading(false);
            handleCloseModal();
        }
    };

    const handleEdit = (id) => {
        const itemToEdit = data.find((item) => item.id === id);
        if (itemToEdit) {
            setFormData({ ...itemToEdit });
            setIsModalOpen(true);
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Data dengan ID ${id} tidak ditemukan.`,
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Konfirmasi Hapus",
                text: "Data yang sudah dihapus tidak dapat dikembalikan",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef4444", // Merah untuk tombol konfirmasi
                cancelButtonColor: "#6b7280", // Abu-abu untuk tombol batal
                confirmButtonText: "Ya, Hapus",
                cancelButtonText: "Batal",
            });

            if (result.isConfirmed) {
                setIsLoading(true);
                await axios.delete(`http://localhost:3001/${endpoint}/${id}`);
                setData((prev) => prev.filter((item) => item.id !== id));
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Data berhasil dihapus",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            Swal.fire({
                icon: "error",
                title: "Gagal Menghapus",
                text: `Terjadi kesalahan saat menghapus data ${type}`,
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <div className="flex justify-between mb-4 p-4 bg-blue-800 text-white">
            <h2 className="text-xl font-semibold">{type === "bencana" ? "LIST BENCANA" : "LIST DONASI"}</h2>
            <Button label="Tambah" onClick={handleOpenModal} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" />
        </div>
        <main className="p-4 bg-gray-100">
            {isLoading ? (
                <div className ="flex justify-center items-center h-32">
                    <p>Loading...</p>
                </div>
            ) : data.length > 0 ? (
                <Table data={data} onEdit={handleEdit} onDelete={handleDelete} type={type}/>
            ) : (
                <p className="text-center text-gray-500"> Data Kosong.</p>
            )}
        </main>
        {isModalOpen && (
            <ModalTambah
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveData}
                formData={formData}
                type={type}
            />
        )}
        </>
    );
};

Content.propTypes = {
    type: PropTypes.oneOf(["bencana", "donasi"]).isRequired,
};

export default AdminLayout;
