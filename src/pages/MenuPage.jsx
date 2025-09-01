import React, { useState, useEffect } from 'react';
import CategorySection from '../components/CategorySection';
import CategoryNavigationMenu from '../components/CategoryNavigationMenu';
import BannerSwiper from '../components/BannerSwiper';

export default function MenuPage() {
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

const categoryOrder = ['Combos', 'Lanche', 'Porções', 'Bebidas', 'Drinks', 'Sobremesas'];
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) throw new Error('Não foi possível carregar os produtos.');
                const products = await response.json();

                const grouped = products.reduce((acc, product) => {
                    const category = product.category;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(product);
                    return acc;
                }, {});

                setGroupedProducts(grouped);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <p className="text-center mt-8 text-text-primary">A carregar cardápio...</p>;
    if (error) return <p className="text-center text-white">{error}</p>;

    const availableCategories = categoryOrder.filter(cat => groupedProducts[cat] && groupedProducts[cat].length > 0);

    return (
        // Fundo aplicado a toda a página
        <div className="bg-background text-text-primary min-h-screen">
            <CategoryNavigationMenu categories={availableCategories} />
            
            <BannerSwiper />

            {/* Container principal para o conteúdo do cardápio */}
            <main className="container mx-auto p-8">
                {availableCategories.length > 0 ? (
                    availableCategories.map(category => (
                        <CategorySection 
                            key={category}
                            title={category}
                            products={groupedProducts[category]}
                        />
                    ))
                ) : (
                    <p className="text-center text-text-secondary">Nenhum produto encontrado no cardápio.</p>
                )}
            </main>
        </div>
    );
}
