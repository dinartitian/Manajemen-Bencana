import PropTypes from "prop-types";

function ModalProfile({ isOpen, onClose, user }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Profil Pengguna</h2>
                <p className="text-gray-700">
                    <strong>Email:</strong> {user?.email || "Tidak tersedia"}
                </p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

ModalProfile.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Memastikan `isOpen` selalu diberikan
    onClose: PropTypes.func.isRequired, // Memastikan fungsi `onClose` diberikan
    user: PropTypes.shape({
        username: PropTypes.string, // Validasi bahwa `username` adalah string (opsional)
        email: PropTypes.string, // Validasi bahwa `email` adalah string (opsional)
    }), // `user` adalah objek opsional
};

export default ModalProfile;
