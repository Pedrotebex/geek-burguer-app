import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import MediaLibraryModal from '../components/MediaLibraryModal';

const CATEGORIES = ['Combos', 'Lanche', 'Bebidas', 'Drinks', 'Porções'];

export default function EditProductPage() {
    const [productData, setProductData] = useState({ name: '', description: '', category: CATEGORIES[0], price: '', imageUrl: '' });
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    headers: { 'x-auth-token': token },
                });
                if (!response.ok) {
                    if (response.status === 400 || response.status === 401) {
                        logout();
                        navigate('/login');
                    }
                    throw new Error('Falha ao carregar os dados do produto.');
                }
                const data = await response.json();
                setProductData(data);
            } catch (error) {
                setMessage(error.message);
            }
        };
        if (token) fetchProduct();
    }, [id, token, navigate, logout]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectImage = (imageUrl) => {
        setProductData(prev => ({ ...prev, imageUrl }));
        setIsMediaOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(productData),
            });
            if (!response.ok) throw new Error('Falha ao atualizar o produto');
            setMessage('Produto atualizado com sucesso!');
            setTimeout(() => navigate('/admin/dashboard'), 2000);
        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <>
            <div>
                <h2 className="text-3xl font-bold mb-6 text-text-primary">Editar Produto</h2>
                <div className="w-full">
                    <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 rounded-lg shadow-md">
                        <div>
                            <label className="flex mb-2 font-medium text-text-secondary">Foto do Produto</label>
                            <div onClick={() => setIsMediaOpen(true)} className="cursor-pointer max-h-[300px] group aspect-video bg-background rounded-lg flex items-center justify-center relative overflow-hidden">
                                {productData.imageUrl ? (
                                    <img src={`http://localhost:5000${productData.imageUrl}`} alt="Pré-visualização" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-text-secondary">Selecionar Imagem</span>
                                )}
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="material-symbols-outlined text-white text-4xl">photo_library</span>
                                    <span className="text-white mt-2">Abrir Biblioteca</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block mb-1 font-medium text-text-secondary">Categoria</label>
                            <select name="category" value={productData.category} onChange={handleChange} className="w-full p-2 border border-gray-600 bg-background text-text-primary rounded" required>
                                {CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-text-secondary">Nome do Produto</label>
                            <input type="text" name="name" value={productData.name} onChange={handleChange} className="w-full p-2 border border-gray-600 bg-background text-text-primary rounded" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-text-secondary">Descrição</label>
                            <textarea name="description" value={productData.description || ''} onChange={handleChange} className="w-full p-2 border border-gray-600 bg-background text-text-primary rounded" rows="3"></textarea>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-text-secondary">Preço</label>
                            <input type="number" name="price" step="0.01" value={productData.price} onChange={handleChange} className="w-full p-2 border border-gray-600 bg-background text-text-primary rounded" required />
                        </div>
                        
                        <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-bold rounded">Atualizar Produto</button>
                        {message && <p className="mt-4 text-accent text-center">{message}</p>}
                    </form>
                </div>
            </div>

            {isMediaOpen && <MediaLibraryModal onClose={() => setIsMediaOpen(false)} onSelectImage={handleSelectImage} />}
        </>
    );
}
