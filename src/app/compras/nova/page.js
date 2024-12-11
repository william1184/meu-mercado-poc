"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NovaCompra() {
  const [produtos, setProdutos] = useState([]);
  const [data, setData] = useState('');
  const [apelido, setApelido] = useState('');
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hoje = new Date().toISOString().split('T')[0];
    setData(hoje);
  }, []);

  const handleAddProduto = () => {
    setProdutos([...produtos, { nome: '', codigo: '', quantidade: 1, unidade: '', preco_unitario: 0, preco_total: 0 }]);
  };

  const handleProdutoChange = (index, field, value) => {
    const updatedProdutos = [...produtos];
    updatedProdutos[index][field] = value;

    if (field === 'quantidade' || field === 'preco_unitario') {
      updatedProdutos[index].preco_total =
        updatedProdutos[index].quantidade * updatedProdutos[index].preco_unitario;
    }

    setProdutos(updatedProdutos);
    setTotal(updatedProdutos.reduce((sum, p) => sum + p.preco_total, 0));
  };

  const handleSave = () => {
    const storedCompras = JSON.parse(localStorage.getItem('compras')) || [];
    const novaCompra = { produtos, data, apelido, total };
    localStorage.setItem('compras', JSON.stringify([...storedCompras, novaCompra]));
    router.push('/compras');
  };

  const handleBack = () => {
    router.push('/compras');
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
      const data = json.data;
      // Atualiza os campos com o JSON retornado
      if (data.produtos) setProdutos(data.produtos);
      if (data.data) setData(data.data);
      if (data.apelido) setApelido(data.apelido);
      if (data.total) setTotal(data.total);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Nova Compra</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Apelido</label>
        <input
          type="text"
          value={apelido}
          onChange={(e) => setApelido(e.target.value)}
          placeholder="Digite um apelido para a compra"
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-4 flex gap-4">
        <button
          onClick={handleAddProduto}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Adicionar Produto
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Carregar de NF
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Nome</th>
            <th className="border border-gray-300 p-2">Código</th>
            <th className="border border-gray-300 p-2">Quantidade</th>
            <th className="border border-gray-300 p-2">Preço Unitário</th>
            <th className="border border-gray-300 p-2">Preço Total</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  placeholder="Nome"
                  value={produto.nome}
                  onChange={(e) => handleProdutoChange(index, 'nome', e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  placeholder="Código"
                  value={produto.codigo}
                  onChange={(e) => handleProdutoChange(index, 'codigo', e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  placeholder="Quantidade"
                  value={produto.quantidade}
                  onChange={(e) => handleProdutoChange(index, 'quantidade', parseFloat(e.target.value))}
                  className="w-full p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  placeholder="Preço Unitário"
                  value={produto.preco_unitario}
                  onChange={(e) => handleProdutoChange(index, 'preco_unitario', parseFloat(e.target.value))}
                  className="w-full p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="border border-gray-300 p-2 text-gray-700">
                R$ {produto.preco_total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p className="text-lg font-bold">Total: R$ {total.toFixed(2)}</p>
      </div>
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Salvar Compra
        </button>
        <button
          onClick={handleBack}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Voltar
        </button>
      </div>

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
                className={`w-full p-2 text-white rounded ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
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