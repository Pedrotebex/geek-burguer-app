import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Combos', 'Lanche', 'Bebidas', 'Drinks', 'Porções'];

export default function AddProductPage() {
    const [category, setCategory] = useState(CATEGORIES[0]); 
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!token) {
            setMessage('Erro de autenticação. Por favor, faça login novamente.');
            return;
        }

        const formData = new FormData();
        formData.append('category', category);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'x-auth-token': token },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.msg || 'Falha ao adicionar produto');
            }
            
            setMessage('Produto adicionado com sucesso!');
            
            setTimeout(() => {
                navigate('/admin/dashboard'); 
            }, 2000);

        } catch (err) {
            setMessage(err.message);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-text-primary">Cadastrar Novo Produto</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 rounded-lg shadow-md">
                <div>
                    <label className="block mb-1 font-medium text-text-secondary">Categoria</label>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className="w-full p-2 border border-gray-600 bg-background text-text-primary rounded" 
                        required
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-text-secondary">Nome do Produto</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-600 bg-background text-text-primary rounded" required />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-text-secondary">Descrição</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border border-gray-600 bg-background text-text-primary rounded" rows="3"></textarea>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-text-secondary">Preço</label>
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border border-gray-600 bg-background text-text-primary rounded" required />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-text-secondary">Foto do Produto</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border border-gray-600 bg-background text-text-primary rounded" required />
                </div>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded hover:bg-opacity-80">
                    Cadastrar
                </button>
                {message && <p className="mt-4 text-accent">{message}</p>}
            </form>
        </div>
    );
}