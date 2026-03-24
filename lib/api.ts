const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

const defaults: RequestInit = { credentials: 'include' };

export interface User {
  id: string;
  name: string;
  email: string;
  streak?: { currentStreak: number; highestStreak: number };
  progress?: { id: string; lessonId: string; completedAt: string }[];
}

export interface Word {
  id: string;
  original: string;
  translation: string;
}

export interface Story {
  id: string;
  content: string;
  audioUrl: string;
  words: Word[];
}

export interface Lesson {
  id: string;
  title: string;
  level: string | null;
  themeWords: string[];
  createdAt: string;
  story: Story | null;
  cardStats?: { total: number; learned: number };
}

export interface Streak {
  currentStreak: number;
  highestStreak: number;
}

// ── Auth ────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<{ user: User }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    ...defaults,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('E-mail ou senha incorretos');
  return res.json();
}

export async function register(
  name: string,
  email: string,
  password: string,
  profile?: { occupation?: string; objective?: string; techLevel?: string },
): Promise<{ user: User }> {
  const res = await fetch(`${API_URL}/auth/register`, {
    ...defaults,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, ...profile }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Erro ao criar conta');
  }
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, { ...defaults, method: 'POST' });
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, { ...defaults, cache: 'no-store' });
  if (!res.ok) throw new Error('Não autenticado');
  return res.json();
}

// ── Lessons ─────────────────────────────────────────────

export async function generateStory(
  level: string,
  provider: 'gemini' | 'ollama',
  options: { themeWords?: string[]; vocabularyWords?: string[] },
): Promise<string> {
  const res = await fetch(`${API_URL}/story/generate`, {
    ...defaults,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, provider, ...options }),
  });
  if (!res.ok) throw new Error('Erro ao gerar história');
  const data = await res.json();
  return data.content as string;
}

export async function deleteLesson(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/lessons/${id}`, { ...defaults, method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao remover lição');
}

export async function createLesson(data: {
  title: string;
  level: string;
  themeWords: string[];
  storyContent?: string;
  provider?: 'gemini' | 'ollama';
}): Promise<Lesson> {
  const res = await fetch(`${API_URL}/lessons`, {
    ...defaults,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar lição');
  return res.json();
}

export async function getLessons(jwt?: string): Promise<Lesson[]> {
  const res = await fetch(`${API_URL}/lessons`, {
    ...defaults,
    cache: 'no-store',
    headers: jwt ? { Cookie: `jwt=${jwt}` } : {},
  });
  if (!res.ok) throw new Error('Erro ao buscar lições');
  return res.json();
}

export async function getLesson(id: string, jwt?: string): Promise<Lesson> {
  const res = await fetch(`${API_URL}/lessons/${id}`, {
    ...defaults,
    cache: 'no-store',
    headers: jwt ? { Cookie: `jwt=${jwt}` } : {},
  });
  if (!res.ok) throw new Error('Lição não encontrada');
  return res.json();
}

// ── Cards ────────────────────────────────────────────────

export interface Card {
  id: string;
  lessonId: string;
  lessonTitle: string;
  savedAt: string;
  learned: boolean;
  original: string;
  translation: string;
}

export async function saveCard(lessonId: string, vocabularyId: string): Promise<void> {
  const res = await fetch(`${API_URL}/lessons/${lessonId}/cards/${vocabularyId}`, {
    ...defaults,
    method: 'POST',
  });
  if (!res.ok) throw new Error('Erro ao salvar card');
}

export async function getAllCards(jwt?: string): Promise<Card[]> {
  const res = await fetch(`${API_URL}/cards`, {
    ...defaults,
    cache: 'no-store',
    headers: jwt ? { Cookie: `jwt=${jwt}` } : {},
  });
  if (!res.ok) throw new Error('Erro ao buscar cards');
  return res.json();
}

export async function getCards(lessonId: string, jwt?: string): Promise<Card[]> {
  const res = await fetch(`${API_URL}/lessons/${lessonId}/cards`, {
    ...defaults,
    cache: 'no-store',
    headers: jwt ? { Cookie: `jwt=${jwt}` } : {},
  });
  if (!res.ok) throw new Error('Erro ao buscar cards');
  return res.json();
}

export async function markCardLearned(lessonId: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/lessons/${lessonId}/cards/${id}/learned`, {
    ...defaults,
    method: 'POST',
  });
  if (!res.ok) throw new Error('Erro ao marcar card');
}

export async function unmarkCardLearned(lessonId: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/lessons/${lessonId}/cards/${id}/unlearned`, {
    ...defaults,
    method: 'POST',
  });
  if (!res.ok) throw new Error('Erro ao desmarcar card');
}

export async function deleteCard(lessonId: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/lessons/${lessonId}/cards/${id}`, {
    ...defaults,
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao remover card');
}

// ── Vocabulary ───────────────────────────────────────────

export interface VocabularyEntry {
  vocabularyId: string;
  original: string;
  translation: string;
  learned: number;
  total: number;
  lessons: { id: string; title: string }[];
}

export async function getVocabulary(jwt?: string): Promise<VocabularyEntry[]> {
  const res = await fetch(`${API_URL}/vocabulary`, {
    ...defaults,
    cache: 'no-store',
    headers: jwt ? { Cookie: `jwt=${jwt}` } : {},
  });
  if (!res.ok) throw new Error('Erro ao buscar vocabulário');
  return res.json();
}

export async function deleteVocabularyWord(vocabularyId: string): Promise<void> {
  const res = await fetch(`${API_URL}/vocabulary/${vocabularyId}`, {
    ...defaults,
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao remover palavra');
}

export async function saveManualVocabulary(original: string, translation: string, lessonId?: string): Promise<void> {
  const res = await fetch(`${API_URL}/cards/manual`, {
    ...defaults,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ original, translation, lessonId }),
  });
  if (!res.ok) throw new Error('Erro ao salvar palavra');
}

export async function markCardLearnedGlobal(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/cards/${id}/learned`, {
    ...defaults,
    method: 'POST',
  });
  if (!res.ok) throw new Error('Erro ao marcar card');
}

export async function unmarkCardLearnedGlobal(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/cards/${id}/unlearned`, {
    ...defaults,
    method: 'POST',
  });
  if (!res.ok) throw new Error('Erro ao desmarcar card');
}

// ── Profile ──────────────────────────────────────────────

export async function getGeminiKeyStatus(): Promise<{ hasKey: boolean }> {
  const res = await fetch(`${API_URL}/profile/gemini-key/status`, { ...defaults, cache: 'no-store' });
  if (!res.ok) throw new Error('Erro ao verificar chave');
  return res.json();
}

export async function saveGeminiKey(key: string): Promise<void> {
  const res = await fetch(`${API_URL}/profile/gemini-key`, {
    ...defaults,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });
  if (!res.ok) throw new Error('Erro ao salvar chave');
}

export async function deleteGeminiKey(): Promise<void> {
  const res = await fetch(`${API_URL}/profile/gemini-key`, { ...defaults, method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao remover chave');
}

// ── Users ────────────────────────────────────────────────

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/${id}`, { ...defaults, cache: 'no-store' });
  if (!res.ok) throw new Error('Usuário não encontrado');
  return res.json();
}

export async function completeLesson(userId: string, lessonId: string): Promise<Streak> {
  const res = await fetch(`${API_URL}/users/${userId}/complete-lesson`, {
    ...defaults,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lessonId }),
  });
  if (!res.ok) throw new Error('Erro ao completar lição');
  return res.json();
}
