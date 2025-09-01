import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CardDashboard from '../components/CardDashboard';

// O mapa de ícones para as categorias
const iconMap = {
  'Todos': 'apps',
  'Combos': 'fastfood',
  'Lanche': 'lunch_dining',
  'Bebidas': 'local_bar',
  'Drinks': 'wine_bar',
  'Porções': 'deck'
};

const CATEGORIES = ['Todos', 'Combos', 'Lanche', 'Bebidas', 'Drinks', 'Porções'];

export default function DashboardPage() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [isFilterVisible, setIsFilterVisible] = useState(false); // Começa fechado para mobile
    const { token } = useAuth();

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Falha ao carregar produtos');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm('Tem a certeza que quer apagar este produto?')) {
            try {
                await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token },
                });
                fetchProducts();
            } catch (error) {
                console.error('Falha ao apagar produto:', error);
            }
        }
    };

    const filteredProducts = selectedCategory === 'Todos'
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <div className="relative min-h-screen">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Gestão de Cardápio</h1>
                
                {/* Filtros para Desktop (visível a partir de 1024px) */}
                <div className="hidden lg:flex items-center space-x-2 bg-surface p-1 rounded-full">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                                selectedCategory === category 
                                ? 'bg-primary text-white' 
                                : 'text-text-secondary hover:bg-background'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Botão de Filtro para Mobile (escondido a partir de 1024px) */}
                <button 
                    onClick={() => setIsFilterVisible(!isFilterVisible)} 
                    className="lg:hidden p-2  text-text-white z-40"
                    title={isFilterVisible ? "Fechar Filtros" : "Abrir Filtros"}
                >
                    <span className="material-symbols-outlined">
                        {isFilterVisible ? 'close' : 'tune'}
                    </span>
                </button>
            </div>

            {/* Painel de Filtros Flutuante para Mobile */}
            <aside 
                className={`
                    lg:hidden fixed top-0 right-0 h-full z-30 pt-24
                    transition-transform duration-300 ease-in-out
                    ${isFilterVisible ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="p-4 bg-surface rounded-l-2xl shadow-lg h-auto flex flex-col items-center space-y-4">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            title={category}
                            className={`flex items-center justify-center w-14 h-14 rounded-full transition-colors duration-300 ${
                                selectedCategory === category
                                ? 'bg-primary text-white'
                                : 'text-text-secondary bg-background hover:bg-primary/50'
                            }`}
                        >
                             <span className="material-symbols-outlined">{iconMap[category] || 'restaurant'}</span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Grelha de Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24 lg:pb-0">
                {filteredProducts.map(product => (
                    <CardDashboard 
                        key={product._id} 
                        product={product} 
                        onDelete={handleDelete} 
                    />
                ))}
            </div>
        </div>
    );
}