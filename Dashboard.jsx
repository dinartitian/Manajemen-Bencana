import Sider from "../layouts/Sider.jsx";
import Header from "../layouts/Header.jsx";
import Footer from "../layouts/Footer.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
    const [totalBencana, setTotalBencana] = useState(0);
    const [totalKorban, setTotalKorban] = useState(0);
    const [lokasiTerkena, setLokasiTerkena] = useState(0);
    const [totalDonasi, setTotalDonasi] = useState(0);

    // Fetch data bencana dan donasi
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch disasters
                const responseDisasters = await axios.get("http://localhost:3001/disasters");

                // Hitung statistik bencana
                setTotalBencana(responseDisasters.data.length);
                const totalKorban = responseDisasters.data.reduce((acc, curr) => acc + curr.jumlahKorban, 0);
                setTotalKorban(totalKorban);
                setLokasiTerkena(new Set(responseDisasters.data.map(item => item.lokasi)).size);

                // Fetch donations
                const responseDonations = await axios.get("http://localhost:3001/donations");

                // Hitung total donasi
                const totalDonasi = responseDonations.data.reduce((acc, curr) => acc + curr.jumlahDonasi, 0);
                setTotalDonasi(totalDonasi);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sider className="bg-blue-900" />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <Header className="bg-blue-800 text-white shadow-md z-10" />

                    <main className="flex-1 p-6 bg-gray-100">
                        {/* Dashboard Heading */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
                            <p className="text-gray-500">
                                Selamat datang di Dashboard! Berikut adalah ringkasan data bencana dan donasi terkini.
                            </p>
                        </div>

                        {/* Content Section (Widgets) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            <div className="bg-blue-700 p-4 rounded-lg shadow-md hover:bg-blue-600 hover:bg-opacity-90 transition duration-300 ease-in-out">
                                <h2 className="text-lg font-medium text-white">Total Bencana</h2>
                                <p className="text-3xl font-bold text-white">{totalBencana}</p>
                            </div>
                            <div className="bg-green-600 p-4 rounded-lg shadow-md hover:bg-green-500 hover:bg-opacity-90 transition duration-300 ease-in-out">
                                <h2 className="text-lg font-medium text-white">Total Korban</h2>
                                <p className="text-3xl font-bold text-white">{totalKorban}</p>
                            </div>
                            <div className="bg-yellow-500 p-4 rounded-lg shadow-md hover:bg-yellow-400 hover:bg-opacity-90 transition duration-300 ease-in-out">
                                <h2 className="text-lg font-medium text-white">Lokasi Terkena</h2>
                                <p className="text-3xl font-bold text-white">{lokasiTerkena}</p>
                            </div>
                            <div className="bg-blue-600 p-4 rounded-lg shadow-md hover:bg-blue-500 hover:bg-opacity-90 transition duration-300 ease-in-out">
                                <h2 className="text-lg font-medium text-white">Total Donasi</h2>
                                <p className="text-3xl font-bold text-white">Rp {totalDonasi.toLocaleString()}</p>
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <Footer className="bg-blue-900 text-white shadow-md p-4" />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
