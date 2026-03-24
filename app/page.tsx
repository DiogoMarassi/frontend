import AuthGuard from '../components/AuthGuard';
import LessonsPage from '../components/LessonsPage';

export default function Home() {
  return (
    <AuthGuard>
      <LessonsPage />
    </AuthGuard>
  );
}
