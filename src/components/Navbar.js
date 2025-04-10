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
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between p-4 w-full">
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <img src="/images/leaf-icon.png" alt="Chop Logo" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-teal-600">Chop</h1>
        </div>

        {/* Center: Navigation Links and Search Bar */}
        <div className="flex flex-col items-center justify-center space-y-4 flex-grow-2 w-full">
          <nav className="flex space-x-6 text-gray-700">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-lg font-medium ${
                  pathname === href ? 'text-teal-600' : 'text-gray-700'
                } hover:text-teal-600`}
              >
                {label}
                {/* Underline for active link */}
                {pathname === href && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-1 bg-teal-600 rounded-full mt-3"></span>
                )}
              </Link>
            ))}
          </nav>
          {/* Pass smaller height to the search bar for Navbar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            height="py-2" // Adjust search bar size for Navbar
          />
        </div>

        {/* Right: Sign Up Button */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <button className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-500 transition">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
