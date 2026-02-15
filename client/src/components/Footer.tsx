import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-black text-white p-10 mt-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <Image
                            src="/logo.png"
                            alt="The Leo Royal Hotel Logo"
                            width={50}
                            height={50}
                            className="object-contain"
                        />
                        <h2 className="text-2xl font-bold">The Leo Royal Hotel</h2>
                    </Link>
                    <p className="text-gray-400">Experience luxury and comfort in the heart of the city.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="/rooms" className="hover:text-white">Rooms</a></li>
                        <li><a href="/halls" className="hover:text-white">Banquet Halls</a></li>
                        <li><a href="/restaurant" className="hover:text-white">Restaurant</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                    <p className="text-gray-400">NH28, Chandni chowk, Damodarapur, Muzaffarpur, Bihar 843113</p>
                    <p className="text-gray-400">Phone: +91 7903994801</p>
                    <p className="text-gray-400">Email: contact@theleoroyal.com</p>
                </div>
            </div>
            <div className="text-center mt-10 text-gray-500">
                &copy; {new Date().getFullYear()} The Leo Royal Hotel. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
