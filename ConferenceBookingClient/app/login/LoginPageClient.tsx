// app/login/LoginPageClient.tsx — Client Component
//
// Marked "use client" because it uses the Next.js useRouter hook and wraps
// LoginForm which manages controlled-input state internally.
//
// The Server Component page (page.tsx) imports this as its only child, keeping
// the server/client boundary explicit and the server bundle clean.

'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '../../src/components/LoginForm';
import { authService } from '../../src/services/authService';

export default function LoginPageClient() {
  const router = useRouter();

  // Passed to LoginForm as the onLogin prop.
  // authService.login stores the JWT in localStorage and re-throws on 401.
  // LoginForm displays the error message — nothing extra needed here.
  const handleLogin = async (username: string, password: string) => {
    await authService.login(username, password);
    router.push('/dashboard');
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onCancel={() => router.push('/')}
    />
  );
}
