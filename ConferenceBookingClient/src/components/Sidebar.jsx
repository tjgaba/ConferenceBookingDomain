'use client';
// Sidebar.jsx — Persistent navigation sidebar, part of the app shell.
//
// 'use client': uses usePathname from next/navigation to highlight the
// currently active route. usePathname is a Next.js hook that reads the
// router — a browser-only operation.
//
// Rendered by app/AppShell.tsx so it persists across all page transitions
// without unmounting or re-rendering.

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './Sidebar.css';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/bookings', label: 'Bookings', icon: '📅' },
  { href: '/dashboard/rooms', label: 'Rooms', icon: '🏢' },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <nav aria-label="Main navigation">
        <ul className="sidebar-nav">
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <li
              key={href}
              className={pathname === href ? 'sidebar-item active' : 'sidebar-item'}
            >
              <Link href={href} className="sidebar-link">
                <span className="sidebar-icon" aria-hidden="true">{icon}</span>
                <span className="sidebar-label">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
