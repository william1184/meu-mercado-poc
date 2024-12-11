"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConsultaCompra() {
  const [produtos, setProdutos] = useState([]);
  const [data, setData] = useState('');
  const [apelido, setApelido] = useState(''); // Estado para o apelido
  const [total, setTotal] = useState(0);
  const { id } = useParams();
  const router = useRouter();

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

  const handleBack = () => {
    router.push('/compras'); // Redireciona para a página /compras
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Consulta de Compra</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium">Apelido</label>
        <p className="w-full p-2 border rounded bg-gray-200">{apelido}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Data</label>
        <p className="w-full p-2 border rounded bg-gray-200">{data}</p>
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
              <td className="border border-gray-300 p-2">{produto.nome}</td>
              <td className="border border-gray-300 p-2">{produto.codigo}</td>
              <td className="border border-gray-300 p-2">{produto.quantidade}</td>
              <td className="border border-gray-300 p-2">R$ {produto.preco_unitario.toFixed(2)}</td>
              <td className="border border-gray-300 p-2">R$ {produto.preco_total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p className="text-lg font-bold">
          <strong>Total da Compra:</strong> R$ {total.toFixed(2)}
        </p>
      </div>
      <div className="mt-4">
        <button
          onClick={handleBack}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}