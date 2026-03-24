'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '../lib/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getMe()
      .then(() => setChecked(true))
      .catch(() => router.replace('/login'));
  }, [router]);

  if (!checked) return null;

  return <>{children}</>;
}
