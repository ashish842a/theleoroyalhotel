# The Leo Royal Hotel 🏨

**The Leo Royal Hotel** is a comprehensive full-stack web application designed for managing a luxury hotel and spa. It features a modern, responsive user interface for guests to browse and book rooms, banquet halls, and dining options, alongside a powerful admin dashboard for hotel management.

![The Leo Royal Hotel](client/public/logo.png)

## 🚀 Tech Stack

This project uses a modern **Next.js + Node.js** stack:

*   **Frontend**: [Next.js 15](https://nextjs.org/) (React), Tailwind CSS, Framer Motion.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB.
*   **Authentication**: JWT (JSON Web Tokens).

## ✨ Features

### User Facing (Client)
*   **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.
*   **Room Booking**: Browse luxury rooms with detailed amenities and book stays.
*   **Banquet Halls**: View and inquire about event spaces.
*   **Restaurant Menu**: Explore the dining menu.
*   **User Accounts**: Sign up, login, and manage bookings (My Account).
*   **Dark Mode**: Seamless theme toggling.

### Admin Dashboard
*   **Overview**: Real-time statistics (Bookings, Revenue, Occupancy).
*   **Manage Bookings**: View, approve, or cancel user bookings.
*   **Manage Rooms/Halls**: CRUD operations (Create, Read, Update, Delete) for hotel assets.
*   **Manage Menu**: Update restaurant food items.
*   **Responsive Tables**: Optimized card views for mobile management.

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URL)
*   Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ashish842a/theleoroyalhotel.git
    cd theleoroyalhotel
    ```

2.  **Install Client Dependencies**
    ```bash
    cd client
    npm install
    ```

3.  **Install Server Dependencies**
    ```bash
    cd ../server
    npm install
    ```

### Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add other necessary variables (EMAIL_USER, EMAIL_PASS, etc.)
```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    cd server
    npm start
    # or for development
    npm run dev
    ```

2.  **Start the Frontend Client**
    ```bash
    cd client
    npm run dev
    ```

The client will run on `http://localhost:3000` and the server on `http://localhost:5000`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
