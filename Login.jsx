import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Untuk navigasi setelah login

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate(); // Untuk redirect setelah login

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!formData.email || !formData.password) {
            setError('Email and password are required!');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://demo-api.syaifur.io/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (response.ok && data.data && data.data.user) {
                const { token, user } = data.data;
                localStorage.setItem('authToken', token);
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        username: user.username || 'Tidak tersedia',
                        email: user.email || 'Tidak tersedia',
                    })
                );
                setSuccess('Login successful!');
                setTimeout(() => navigate('/dashboard'), 1000);
            } else {
                setError(data.message || 'Login failed! Please check your email and password.');
            }
        } catch {
            setError('An error occurred during login! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 px-4 text-white font-semibold rounded-md ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">Dont have an account? </span>
                    <a href="/register" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Register here
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
