export default function SignUpSideBar() {
    return (
        <div className="hidden lg:flex w-1/2 min-h-screen items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 p-12">
            <div className="text-center text-white max-w-xl">
                <div className="mx-auto mb-8 h-24 w-24">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                    </svg>
                </div>
                <h1 className="text-5xl font-bold mb-6 leading-tight">Start Your Journey</h1>
                <p className="text-lg mb-8 opacity-90 leading-relaxed">
                    Join our community of environmental champions and make a real impact on climate change.
                </p>
                <div className="grid gap-4 text-left max-w-sm mx-auto">
                    {["Monitor environmental impact", "Join global initiatives", "Create lasting change"].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <svg className="h-6 w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}