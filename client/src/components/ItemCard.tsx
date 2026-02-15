import Link from 'next/link';
import { FaWifi, FaSnowflake, FaParking, FaUtensils } from 'react-icons/fa';

interface ItemProps {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    capacity?: number;
    type: 'room' | 'hall' | 'food';
}

const ItemCard = ({ item }: { item: ItemProps }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="h-64 overflow-hidden">
                <img
                    src={item.images[0] || "https://via.placeholder.com/400x300"}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                        ₹{item.price}
                        {item.type === 'room' ? '/night' : item.type === 'hall' ? '/day' : ''}
                    </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                {item.type !== 'food' && (
                    <div className="flex gap-4 text-gray-500 mb-6">
                        <span className="flex items-center gap-1"><FaWifi /> WiFi</span>
                        <span className="flex items-center gap-1"><FaSnowflake /> AC</span>
                        {item.type === 'hall' && <span className="flex items-center gap-1">Capacity: {item.capacity}</span>}
                    </div>
                )}

                <Link href={`/${item.type}s/${item.id}`}>
                    <span className="block w-full text-center bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors">
                        View Details
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default ItemCard;
