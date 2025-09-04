import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Card de Produto para o Swiper com o layout da sua referência
const FeaturedProductSwiperCard = ({ product }) => {
    const swiperSlide = useSwiperSlide();
    
    const createCategoryId = (categoryName) => {
        return categoryName.toLowerCase().replace(/\s+/g, '-');
    };

    const iconMap = {
        'Combos': 'fastfood',
        'Lanche': 'lunch_dining',
        'Bebidas': 'local_bar',
        'Drinks': 'wine_bar',
        'Porções': 'deck'
    };

    return (
        <div className={`relative w-full h-full rounded-2xl overflow-hidden text-white group bg-surface transition-all duration-500 ${swiperSlide.isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}`}>
            <img 
                src={`http://localhost:5000${product.imageUrl}`} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300"
            />
            {/* O conteúdo só é visível no slide ativo */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-800 ${swiperSlide.isActive ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-3xl font-bold">{product.name}</h3>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center text-text-secondary">
                            <span className="material-symbols-outlined text-lg mr-2">{iconMap[product.category] || 'restaurant'}</span>
                            <span className="text-md">{product.category}</span>
                        </div>
                        <a href={`#${createCategoryId(product.category)}`} className="px-4 py-2 border border-white/50 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors">
                            Ver Detalhes
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function BannerSwiper() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await fetch('/api/products/featured');
                if (!response.ok) {
                    throw new Error('Não foi possível carregar os destaques.');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedProducts();
    }, []);

    const isLoopingEnabled = products.length > 3; // Ajustado para ser mais seguro com slidesPerView

    if (loading) {
        return <div className="container mx-auto my-12 h-[60vh] flex justify-center items-center"><p className="text-text-secondary">A carregar destaques...</p></div>;
    }

    if (error || products.length === 0) {
        return null;
    }

    return (
        <div className="my-12">
            <h2 className="text-6xl font-bold text-text-primary mb-6 text-center">Destaques</h2>
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1.2}
                loop={isLoopingEnabled}
                centeredSlides={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="h-[70vh]"
                breakpoints={{
                    768: { slidesPerView: 2.5, spaceBetween: 30 },
                }}
            >
                {products.map(product => (
                    <SwiperSlide key={product._id}>
                        <FeaturedProductSwiperCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
