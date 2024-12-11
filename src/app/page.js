
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-no-repeat bg-cover" style={{ backgroundImage: "url('/hero-image.jpg')" }}>
      <article className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">Meu Mercado</h1>
        <p className="text-lg mb-6 text-center">Gerencie suas compras com facilidade. Crie listas, e preencha usando fotos da nota.</p>
        <Link href="/compras" className="bg-blue-500 text-center hover:bg-blue-600 text-white px-6 py-3 rounded text-lg transition block w-full">
          Começar Agora
        </Link>
        
      </article>
    </main>
  );
}