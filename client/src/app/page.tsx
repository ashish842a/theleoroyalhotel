import Link from 'next/link';
import Image from 'next/image';
import { FaWifi, FaSwimmingPool, FaCocktail, FaConciergeBell, FaSpa, FaParking } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="w-full bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 transform scale-105 animate-slow-zoom">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Hero Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
          <span className="text-blue-400 font-medium tracking-[0.3em] uppercase mb-4 md:mb-6 animate-fadeIn text-sm md:text-base">Welcome to</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 md:mb-8 leading-tight tracking-tight animate-slideUp">
            The Leo Royal
          </h1>
          <p className="text-base md:text-2xl text-gray-200 mb-8 md:mb-12 font-light max-w-xl md:max-w-2xl mx-auto leading-relaxed animate-fadeIn delay-200">
            Experience the epitome of luxury where timeless elegance meets modern comfort in the heart of the city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-fadeIn delay-300 w-full sm:w-auto px-6">
            <Link href="/rooms" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-black px-8 md:px-10 py-3 md:py-4 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-2xl">
                Book Your Stay
              </button>
            </Link>
            <Link href="/halls" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-transparent border border-white text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all transform hover:-translate-y-1">
                Plan an Event
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <span className="text-blue-600 font-bold text-xs tracking-widest uppercase block mb-4">Discover Luxury</span>
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-white mb-6 md:mb-8">A Sanctuary of Serenity</h2>
        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-light">
          Nestled in a breathtaking location, The Leo Royal offers a unique blend of sophisticated
          design and warm hospitality. Every corner is crafted to provide an unforgettable experience, whether
          you are here for business or leisure.
        </p>
      </section>

      {/* Amenities Grid */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-serif text-gray-900 dark:text-white mb-4">World-Class Amenities</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
            {[
              { icon: FaWifi, label: "High-Speed Wifi" },
              { icon: FaSwimmingPool, label: "Infinity Pool" },
              { icon: FaCocktail, label: "Lounge Bar" },
              { icon: FaConciergeBell, label: "24/7 Service" },
              { icon: FaSpa, label: "Luxury Spa" },
              { icon: FaParking, label: "Valet Parking" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group cursor-default">
                <item.icon className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors mb-4" />
                <span className="text-xs md:text-sm font-medium text-center text-gray-600 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences (Grid Layout) */}
      <section className="py-16 md:py-24 px-4 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Large Item */}
            <div className="relative h-[400px] md:h-[600px] group overflow-hidden rounded-2xl">
              <Image
                src="/images/pic1.jpg"
                alt="Luxury Suite"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl md:text-3xl font-serif mb-2">Presidential Suites</h3>
                <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden md:block">Unmatched comfort with panoramic city views.</p>
                <Link href="/rooms" className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
                  View Rooms <span className="ml-2">&rarr;</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-rows-2 gap-4">
              {/* Top Right */}
              <div className="relative h-[250px] md:h-[290px] group overflow-hidden rounded-2xl">
                <Image
                  src="/images/pic2.jpg"
                  alt="Banquet Hall"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-xl md:text-2xl font-serif mb-2">Grand Events</h3>
                  <Link href="/halls" className="text-xs font-bold uppercase tracking-widest hover:underline">Explore Halls</Link>
                </div>
              </div>

              {/* Bottom Right */}
              <div className="relative h-[250px] md:h-[290px] group overflow-hidden rounded-2xl">
                <Image
                  src="/images/pic4.jpg"
                  alt="Dining"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h3 className="text-xl md:text-2xl font-serif mb-2">Exquisite Dining</h3>
                  <Link href="/restaurant" className="text-xs font-bold uppercase tracking-widest hover:underline">View Menu</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">Ready for an Unforgettable Stay?</h2>
          <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
            Book directly through our website to receive exclusive benefits, including complimentary breakfast and wifi.
          </p>
          <Link href="/rooms">
            <button className="bg-blue-600 text-white px-10 md:px-12 py-4 md:py-5 rounded-full text-sm md:text-base font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Check Availability
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
