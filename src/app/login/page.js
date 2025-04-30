"use client";

import { useState } from 'react';
import { loginUser } from '../../utils/api'; // Import the loginUser API function

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the loginUser API function
      console.log(email, password);
      // Uncomment the line below to make the API call
      // const result = await loginUser(email, password);

      // Handle success (e.g., redirect to dashboard or home)
      window.location.href = '/dashboard'; // Redirect to the dashboard page after successful login
    } catch (error) {
      setError(error.message); // Show error message if login fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat bg-[var(--primary)]">
      <div className="flex items-center justify-center px-4 py-16">
        <div className="bg-opacity-90 backdrop-blur-sm border rounded-2xl shadow-lg hover:shadow-xl transition-shadow max-w-xl py-16 px-8 bg-[var(--primary)] border-[var(--secondary-dark)] text-[var(--main-text)] w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--secondary-light)] mb-4 text-center">
            Log In
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 mb-4 border-2 border-[var(--secondary-dark)] rounded-xl text-[var(--other-text)] bg-[var(--glass-bg)] focus:ring-2 focus:ring-[var(--primary-cmpmt)]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 mb-6 border-2 border-[var(--secondary-dark)] rounded-xl text-[var(--other-text)] bg-[var(--glass-bg)] focus:ring-2 focus:ring-[var(--primary-cmpmt)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-[var(--secondary)] text-[var(--main-text)] font-semibold rounded-xl hover:bg-[var(--signup-button-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-cmpmt)] transition duration-200"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <p className="text-center mt-4 text-[var(--sub-text)]">
            Don't have an account?{' '}
            <a href="/signup" className="text-[var(--primary-cmpmt)] hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
