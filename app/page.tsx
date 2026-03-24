import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLessons } from '../lib/api';
import LessonList from '../components/LessonList';

export default async function Home() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  if (!jwt) redirect('/login');

  let lessons: Awaited<ReturnType<typeof getLessons>> = [];
  try {
    lessons = await getLessons(jwt);
  } catch {
    // backend offline ou sem dados ainda
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <LessonList lessons={lessons} />
    </main>
  );
}
