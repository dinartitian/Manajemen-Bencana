import PropTypes from "prop-types";
import { useState } from "react";

const Table = ({ data, onEdit, onDelete, isLoading, type }) => {
    const [filters, setFilters] = useState({
        lokasi: "",
        keparahan: "",
    });
    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: "",
    });

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const applyFiltersAndSorting = (data) => {
        let filteredData = data;

        // Apply filters
        if (filters.lokasi) {
            filteredData = filteredData.filter((item) =>
                item.lokasi.toLowerCase().includes(filters.lokasi.toLowerCase())
            );
        }
        if (filters.keparahan) {
            filteredData = filteredData.filter(
                (item) => item.keparahan === filters.keparahan
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return filteredData;
    };

    const filteredAndSortedData = applyFiltersAndSorting(data);

    const renderFilters = () => {
        if (type === "bencana") {
            return (
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        name="lokasi"
                        placeholder="Filter Lokasi"
                        className="border px-2 py-1"
                        value={filters.lokasi}
                        onChange={handleFilterChange}
                    />
                    <select
                        name="keparahan"
                        className="border px-2 py-1"
                        value={filters.keparahan}
                        onChange={handleFilterChange}
                    >
                        <option value="">Semua Keparahan</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Tinggi">Tinggi</option>
                        <option value="Sangat Tinggi">Sangat Tinggi</option>
                    </select>
                </div>
            );
        }
        return null;
    };

    const renderTableHeaders = () => {
        if (type === "bencana") {
            return (
                <>
                    <th
                        className="px-4 py-2 border cursor-pointer"
                        onClick={() => handleSort("namaBencana")}
                    >
                        Nama Bencana {sortConfig.key === "namaBencana" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                        className="px-4 py-2 border cursor-pointer"
                        onClick={() => handleSort("lokasi")}
                    >
                        Lokasi {sortConfig.key === "lokasi" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                        className="px-4 py-2 border cursor-pointer"
                        onClick={() => handleSort("keparahan")}
                    >
                        Tingkat Keparahan {sortConfig.key === "keparahan" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                        className="px-4 py-2 border cursor-pointer"
                        onClick={() => handleSort("jumlahKorban")}
                    >
                        Jumlah Korban {sortConfig.key === "jumlahKorban" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                </>
            );
        }
        return (
            <>
                <th className="px-4 py-2 border">Nama Donatur</th>
                <th className="px-4 py-2 border">Jumlah Donasi</th>
                <th className="px-4 py-2 border">Metode Pembayaran</th>
                <th className="px-4 py-2 border">Pesan</th>
            </>
        );
    };

    const renderTableRows = (item) => {
        if (type === "bencana") {
            return (
                <>
                    <td className="px-4 py-2 border">{item.namaBencana || "-"}</td>
                    <td className="px-4 py-2 border">{item.lokasi || "-"}</td>
                    <td className="px-4 py-2 border">{item.keparahan || "-"}</td>
                    <td className="px-4 py-2 border">{item.jumlahKorban || 0}</td>
                </>
            );
        }
        return (
            <>
                <td className="px-4 py-2 border">{item.namaDonatur || "Anonim"}</td>
                <td className="px-4 py-2 border">
                    Rp {item.jumlahDonasi ? item.jumlahDonasi.toLocaleString() : "0"}
                </td>
                <td className="px-4 py-2 border">{item.metodePembayaran || "-"}</td>
                <td className="px-4 py-2 border">{item.pesan || "-"}</td>
            </>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan={5} className="px-4 py-2 text-center">
                        Loading...
                    </td>
                </tr>
            );
        }
        if (filteredAndSortedData.length > 0) {
            return filteredAndSortedData.map((item) => (
                <tr key={item.id || Math.random()}>
                    {renderTableRows(item)}
                    <td className="px-4 py-2 border text-center">
                        <button
                            onClick={() => onEdit(item.id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Hapus
                        </button>
                    </td>
                </tr>
            ));
        }
        return (
            <tr>
                <td colSpan={5} className="px-4 py-2 text-center">
                    Tidak ada data {type === "bencana" ? "bencana" : "donasi"}
                </td>
            </tr>
        );
    };

    return (
        <div className="overflow-x-auto">
            {renderFilters()}
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        {renderTableHeaders()}
                        <th className="px-4 py-2 border">Aksi</th>
                    </tr>
                </thead>
                <tbody>{renderContent()}</tbody>
            </table>
        </div>
    );
};

Table.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            namaBencana: PropTypes.string,
            lokasi: PropTypes.string,
            keparahan: PropTypes.string,
            jumlahKorban: PropTypes.number,
            namaDonatur: PropTypes.string,
            jumlahDonasi: PropTypes.number,
            metodePembayaran: PropTypes.string,
            pesan: PropTypes.string,
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isLoading: PropTypes.bool, // opsional
    type: PropTypes.oneOf(["bencana", "donasi"]).isRequired, // untuk membedakan tabel
};

export default Table;
