"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaSearch, FaUser, FaDownload } from "react-icons/fa"; // Import react-icons
import SearchBar from "./SearchBar"; // Import the SearchBar component

const Navbar = () => {
  const pathname = usePathname(); // Get the current path
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu visibility
  const [isSearchVisible, setIsSearchVisible] = useState(false); // State for toggling search bar
  const router = useRouter(); // useRouter hook for navigation

  // State for handling the install prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallVisible, setInstallVisible] = useState(false);

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

  // Handle the install button click
  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      deferredPrompt.userChoice
        .then((choiceResult) => {
          console.log(choiceResult.outcome); // "accepted" or "dismissed"
          setInstallVisible(false); // Hide the install button
          setDeferredPrompt(null); // Clear the deferred prompt
        });
    }
  };

  // Listen for the "beforeinstallprompt" event to show the install button
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default mini-info bar from showing
      setDeferredPrompt(e); // Save the event for later use
      setInstallVisible(true); // Show the install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[var(--primary)] bg-opacity-90 backdrop-blur-md">
      {/* Large screens (md and up) - Current navbar layout */}
      <div className="hidden md:flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/images/icons/leaf-icon.png" alt="Chop Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-[var(--Chop-color)]">Chop</h1>
        </div>

        {/* Navigation & Search */}
        <div className="flex flex-col items-center w-full space-y-2">
          <nav className="flex space-x-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-lg font-medium transition ${
                  pathname === href ? 'text-[var(--primary-cmpmt)]' : 'text-[var(--navlink-rest)]'
                } hover:text-[var(--primary-cmpmt)]`}
              >
                {label}
                {pathname === href && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-1 bg-[var(--primary-cmpmt)] rounded-full mt-3"></span>
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

        {/* Install App Button */}
        {isInstallVisible && (
          <button
            onClick={handleInstall}
            className="bg-[var(--primary-cmpmt)] text-[var(--primary)] px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-[var(--signup-button-hover)] transition"
          >
            <FaDownload />
            <span>Install App</span>
          </button>
        )}

        {/* CTA */}
        <div className="flex-shrink-0 relative group flex items-center">
          {/* Sign Up Button */}
          <button className="bg-[var(--primary-cmpmt)] text-[var(--primary)] px-4 py-2 rounded-full hover:bg-[var(--signup-button-hover)] transition">
            Sign Up
          </button>
        </div>
      </div>

      {/* Small screens (sm and below) - Restructured navbar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4">
        {/* Left - Hamburger Menu */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${isMenuOpen ? "text-[var(--secondary)]" : "text-[var(--primary-cmpmt)]"} text-2xl`}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Center - Logo */}
        <div className="flex items-center space-x-3">
          <img src="/images/icons/leaf-icon.png" alt="Chop Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-[var(--Chop-color)]">Chop</h1>
        </div>

        {/* Right - Search Toggle and Sign Up Button */}
        <div className="flex items-center space-x-3">
          {/* Search Toggle Button */}
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className={`text-2xl p-2 rounded-full bg-[var(--primary)] ${isSearchVisible ? "text-[var(--secondary)]" : "text-[var(--primary-cmpmt)]"} hover:text-[var(--secondary)] transition`}
          >
            <FaSearch />
          </button>

          {/* Sign Up Button */}
          <div className="relative group">
            <button className="bg-[var(--primary-cmpmt)] text-[var(--primary)] px-4 py-2 rounded-full hover:bg-[var(--signup-button-hover)] transition">
              <FaUser className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Visible when the hamburger menu is open */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--primary)]">
          <nav className="flex items-center justify-center space-x-6 py-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-lg font-medium transition ${
                  pathname === href ? 'text-[var(--primary-cmpmt)]' : 'text-[var(--navlink-rest)]'
                } hover:text-[var(--primary-cmpmt)]`}
              >
                {label}
                {pathname === href && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[120%] h-1 bg-[var(--primary-cmpmt)] rounded-full mt-3"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Search Bar (Only visible on small screens when toggle is clicked) */}
      {isSearchVisible && (
        <div className="md:hidden px-4 py-2">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            height="py-2"
            inputClasses="bg-white/90 text-teal-900 placeholder-gray-500 w-full"
          />
        </div>
      )}
    </header>
  );
};

export default Navbar;
