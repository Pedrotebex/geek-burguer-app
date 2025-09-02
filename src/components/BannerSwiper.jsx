import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Card de Produto para o Swiper com o novo efeito de escala
const FeaturedProductSwiperCard = ({ product }) => {
    const swiperSlide = useSwiperSlide();

    return (
        // O card agora usa 'scale' para o efeito de destaque e mantém a opacidade
        <div className={`relative w-full h-full rounded-2xl overflow-hidden text-white group bg-surface transition-all duration-500 ${swiperSlide.isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}`}>
            <img 
                src={`http://localhost:5000${product.imageUrl}`} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent"></div>
            
            <div className={`absolute top-0 left-0 p-6 transition-opacity duration-700 ${swiperSlide.isActive ? 'opacity-100 delay-[800ms]' : 'opacity-0'}`}>
                <h3 className="text-3xl font-bold">{product.name}</h3>
                <p className="text-2xl font-semibold text-accent mt-1">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
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
                console.error("Erro no BannerSwiper:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedProducts();
    }, []);

    if (loading) {
        return <div className=" h-[60vh] flex justify-center items-center"><p className="text-text-secondary">A carregar destaques...</p></div>;
    }

    if (error || products.length === 0) {
        return null;
    }

    return (
        // Adicionamos um container relativo para posicionar a div flutuante
        <div className="relative pt-10">            
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={8}
                slidesPerView={1.2}
                loop={true}
                centeredSlides={true}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                // Aponta a paginação para o nosso elemento customizado
                pagination={{ 
                    el: '.swiper-pagination-custom',
                    clickable: true 
                }}
                className="h-[70vh]"
                breakpoints={{
                    1024: {
                      slidesPerView: 2.5,
                      spaceBetween: 30
                    },
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