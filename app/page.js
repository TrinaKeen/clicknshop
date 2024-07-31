"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ItemList from "./Item-page/components/ItemList";
import { useRouter } from 'next/navigation';

export default function HomePage({ email, setLoggedIn }) {
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedItem, setSelectedItem] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showCartPopup, setShowCartPopup] = useState(false);
    const [cart, setCart] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("https://fakestoreapi.com/products");
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    const filteredItems = selectedCategory === "all"
        ? items
        : items.filter((item) =>
            selectedCategory === "men"
                ? item.category.toLowerCase() === "men's clothing"
                : selectedCategory === "women"
                    ? item.category.toLowerCase() === "women's clothing"
                    : selectedCategory === "jewelry"
                        ? item.category.toLowerCase() === "jewelery"
                        : selectedCategory === "electronics"
                            ? item.category.toLowerCase() === "electronics"
                            : true
        );

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedItem(null);
    };

    const handleAddToCart = () => {
        if (selectedItem && quantity > 0) {
            const updatedCart = [...cart, { ...selectedItem, quantity }];
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            handleClosePopup();
        }
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, Math.min(99, parseInt(e.target.value, 10)));
        setQuantity(value || 1);
    };

    const handleViewCart = () => {
        setShowCartPopup(true);
    };

    const handleCloseCartPopup = () => {
        setShowCartPopup(false);
    };

    const handleDeleteFromCart = (itemToRemove) => {
        const updatedCart = cart.filter(item => item !== itemToRemove);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleCheckout = () => {
        router.push('/checkout'); // Redirect to /checkout/page.js
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <main className="bg-white py-6 text-black">
            <header className="container mx-auto flex justify-between items-center">
                <img src="/logo2.jpg" alt="ClickNShop Logo" className="h-20" />
                <nav>
                    <ul className="flex space-x-8 text-lg">
                        <li className="hover:underline">
                            <Link href="/" onClick={() => handleCategoryClick("all")}>Home</Link>
                        </li>
                        <li className="hover:underline">
                            <Link href="#" onClick={() => handleCategoryClick("men")}>Men</Link>
                        </li>
                        <li className="hover:underline">
                            <Link href="#" onClick={() => handleCategoryClick("women")}>Women</Link>
                        </li>
                        <li className="hover:underline">
                            <Link href="#" onClick={() => handleCategoryClick("jewelry")}>Accessories</Link>
                        </li>
                        <li className="hover:underline">
                            <Link href="#" onClick={() => handleCategoryClick("electronics")}>Electronics</Link>
                        </li>
                        <li className="hover:underline">
                            <Link href="./About-page/">About</Link>
                        </li>
                        <li>
                            <form className="flex items-center">
                                <input
                                    type="text"
                                    className="border border-gray-300 p-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Search..."
                                />
                                <button
                                    type="submit"
                                    className="bg-gray-300 text-white p-1 rounded-r-md hover:bg-blue-700"
                                >
                                    Search
                                </button>
                            </form>
                        </li>
                        <li className="hover:underline">
                            <button
                                className="hover:underline"
                                onClick={handleViewCart}
                            >
                                View Cart ({cart.length})
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>
            <div className="min-h-screen bg-gray-100 p-4">
                <h1 className="text-3xl font-bold text-center mb-8">
                    ClickNShop Items
                </h1>
                <ItemList items={filteredItems} onItemClick={handleItemClick} />
                {showPopup && selectedItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-black">
                            <h2 className="text-2xl font-bold mb-4">{selectedItem.title}</h2>
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.title}
                                style={{ width: '300px', height: '300px', objectFit: 'contain' }}
                                className="mb-4"
                            />
                            <p className="mb-4">{selectedItem.description}</p>
                            <p className="font-bold text-xl mt-auto">${selectedItem.price.toFixed(2)}</p>
                            <div className="flex items-center mb-4">
                                <label htmlFor="quantity" className="mr-2">Quantity:</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="border border-gray-300 p-1 rounded w-16"
                                    min="1"
                                    max="99"
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                    onClick={handleClosePopup}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showCartPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-black">
                            <h2 className="text-2xl font-bold mb-4">Cart</h2>
                            {cart.length === 0 ? (
                                <p className="text-center">Your cart is empty.</p>
                            ) : (
                                <ul>
                                    {cart.map((item, index) => (
                                        <li key={index} className="flex items-center mb-4">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-32 h-32 object-cover mr-4"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold">{item.title}</h3>
                                                <p className="text-gray-700">Quantity: {item.quantity}</p>
                                                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <button
                                                className="bg-red-500 text-white py-1 px-3 rounded"
                                                onClick={() => handleDeleteFromCart(item)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="flex justify-between mt-4 font-bold">
                                <p>Total:</p>
                                <p>${getTotalPrice()}</p>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-green-500 text-white py-2 px-4 rounded"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </button>
                                <button
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                    onClick={handleCloseCartPopup}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
