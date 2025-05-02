"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);

  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleMobileUserMenu = () =>
    setIsMobileUserMenuOpen(!isMobileUserMenuOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      desktopMenuRef.current &&
      !desktopMenuRef.current.contains(event.target as Node)
    ) {
      setIsUserMenuOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node)
    ) {
      setIsMobileUserMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <header className="bg-white shadow-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 text-xl font-semibold text-gray-800">
              Drive Check
            </div>

            <nav className="hidden md:flex space-x-6 text-gray-700">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <Link href="/about" className="hover:text-blue-600">
                About
              </Link>
            </nav>

            <div className="hidden md:block relative" ref={desktopMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="text-gray-700 font-medium focus:outline-none"
              >
                Hello, User
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-20">
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            <Link href="/" className="block text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-blue-600"
            >
              About
            </Link>

            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={toggleMobileUserMenu}
                className="w-full text-left text-gray-700 font-medium focus:outline-none"
              >
                Hello, User
              </button>

              {isMobileUserMenuOpen && (
                <div className="mt-2 w-full bg-white shadow rounded-md py-2">
                  <Link
                    href="/logout"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>
    </div>
  );
}
