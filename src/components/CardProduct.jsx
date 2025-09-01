import React, { useState, useEffect } from 'react';

// Componente do Modal
const ProductModal = ({ product, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-11/12 max-w-lg h-[600px] bg-surface rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`http://localhost:5000${product.imageUrl}`}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/1D1A39/FFFFFF?text=Imagem+Indisponivel'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
        <button onClick={onClose} className="absolute top-4 right-4  transition-colors z-10">
          <span className="material-symbols-outlined text-3xl text-white hover:text-accent cursor-pointer">close</span>
        </button>
        <div className="relative h-full flex flex-col justify-end p-8 text-white">
          {/* Tag de Categoria com Efeito de Vidro */}
          <div className='py-1 px-4 mb-4 bg-primary/50 backdrop-blur-md w-fit rounded-full overflow-hidden'>
            <span className='text-white text-xs font-semibold'>{product.category}</span>
          </div>
          <h2 className="text-4xl font-black mb-2">{product.name}</h2>
          <p className="text-text-secondary mb-6">
            {product.description || 'Este produto ainda não tem uma descrição detalhada.'}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-4xl font-black text-accent">
              <span className='text-3xl align-baseline mr-1'>R$</span>{product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


// Componente CardProduct
export default function CardProduct({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="relative rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-80 bg-surface cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={`http://localhost:5000${product.imageUrl}`}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/1D1A39/FFFFFF?text=Imagem+Indisponivel'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative h-full flex flex-col p-6 text-white">
          <div>
            {/* Tag de Categoria com Efeito de Vidro */}
            <div className='py-1 px-4 bg-primary/50 backdrop-blur-md w-fit rounded-full overflow-hidden'>
                <span className='text-white text-xs font-semibold'>{product.category}</span>
            </div>
          </div>
          <div className="flex-grow"></div>
          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-3xl font-black text-accent">
              <span className='text-2xl align-baseline mr-1'>R$</span>{product.price.toFixed(2).replace('.', ',')}
            </p>
            <div className="flex items-center text-white font-bold">
              <span className="material-symbols-outlined text-white hover:text-accent cursor-pointer">more_horiz</span>
              
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <ProductModal product={product} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
