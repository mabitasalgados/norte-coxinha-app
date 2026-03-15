import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Home } from '@/pages/Home';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Login } from '@/pages/Login';

import { Admin } from '@/pages/Admin';
import { Kitchen } from '@/pages/Kitchen';
import { Orders } from '@/pages/Orders';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/app" element={<Home />} />
            <Route path="/app/carrinho" element={<Cart />} />
            <Route path="/app/checkout" element={<Checkout />} />
            <Route path="/app/login" element={<Login />} />
            <Route path="/app/pedidos" element={<Orders />} />
            <Route path="/app/admin" element={<Admin />} />
            <Route path="/app/cozinha" element={<Kitchen />} />
            {/* Redirect root to /app to match the requested URL structure */}
            <Route path="/" element={<Navigate to="/app" replace />} />
          </Routes>
        </main>
        
        {/* Floating WhatsApp Button */}
        <a 
          href="https://wa.me/5591999999999" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center"
          aria-label="Falar com a Norte Coxinha"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </a>
      </div>
    </Router>
  );
}
