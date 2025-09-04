import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Card de produto "arrastável" para a lista de ordenação
const SortableProductCard = ({ product, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product._id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-2 mb-2 bg-background rounded-lg flex items-center justify-between touch-none">
            <div className="flex items-center">
                <div className="w-8 mr-4 text-center text-text-secondary font-bold">{index + 1}</div>
                <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} className="w-12 h-12 rounded object-cover mr-4" />
                <span className="text-text-primary">{product.name}</span>
            </div>
            {/* O 'drag handle' é o ícone, mas pode arrastar o item inteiro */}
            <span className="material-symbols-outlined text-text-secondary cursor-grab">drag_indicator</span>
        </div>
    );
};

// Card de produto para a grelha de seleção
const SelectableProductCard = ({ product, onAdd }) => (
    <div className="relative rounded-xl shadow-lg overflow-hidden h-64 bg-surface group">
        <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onAdd(product)} className="flex items-center bg-primary text-white font-bold px-4 py-2 z-50 rounded-full">
                <span className="material-symbols-outlined">add_circle</span>
                Adicionar
            </button>
        </div>
        <div className="relative h-full flex flex-col justify-end p-4 text-white">
            <h3 className="text-lg font-bold">{product.name}</h3>
        </div>
    </div>
);

export default function FeaturedProductsPage() {
    const [featured, setFeatured] = useState([]);
    const [nonFeatured, setNonFeatured] = useState([]);
    const { token } = useAuth();

    const fetchProducts = async () => {
        const response = await fetch('/api/products');
        const allProducts = await response.json();
        const eligible = allProducts.filter(p => ['Combos', 'Lanche', 'Porções', 'Drinks'].includes(p.category));
        setFeatured(eligible.filter(p => p.isFeatured).sort((a, b) => a.featuredOrder - b.featuredOrder));
        setNonFeatured(eligible.filter(p => !p.isFeatured));
    };

    useEffect(() => { fetchProducts(); }, []);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = featured.findIndex(item => item._id === active.id);
            const newIndex = featured.findIndex(item => item._id === over.id);
            const reordered = arrayMove(featured, oldIndex, newIndex);
            
            setFeatured(reordered); // Atualiza a UI

            // Atualiza o backend
            const orderedIds = reordered.map(p => p._id);
            await fetch('/api/products/featured/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ orderedProducts: orderedIds }),
            });
        }
    };

    const handleAdd = async (product) => {
        await fetch(`/api/products/${product._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ isFeatured: true }),
        });
        fetchProducts(); // Sincroniza o estado
    };

    const handleRemove = async (product) => {
        await fetch(`/api/products/${product._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ isFeatured: false }),
        });
        fetchProducts(); // Sincroniza o estado
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Gerir Produtos em Destaque</h1>
            <p className="text-text-secondary mb-8">Arraste os produtos abaixo para reordenar o carrossel. Adicione novos produtos a partir da grelha inferior.</p>
            
            {/* Secção de Ordenação */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-text-primary mb-4">Ordem dos Destaques</h2>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="p-4 bg-surface rounded-lg min-h-[200px]">
                        <SortableContext items={featured.map(p => p._id)} strategy={verticalListSortingStrategy}>
                            {featured.map((product, index) => (
                                // Adicionamos um botão de remover aqui
                                <div key={product._id} className="flex items-center">
                                    <SortableProductCard product={product} index={index} />
                                    <button onClick={() => handleRemove(product)} className="ml-4 p-2 text-red-500 hover:bg-background rounded-full">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </SortableContext>
                    </div>
                </DndContext>
            </div>

            {/* Secção de Adição */}
            <div>
                <h2 className="text-xl font-bold text-text-primary mb-4">Adicionar Produtos ao Destaque</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {nonFeatured.map(product => (
                        <SelectableProductCard key={product._id} product={product} onAdd={handleAdd} />
                    ))}
                </div>
            </div>
        </div>
    );
}