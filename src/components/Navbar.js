"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // useRouter for navigation
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar"; // Import the SearchBar component

const Navbar = () => {
  const pathname = usePathname(); // Get the current path
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const router = useRouter(); // useRouter hook for navigation

  // Define the navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/about", label: "About" },
  ];

  // Handle search button click or Enter key press
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the page from reloading
    if (searchTerm.trim()) {
      // Redirect to /results with the searchTerm query parameter
      router.push(`/explore?searchTerm=${searchTerm}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-teal-900 bg-opacity-90 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/images/leaf-icon.png" alt="Chop Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-white">Chop</h1>
        </div>

        {/* Navigation & Search */}
        <div className="flex flex-col items-center w-full space-y-2">
          <nav className="flex space-x-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-lg font-medium transition ${
                  pathname === href ? 'text-yellow-300' : 'text-white/80'
                } hover:text-yellow-300`}
              >
                {label}
                {pathname === href && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-1 bg-yellow-300 rounded-full mt-3"></span>
                )}
              </Link>
            ))}
          </nav>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            height="py-2"
            inputClasses="bg-white/90 text-teal-900 placeholder-gray-500" // optional
          />
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          <button className="bg-yellow-400 text-teal-900 px-4 py-2 rounded-full hover:bg-yellow-300 transition">
            Sign Up
          </button>
        </div>
      </div>
    </header>

  );
};

export default Navbar;
