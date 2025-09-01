import React from 'react';
import { Link } from 'react-router-dom';

export default function CardDashboard({ product, onDelete }) {
  // Constrói o URL completo para a imagem no servidor backend
  const imageUrl = `http://localhost:5000${product.imageUrl}`;

  return (
    // Container principal do card com imagem de fundo
    <div 
      className="relative rounded-xl shadow-lg overflow-hidden h-80 bg-surface group"
    >
      {/* Imagem de Fundo com Fallback */}
      <img
        src={imageUrl} // <-- CORREÇÃO: Usa o URL completo
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/1D1A39/FFFFFF?text=Imagem+Indisponivel'; }}
      />

      {/* Overlay gradiente para garantir a legibilidade do texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      {/* Overlay de Ações (aparece no hover) */}
      <div className="absolute inset-0 bg-black/60 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center space-x-4 z-50">
          <Link 
            to={`/admin/edit-product/${product._id}`} 
            className="flex items-center bg-accent text-background font-bold px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">edit</span>
            Editar
          </Link>
          <button 
            onClick={() => onDelete(product._id)} 
            className="flex items-center bg-red-600 text-white font-bold px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">delete</span>
            Apagar
          </button>
        </div>
      </div>

      {/* Container do conteúdo, visível por defeito */}
      <div className="relative h-full flex flex-col justify-end p-6 text-white transition-opacity duration-300 group-hover:opacity-0">
        <span className='py-1 px-3 bg-primary text-white text-xs font-semibold rounded-full w-fit mb-2'>
          {product.category}
        </span>
        <h3 className="text-2xl font-bold">{product.name}</h3>
        <p className="text-xl font-semibold text-accent mt-1">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </div>
  );
}
