export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-md transition-all duration-300">
            <div className="relative flex items-center justify-center">
                {/* Outer spinning ring */}
                <div className="absolute w-24 h-24 border-t-2 border-r-2 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin [animation-duration:2s]"></div>

                {/* Inner reverse spinning ring */}
                <div className="absolute w-16 h-16 border-b-2 border-l-2 border-transparent border-b-yellow-500 dark:border-b-yellow-400 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>

                {/* Center Logo/Icon */}
                <div className="text-3xl font-serif text-gray-900 dark:text-white animate-pulse">
                    L R
                </div>
            </div>

            {/* Branding Text */}
            <h2 className="mt-8 text-xl font-serif font-bold tracking-[0.2em] text-gray-900 dark:text-white uppercase animate-pulse">
                The Leo Royal
            </h2>
            <p className="mt-2 text-sm tracking-[0.3em] text-gray-500 dark:text-gray-400 uppercase">
                Loading...
            </p>
        </div>
    );
}
