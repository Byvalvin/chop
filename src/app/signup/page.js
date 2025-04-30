"use client";

import { useState } from 'react';
import { signUpUser } from '../../utils/api'; // Import the signUpUser API function

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the signUpUser API function
      console.log(email, password, username);
      // Uncomment the line below to make the API call
      // const result = await signUpUser(email, password, username);

      // Handle success (e.g., redirect to login or show a success message)
      window.location.href = '/login'; // Redirect to login page after successful signup
    } catch (error) {
      setError(error.message); // Show error message if signup fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat bg-[var(--primary)]">
      <div className="flex items-center justify-center px-4 py-16">
        <div className="bg-opacity-90 backdrop-blur-sm border rounded-2xl shadow-lg hover:shadow-xl transition-shadow max-w-xl py-16 px-8 bg-[var(--primary)] border-[var(--secondary-dark)] text-[var(--main-text)] w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--secondary-light)] mb-4 text-center">
            Sign Up
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
              className="w-full p-4 mb-4 border-2 border-[var(--secondary-dark)] rounded-xl text-[var(--other-text)] bg-[var(--glass-bg)] focus:ring-2 focus:ring-[var(--primary-cmpmt)]"
            />
            <input
              type="text"
              placeholder="Username (optional)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 mb-6 border-2 border-[var(--secondary-dark)] rounded-xl text-[var(--other-text)] bg-[var(--glass-bg)] focus:ring-2 focus:ring-[var(--primary-cmpmt)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-[var(--secondary)] text-[var(--main-text)] font-semibold rounded-xl hover:bg-[var(--signup-button-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-cmpmt)] transition duration-200"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          
          <p className="text-center mt-4 text-[var(--sub-text)]">
            Already have an account?{' '}
            <a href="/login" className="text-[var(--primary-cmpmt)] hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
