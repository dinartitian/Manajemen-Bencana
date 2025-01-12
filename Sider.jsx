import { FaTachometerAlt, FaUser, FaHandHoldingUsd } from "react-icons/fa"; // Importing icons

function Sider() {
    return (
        <aside className="w-64 bg-blue-900 text-white flex flex-col min-h-screen shadow-lg">
            {/* Fixed header at the top */}
            <div className="flex-shrink-0 p-6 bg-blue-800">
                <h1 className="text-2xl font-extrabold text-white">Menu Utama</h1>
            </div>
            
            {/* Scrollable navigation */}
            <nav className="flex-1 mt-6 px-2 space-y-2 overflow-y-auto">
                <ul>
                    {/* Dashboard Link */}
                    <li className="group">
                        <a 
                            href="/dashboard" 
                            className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            <FaTachometerAlt className="mr-3 text-xl" /> {/* Icon for Dashboard */}
                            <span className="text-lg font-medium">Dashboard</span>
                        </a>
                    </li>

                    {/* Bencana Link */}
                    <li className="group">
                        <a 
                            href="/admin/bencana" 
                            className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            <FaUser className="mr-3 text-xl" /> {/* Icon for Bencana */}
                            <span className="text-lg font-medium">Bencana</span>
                        </a>
                    </li>

                    {/* Donasi Link */}
                    <li className="group">
                        <a 
                            href="/admin/donasi" 
                            className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            <FaHandHoldingUsd className="mr-3 text-xl" /> {/* Icon for Donasi */}
                            <span className="text-lg font-medium">Donasi</span>
                        </a>
                    </li>

                    {/* Additional Links (if any) */}
                    {/* You can add more list items here if needed */}
                </ul>
            </nav>
        </aside>
    );
}

export default Sider;
