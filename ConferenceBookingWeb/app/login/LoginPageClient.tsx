// app/login/LoginPageClient.tsx — Client Component
//
// Marked "use client" because it uses the Next.js useRouter hook and wraps
// LoginForm which manages controlled-input state internally.
//
// The Server Component page (page.tsx) imports this as its only child, keeping
// the server/client boundary explicit and the server bundle clean.

'use client';
// app/login/LoginPageClient.tsx — Client Component for the /login route.
//
// Calls login() from AuthContext (not authService directly) so that the shared
// auth state held in AuthProvider is updated on successful login. This means
// the persistent Header in the layout immediately reflects the logged-in user
// without requiring a page reload.

import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../src/context/AuthContext';
import LoginForm from '../../src/components/LoginForm';

export default function LoginPageClient() {
  const router = useRouter();
  const { login } = useAuthContext();

  // login() is from useAuth (inside AuthContext). It POSTs credentials,
  // stores the JWT, and updates isLoggedIn + currentUser in the context.
  // LoginForm re-throws on failure so LoginForm can display the error.
  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    router.push('/dashboard');
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onCancel={() => router.push('/')}
    />
  );
}
