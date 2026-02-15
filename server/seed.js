const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const Hall = require('./models/Hall');
const Food = require('./models/Food');

dotenv.config();

const rooms = [
    {
        name: "Deluxe King Suite",
        description: "Experience the ultimate in luxury with our Deluxe King Suite. Featuring a spacious 500 sq ft layout, a plush king-size bed, private balcony with city skyline views, and a marble bathroom with a rain shower.",
        price: 8500,
        capacity: 2,
        amenities: ["Free WiFi", "California King Bed", "4K Smart TV", "Mini Bar", "Room Service", "Ocean View", "AC"],
        images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isAvailable: true
    },
    {
        name: "Executive Business Room",
        description: "Designed for the modern traveler, this room features a large ergonomic workspace, high-speed fiber internet, and a comfortable seating area. Includes complimentary breakfast and lounge access.",
        price: 6200,
        capacity: 2,
        amenities: ["Free WiFi", "Work Desk", "Coffee Maker", "Ironing Facilities", "Lounge Access", "AC", "Safe"],
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isAvailable: true
    },
    {
        name: "Presidential Royal Suite",
        description: "Our finest accommodation, offering 1500 sq ft of pure opulence. Includes a master bedroom, separate living and dining areas, a kitchenette, and a private jacuzzi. Includes 24/7 butler service.",
        price: 25000,
        capacity: 4,
        amenities: ["Private Jacuzzi", "Butler Service", "Living Room", "Kitchenette", "Home Theater System", "Premium Mini Bar", "WiFi", "AC"],
        images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isAvailable: true
    },
    {
        name: "Standard Twin Room",
        description: "Ideal for friends or colleagues, this room offers two comfortable twin beds, modern decor, and all essential amenities for a relaxing stay.",
        price: 4500,
        capacity: 2,
        amenities: ["Twin Beds", "WiFi", "TV", "Tea/Coffee Maker", "AC"],
        images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isAvailable: true
    }
];

const halls = [
    {
        name: "Grand Ballroom",
        description: "Our magnificent Grand Ballroom is the perfect venue for weddings, galas, and large corporate events. Features crystal chandeliers, high ceilings, and a customizable stage.",
        price: 150000,
        capacity: 500,
        amenities: ["Stage", "Projector", "Sound System", "Lighting Rig", "Banquet Seating", "Catering Kitchen"],
        images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isAvailable: true
    },
    {
        name: "Sapphire Conference Hall",
        description: "A professional setting for board meetings and seminars. Equipped with state-of-the-art video conferencing technology and comfortable executive seating.",
        price: 45000,
        capacity: 50,
        amenities: ["Video Conferencing", "Whiteboard", "High-Speed WiFi", "Projector", "Coffee Station"],
        images: ["https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isAvailable: true
    },
    {
        name: "Garden Pavilion",
        description: "An open-air venue surrounded by lush gardens, perfect for evening cocktails, receptions, and intimate ceremonies.",
        price: 80000,
        capacity: 200,
        amenities: ["Outdoor Seating", "Ambient Lighting", "Bar Setup", "Live Music Space"],
        images: ["https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isAvailable: true
    }
];

const foods = [
    {
        name: "Grilled Atlantic Salmon",
        description: "Fresh Atlantic salmon fillet grilled to perfection, served with lemon butter sauce, roasted baby potatoes, and seasonal steamed vegetables.",
        price: 1200,
        category: "Main Course",
        images: ["https://images.unsplash.com/photo-1519708227418-81988761e531?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isSpecial: true,
        isAvailable: true
    },
    {
        name: "Truffle Mushroom Risotto",
        description: "Creamy arborio rice cooked with wild mushrooms, finished with parmesan cheese and a drizzle of aromatic black truffle oil.",
        price: 950,
        category: "Main Course",
        images: ["https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isSpecial: false,
        isAvailable: true
    },
    {
        name: "Classic Caesar Salad",
        description: "Crisp romaine lettuce tossed in house-made Caesar dressing, topped with parmesan shavings, garlic croutons, and grilled chicken breast.",
        price: 550,
        category: "Starter",
        images: ["https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isSpecial: false,
        isAvailable: true
    },
    {
        name: "Molten Chocolate Lava Cake",
        description: "Rich dark chocolate cake with a warm, gooey center. Served with a scoop of Madagascar vanilla bean ice cream and fresh berries.",
        price: 450,
        category: "Dessert",
        images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isSpecial: true,
        isAvailable: true
    },
    {
        name: "Signature Mojito",
        description: "Refreshing blend of white rum, fresh mint, lime juice, sparkling water, and a dash of cane sugar.",
        price: 350,
        category: "Beverage",
        images: ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isSpecial: false,
        isAvailable: true
    },
    {
        name: "Lobster Bisque",
        description: "Smooth and creamy soup made with fresh lobster, aromatics, and a touch of brandy. Served with crusty bread.",
        price: 750,
        category: "Starter",
        images: ["https://images.unsplash.com/photo-1547592166-23acbe346499?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isSpecial: true,
        isAvailable: true
    },
    {
        name: "Filet Mignon",
        description: "Tender beef tenderloin steak cooked to your preference, served with red wine reduction and garlic mashed potatoes.",
        price: 1800,
        category: "Main Course",
        images: ["https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"],
        isSpecial: true,
        isAvailable: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for Seeding");

        // Clear existing data
        await Room.deleteMany({});
        await Hall.deleteMany({});
        await Food.deleteMany({});
        console.log("Cleared existing data");

        // Insert new data
        await Room.insertMany(rooms);
        console.log("Rooms seeded");

        await Hall.insertMany(halls);
        console.log("Halls seeded");

        await Food.insertMany(foods);
        console.log("Foods seeded");

        console.log("Database successfully seeded!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();
