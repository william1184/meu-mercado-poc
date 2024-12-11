"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [compras, setCompras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCompras = JSON.parse(localStorage.getItem('compras')) || [];
    setCompras(storedCompras);
  }, []);

  const handleDelete = (index) => {
    const updatedCompras = [...compras];
    updatedCompras.splice(index, 1);
    setCompras(updatedCompras);
    localStorage.setItem('compras', JSON.stringify(updatedCompras));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      // Atualiza a lista de compras com os dados retornados

      if (json && json.data) {
        const updatedCompras = [...compras, json.data];
        setCompras(updatedCompras);
        localStorage.setItem('compras', JSON.stringify(updatedCompras));
        return
      }
      throw Error('Contrato invalido')
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Lista de Compras</h1>
      <div className="flex gap-4 mb-4">
        <Link
          href="/compras/nova"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Adicionar Compra
        </Link>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Carregar Nota via Imagem
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Data</th>
            <th className="border border-gray-300 p-2">Apelido</th>
            <th className="border border-gray-300 p-2">Total</th>
            <th className="border border-gray-300 p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{compra.data}</td>
              <td className="border border-gray-300 p-2">{compra.apelido || 'Sem Apelido'}</td>
              <td className="border border-gray-300 p-2">R$ {compra.total.toFixed(2)}</td>
              <td className="border border-gray-300 p-2">
                <div className="flex gap-2">
                  <Link
                    href={`/compras/editar/${index}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/compras/${index}`}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Consultar
                  </Link>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Carregar Nota Fiscal</h2>
            <form onSubmit={handleUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-2 text-white rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
              >
                {loading ? 'Processando...' : 'Enviar'}
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}