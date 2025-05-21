"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const UserPage = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('userEmail');

    if (!storedToken || !storedEmail) {
      router.push('/login'); // If not logged in, redirect
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--primary)] text-[var(--main-text)] px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome!</h1>
      <p className="text-xl mb-4">Logged in as: <span className="font-mono">{email}</span></p>
      <button
        onClick={() => router.push('/new-recipe')}
        className="bg-[var(--secondary)] px-6 py-3 rounded-lg hover:bg-[var(--signup-button-hover)] text-white font-semibold mb-4"
      >
        Create New Recipe
      </button>
      <button
        onClick={handleLogout}
        className="text-red-500 hover:underline text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default UserPage;
