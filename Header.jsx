import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user")) || { email: "Not Available", username: "Not Available" };

    const handleLogout = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            Swal.fire({
                title: "Error!",
                text: "No token found. Please login again.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            const response = await fetch("http://demo-api.syaifur.io/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                Swal.fire({
                    title: "Logged Out",
                    text: "You have been logged out successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user");
                    navigate("/");
                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Logout failed!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error("Logout error:", error); // Log error untuk debugging
            Swal.fire({
                title: "Oops!",
                text: "An error occurred during logout.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const confirmLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out from your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, logout!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout();
            }
        });
    };

    return (
        <header className="bg-blue-900 p-5">
            <div className="flex justify-between items-center">
                <h1 className="text-white text-lg font-bold">Manajemen Data Bencana Gunung Merapi</h1>

                <div className="relative">
                    {/* Profil Button */}
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center focus:outline-none hover:bg-blue-600"
                    >
                        {user.username ? user.username[0].toUpperCase() : "U"}
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                            <div className="px-4 py-2 border-b">
                                <p className="text-sm font-medium text-gray-700">Email: {user.email}</p>
                            </div>
                            <button
                                onClick={confirmLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:outline-none"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
