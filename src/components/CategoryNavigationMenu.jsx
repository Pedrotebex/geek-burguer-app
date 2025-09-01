import React, { useState } from 'react';
import logoGeekBurguer from '../assets/logo_geek_white.png';

const iconMap = {
  'Combos': 'fastfood',
  'Lanche': 'lunch_dining',
  'Bebidas': 'local_bar', // Para refrigerantes
  'Drinks': 'wine_bar',   // Para bebidas alcoólicas
  'Porções': 'deck'
};

export default function CategoryNavigationMenu({ categories }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const createCategoryId = (categoryName) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    // Adicionado min-h-[80px] para evitar que o layout salte e overflow-hidden para conter a animação
    <nav className="bg-background/80 backdrop-blur-lg shadow-lg p-4 sticky top-0 z-50 min-h-[80px] overflow-hidden">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logótipo */}
        <img 
          src={logoGeekBurguer} 
          alt="Logótipo Geek Burguer" 
          className='h-12 md:h-16 w-auto'
        />

        {/* Área de Navegação à Direita com altura fixa para alinhar os elementos */}
        <div className="relative h-12 flex items-center">
          
          {/* Botão de Navegar (Menu Hambúrguer) com animação de fade */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex items-center p-3 font-semibold text-text-primary rounded-full hover:bg-surface transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <span className="material-symbols-outlined">menu</span>
            
          </button>

          {/* Categorias e Botão de Fechar com animação de deslizar */}
          <div
            className={`absolute top-0 right-0 flex items-center space-x-2 transition-all duration-500 ease-in-out ${
              isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
            }`}
          >
            {categories.map(category => (
              <a
                key={category}
                href={`#${createCategoryId(category)}`}
                onClick={() => setIsMenuOpen(false)} // Fecha o menu ao clicar
                className="flex items-center p-3 font-semibold text-text-primary rounded-full hover:bg-surface transition-colors duration-300"
              >
                <span className="material-symbols-outlined">{iconMap[category] || 'restaurant'}</span>
                <span className="hidden md:inline ml-2">{category}</span>
              </a>
            ))}
             {/* Botão de Fechar */}

          </div>
        </div>
      </div>
    </nav>
  );
}
