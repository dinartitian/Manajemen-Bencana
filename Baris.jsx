import PropTypes from 'prop-types';
import Button from "./Button.jsx";

const Baris = ({ no, id, type, data, onEdit, onDelete }) => {
    return (
        <tr className="odd:bg-white even:bg-gray-50">
            <td className="border px-4 py-2 text-center">{no}</td>
            {type === "bencana" ? (
                <>
                    <td className="border px-4 py-2">{data.namaBencana || "-"}</td>
                    <td className="border px-4 py-2">{data.lokasi || "-"}</td>
                    <td className="border px-4 py-2 text-center">{data.tanggal || "-"}</td>
                    <td className="border px-4 py-2 text-center">{data.keparahan || "-"}</td>
                    <td className="border px-4 py-2 text-center">{data.jumlahKorban || 0}</td>
                </>
            ) : (
                <>
                    <td className="border px-4 py-2">{data.namaDonatur || "Anonim"}</td>
                    <td className="border px-4 py-2 text-right">
                        Rp {data.jumlahDonasi?.toLocaleString() || "0"}
                    </td>
                    <td className="border px-4 py-2 text-center">{data.tanggalDonasi || "-"}</td>
                    <td className="border px-4 py-2 text-center">{data.metodePembayaran || "-"}</td>
                    <td className="border px-4 py-2">{data.pesan || "-"}</td>
                </>
            )}
            <td className="border px-4 py-2 text-center">
                <div className="flex justify-center gap-2">
                    {onEdit && (
                        <Button
                            label="Edit"
                            onClick={() => onEdit(id, type)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            label="Delete"
                            onClick={() => onDelete(id, type)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                            Hapus
                        </Button>
                    )}
                </div>
            </td>
        </tr>
    );
};

Baris.propTypes = {
    no: PropTypes.number.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(["bencana", "donasi"]).isRequired, // menentukan jenis data
    data: PropTypes.shape({
        // Struktur data disesuaikan dengan "type"
        namaBencana: PropTypes.string,
        lokasi: PropTypes.string,
        tanggal: PropTypes.string,
        keparahan: PropTypes.string,
        jumlahKorban: PropTypes.number,
        namaDonatur: PropTypes.string,
        jumlahDonasi: PropTypes.number,
        tanggalDonasi: PropTypes.string,
        metodePembayaran: PropTypes.string,
        pesan: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default Baris;
