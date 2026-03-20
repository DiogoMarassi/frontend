import { cookies } from 'next/headers';
import { getVocabulary } from '../../lib/api';
import Link from 'next/link';
import VocabularyTable from '../../components/VocabularyTable';

export default async function VocabularyPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  let entries: Awaited<ReturnType<typeof getVocabulary>> = [];
  try {
    entries = await getVocabulary(jwt);
  } catch {
    // backend offline
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-500 hover:underline text-sm mb-6 inline-block">
        ← Voltar para lições
      </Link>

      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600 mb-0.5">Suas palavras</p>
        <h1 className="text-2xl font-bold text-gray-900">Meu Vocabulário</h1>
        <p className="mt-1 text-sm text-gray-500">{entries.length} {entries.length === 1 ? 'palavra salva' : 'palavras salvas'}</p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📖</p>
          <p className="font-medium text-gray-500">Nenhuma palavra ainda.</p>
          <p className="text-sm mt-1">Abra uma lição e clique nas palavras destacadas para salvá-las.</p>
        </div>
      ) : (
        <VocabularyTable entries={entries} />
      )}
    </main>
  );
}
