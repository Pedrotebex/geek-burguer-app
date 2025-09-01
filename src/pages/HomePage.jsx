import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Geek Burguer</h1>
            <div className="space-x-4">
                <Link to="/login" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Login
                </Link>
                <Link to="/register" className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    Registrar
                </Link>
                 <Link to="/dashboard" className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                    Dashboard
                </Link>
            </div>
        </div>
    );
}
