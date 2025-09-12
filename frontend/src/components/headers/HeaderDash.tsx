import { Link } from "react-router";
import carbonFightersLogo from '../../assets/carbonfighters.png';


export default function Header() {
  return (
    <header className="w-screen flex items-center justify-between px-6 py-4 bg-white shadow-lg">
      {/* Logo and name */}
      <div className="flex items-center gap-3">

        <img src={carbonFightersLogo} alt="Carbon Fighters Logo" height={40} width={40} />

        <h1 className="text-2xl font-bold text-green-700">Carbon Fighters</h1>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex gap-6 font-medium">
        <Link
          to="/"
          className="text-gray-700 hover:text-green-600 transition duration-200"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-green-600 transition duration-200"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-gray-700 hover:text-green-600 transition duration-200"
        >
          Contact
        </Link>
      </nav>

      {/* Buttons */}
      <div className="flex gap-3">
        <Link
          to="/login"
          className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition duration-200 font-medium"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium shadow-md"
        >
          Sign Up
        </Link>
      </div>

      {/* Hamburger menu */}
      <div className="md:hidden">
        <button className="text-gray-700 hover:text-green-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}