import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const IMAGES_PER_PAGE = 11;

// Componente Lightbox
const Lightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] p-4">
        <img src={`http://localhost:5000${imageUrl}`} alt="Visualização ampliada" className="max-w-full max-h-full object-contain" />
        <button onClick={onClose} className="absolute top-8 right-8 text-white hover:text-gray-300">
          <span className="material-symbols-outlined text-4xl">close</span>
        </button>
      </div>
    </div>
  );
};

export default function MediaPage() {
  const [media, setMedia] = useState([]);
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const { token } = useAuth();

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/media', { headers: { 'x-auth-token': token } });
      if (!response.ok) throw new Error('Falha ao carregar as mídias.');
      const data = await response.json();
      setMedia(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMedia();
  }, [token]);

  // Função de upload agora aceita uma lista de ficheiros (FileList)
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    if (files.length > 10) {
      setError('Você só pode carregar no máximo 10 imagens por vez.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      setError('');
      setIsUploading(true);
      await fetch('/api/media', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      await fetchMedia();
    } catch (err) {
      setError('Falha no upload das imagens.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = (e) => uploadFiles(e.target.files);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  const handleDelete = async (mediaId) => {
    if (window.confirm('Tem a certeza que quer apagar esta imagem permanentemente?')) {
      try {
        setError('');
        const response = await fetch(`/api/media/${mediaId}`, {
          method: 'DELETE',
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) throw new Error('Falha ao apagar a imagem.');
        await fetchMedia();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-6 text-text-primary">Biblioteca de Mídias</h1>
        <div className="bg-surface p-6 rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-text-secondary">A carregar...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <label 
                  className={`cursor-pointer group aspect-square bg-background rounded-lg flex flex-col items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-300 border-2 border-dashed ${isDragging ? 'border-primary' : 'border-gray-700'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <span className="text-sm">A carregar...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                      <span className="mt-2 text-sm text-center px-1">{isDragging ? 'Solte para carregar' : 'Adicionar ou Arrastar'}</span>
                    </>
                  )}
                  <input type="file" multiple onChange={handleUpload} className="hidden" disabled={isUploading} />
                </label>
                {media.slice(0, visibleCount).map(item => (
                  <div key={item._id} className="relative group aspect-square rounded-lg overflow-hidden">
                    <img src={`http://localhost:5000${item.imageUrl}`} alt={item.filename} className="w-full h-full object-cover cursor-pointer" onClick={() => setSelectedImage(item.imageUrl)} />
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              {visibleCount < media.length && (
                <div className="text-center mt-8">
                  <button onClick={() => setVisibleCount(prev => prev + IMAGES_PER_PAGE)} className="bg-primary text-white font-bold px-6 py-2 rounded-full hover:bg-opacity-80">
                    Ver mais
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {selectedImage && <Lightbox imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  );
}