import React from 'react';
import CardProduct from './CardProduct';

export default function CategorySection({ title, products }) {
  if (!products || products.length === 0) {
    return null;
  }

  // Cria um ID amigável para a URL
  const sectionId = title.toLowerCase().replace(/\s+/g, '-');

  return (
    // Adiciona o 'id' à tag da secção
    <section id={sectionId} className="mb-12 scroll-mt-24">
      <h2 className="text-3xl font-bold text-white pb-2 mb-6">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <CardProduct key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
