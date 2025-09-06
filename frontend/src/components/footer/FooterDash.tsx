import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className="w-screen bg-white text-white py-10 px-6 ">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {/* User Section */}
                <div>
                    <h2 className="text-lg text-black font-semibold mb-4 border-b border-slate-600 pb-2">
                        User
                    </h2>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/login"
                                className="text-green-500 hover:text-blue-400 transition-colors duration-200"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/registro"
                                className="text-green-500 hover:text-blue-400 transition-colors duration-200"
                            >
                                Sign Up
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Links Section */}
                <div>
                    <h2 className="text-lg text-black font-semibold mb-4 border-b border-slate-600 pb-2">
                        Links
                    </h2>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/instrucciones"
                                className="text-green-500 hover:text-blue-400 transition-colors duration-200"
                            >
                                Instructions
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/empresas"
                                className="text-green-500 hover:text-blue-400 transition-colors duration-200"
                            >
                                Companies
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/promociones"
                                className="text-green-500 hover:text-blue-400 transition-colors duration-200"
                            >
                                Promotions
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Help Section */}
                <div>
                    <h2 className="text-lg text-black font-semibold mb-4 border-b border-slate-600 pb-2">
                        Help
                    </h2>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/faq"
                                className="text-green-500 hover:text-blue-400 transition-colors duration-200"
                            >
                                FAQ
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/privacy-policy"
                                className="text-green-500 hover:text-blue-400 transition-colors duration-200"
                            >
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/terms-services"
                                className="text-green-500 hover:text-blue-400 transition-colors duration-200"
                            >
                                Terms of Service
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center mt-10 text-sm text-slate-500 border-t border-slate-600 pt-4">
                © {new Date().getFullYear()} Carbon Fighters. All rights reserved.
            </div>
        </footer>
    );
}
