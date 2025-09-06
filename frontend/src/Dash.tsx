import Header from "./components/headers/HeaderDash";
import Footer from "./components/footer/FooterDash";

export default function Dash() {
return (
    <div className="w-screen h-screen flex flex-col">
    <Header />

    <main className="flex-grow bg-green-500">
        <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-green-100 mb-6">
            Welcome to CarbonFighter!
            </h1>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
            Join the fight against climate change and 
            reduce your carbon footprint.
            </p>
        </div>
        </div>
    </main>

    <Footer />
    </div>
);
}
