"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditarCompra() {
  const [produtos, setProdutos] = useState([]);
  const [data, setData] = useState('');
  const [apelido, setApelido] = useState(''); // Estado para o apelido
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const storedCompras = JSON.parse(localStorage.getItem('compras')) || [];
      const compra = storedCompras[id];
      if (compra) {
        setProdutos(compra.produtos);
        setData(compra.data);
        setApelido(compra.apelido || ''); // Carrega o apelido, se existir
        setTotal(compra.total);
      }
    }
  }, [id]);

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
    const updatedCompra = { produtos, data, apelido, total }; // Inclui o apelido na compra
    storedCompras[id] = updatedCompra;
    localStorage.setItem('compras', JSON.stringify(storedCompras));
    router.push('/compras');
  };

  const handleBack = () => {
    router.push('/compras'); // Redireciona para a página /compras
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Editar Compra</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium">Apelido</label>
        <input
          type="text"
          value={apelido}
          onChange={(e) => setApelido(e.target.value)}
          placeholder="Digite um apelido para a compra"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <button onClick={handleAddProduto} className="bg-green-500 text-white px-4 py-2 rounded">
          Adicionar Produto
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
        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
          Salvar Alterações
        </button>
        <button onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded">
          Voltar
        </button>
      </div>
    </div>
  );
}