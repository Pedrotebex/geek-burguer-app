import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoGeekBurguer from '../assets/logo_geek.png';

export default function LoginPage() {
  const [name, setName] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Resposta do servidor não era JSON:", responseText);
        throw new Error('O servidor retornou uma resposta inesperada. Verifique os logs do backend.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Falha no login');
      }
      
      login(data.user, data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple">
      <div className="p-8 flex flex-col gap-4 bg-white rounded-lg shadow-md w-96">
        <img src={logoGeekBurguer} alt="" />

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <label className="flex text-md font-bold">User</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex text-md font-bold">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          {error && <p className="text-light text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-surface cursor-pointer">Entrar</button>
        </form>
      </div>
    </div>
  );
}
