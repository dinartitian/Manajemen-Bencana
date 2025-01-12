import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Button from "../components/Button.jsx";

function ModalTambah({ isOpen, onClose, onSave, isLoading, type, formData: initialFormData }) {
    const [localFormData, setLocalFormData] = useState({ ...initialFormData });

    useEffect(() => {
        if (isOpen) {
            setLocalFormData({ ...initialFormData }); // Reset form ketika modal dibuka
        }
    }, [isOpen, initialFormData]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const parsedValue = type === "number" ? parseFloat(value) || "" : value; // Parsing angka, default ke string kosong jika tidak valid
        setLocalFormData((prevState) => ({
            ...prevState,
            [name]: parsedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi setiap field kecuali "id" saat menambah data
        const invalidFields = Object.entries(localFormData).filter(([key, value]) => {
            if (key === "id") return false; // Abaikan validasi id
            if (typeof value === "string") return value.trim() === ""; // String tidak boleh kosong
            if (typeof value === "number") return value <= 0; // Number tidak boleh nol atau negatif
            return value === null || value === undefined; // Null/Undefined tidak valid
        });

        if (invalidFields.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Validasi Error",
                text: `Field berikut harus diisi: ${invalidFields.map(([key]) => key).join(", ")}`,
            });
            return;
        }

        try {
            console.log("Saving Data:", localFormData); // Debugging untuk memastikan data benar
            await onSave(localFormData); // Memanggil fungsi onSave yang diterima dari props
            onClose(); // Tutup modal setelah berhasil menyimpan
        } catch (err) {
            console.error("Error saat menyimpan data:", err); // Menampilkan error di console
            Swal.fire({
                icon: "error",
                title: "Gagal Menyimpan",
                text: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
            });
        }
    };

    const resetForm = () => {
        setLocalFormData({ ...initialFormData }); // Reset data form ke data awal
        onClose(); // Tutup modal
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">
                            {type === "bencana" ? "Tambah/Edit Data Bencana" : "Tambah/Edit Data Donasi"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {type === "bencana" && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="namaBencana" className="block text-gray-700">Nama Bencana</label>
                                        <input
                                            id="namaBencana"
                                            name="namaBencana"
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.namaBencana || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="lokasi" className="block text-gray-700">Lokasi</label>
                                        <input
                                            id="lokasi"
                                            name="lokasi"
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.lokasi || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="tanggal" className="block text-gray-700">Tanggal</label>
                                        <input
                                            id="tanggal"
                                            name="tanggal"
                                            type="date"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.tanggal || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="keparahan" className="block text-gray-700">Tingkat Keparahan</label>
                                        <select
                                            id="keparahan"
                                            name="keparahan"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.keparahan || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        >
                                            <option value="">Pilih Tingkat Keparahan</option>
                                            <option value="Rendah">Rendah</option>
                                            <option value="Sedang">Sedang</option>
                                            <option value="Tinggi">Tinggi</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="jumlahKorban" className="block text-gray-700">Jumlah Korban</label>
                                        <input
                                            id="jumlahKorban"
                                            name="jumlahKorban"
                                            type="number"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.jumlahKorban || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                            min={1} // Minimal 1 korban
                                        />
                                    </div>
                                </>
                            )}
                            {type === "donasi" && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="namaDonatur" className="block text-gray-700">Nama Donatur</label>
                                        <input
                                            id="namaDonatur"
                                            name="namaDonatur"
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.namaDonatur || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="jumlahDonasi" className="block text-gray-700">Jumlah Donasi</label>
                                        <input
                                            id="jumlahDonasi"
                                            name="jumlahDonasi"
                                            type="number"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.jumlahDonasi || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="tanggalDonasi" className="block text-gray-700">Tanggal Donasi</label>
                                        <input
                                            id="tanggalDonasi"
                                            name="tanggalDonasi"
                                            type="date"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.tanggalDonasi || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="metodePembayaran" className="block text-gray-700">Metode Pembayaran</label>
                                        <select
                                            id="metodePembayaran"
                                            name="metodePembayaran"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.metodePembayaran || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        >
                                            <option value="">Pilih Metode Pembayaran</option>
                                            <option value="Transfer Bank">Transfer Bank</option>
                                            <option value="E-Wallet">E-Wallet</option>
                                            <option value="Tunai">Tunai</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="pesan" className="block text-gray-700">Pesan</label>
                                        <textarea
                                            id="pesan"
                                            name="pesan"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            value={localFormData.pesan || ""}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {/* Bagian tombol */}
                            <div className="flex justify-end">
                                <Button
                                    label="Batal"
                                    className="bg-gray-500 text-white mr-2"
                                    onClick={resetForm}
                                    disabled={isLoading}
                                />
                                <Button
                                    label="Simpan"
                                    className="bg-green-500 text-white"
                                    type="submit"
                                    disabled={isLoading}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

ModalTambah.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    type: PropTypes.oneOf(["bencana", "donasi"]).isRequired,
    formData: PropTypes.object.isRequired,
};

export default ModalTambah;
