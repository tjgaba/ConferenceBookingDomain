'use client';
// Header.jsx — Persistent app shell header, rendered by app/AppShell.tsx.
//
// Auth state is consumed from AuthContext instead of props. This allows the
// Header to live in the root layout independently of any page-level component,
// so it never unmounts or re-renders during route transitions.
//
// 'use client': uses useRouter (Next.js navigation hook) and useAuthContext
// (React context hook). Both are browser-only operations.

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';
import UserInfo from './UserInfo';
import CreateUserButton from './CreateUserButton';
import ConnectionStatus from './ConnectionStatus';
import './Header.css';

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, currentUser, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header>
      <div className="header-left">
        <h1>Conference Booking Dashboard</h1>
        <p>Manage conference room bookings and availability</p>
        <ConnectionStatus />
      </div>

      <div className="header-right">
        <nav>
          <Link href="/" className={pathname === '/' ? 'nav-active' : ''}>Home</Link>
          <Link href="/dashboard/bookings" className={pathname.startsWith('/dashboard/bookings') ? 'nav-active' : ''}>Bookings</Link>
          <Link href="/dashboard/rooms" className={pathname.startsWith('/dashboard/rooms') ? 'nav-active' : ''}>Rooms</Link>
        </nav>

        <div className="header-actions">
          {isLoggedIn && (
            <>
              <UserInfo user={currentUser} />
              <CreateUserButton />
            </>
          )}

          <div className="header-auth">
            {isLoggedIn ? (
              <button className="btn-header btn-logout" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="btn-header btn-login" onClick={() => router.push('/login')}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
