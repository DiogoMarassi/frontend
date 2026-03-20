import { cookies } from 'next/headers';
import { getAllCards } from '../../lib/api';
import Link from 'next/link';
import FlashCardGrid from '../../components/FlashCardGrid';
import MiniTranslator from '../../components/MiniTranslator';

export default async function AllCardsPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  let cards: Awaited<ReturnType<typeof getAllCards>> = [];
  try {
    cards = await getAllCards(jwt);
  } catch {
    // backend offline
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-500 hover:underline text-sm mb-6 inline-block">
        ← Voltar para lições
      </Link>

      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600 mb-0.5">Revisão geral</p>
        <h1 className="text-2xl font-bold text-gray-900">Todos os Cards</h1>
        <p className="mt-1 text-sm text-gray-500">Tente lembrar a tradução antes de virar o card. Depois, explique o significado das palavras em francês. Invente palavras, use a tradução rápida para ajudar... O importante é tentar explicar em voz</p>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🃏</p>
          <p className="font-medium text-gray-500">Nenhum card ainda.</p>
          <p className="text-sm mt-1">Abra uma lição e clique em "Salvar" nas palavras destacadas.</p>
        </div>
      ) : (
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            <FlashCardGrid cards={cards} />
          </div>
          <div className="w-85 flex-shrink-0">
            <MiniTranslator />
          </div>
        </div>
      )}
    </main>
  );
}
