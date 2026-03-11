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
import { useAuthContext } from '../context/AuthContext';
import './Sidebar.css';

// roles: [] means visible to everyone (including unauthenticated).
// roles: ['...'] means the user must have at least one of those roles.
const ALL_NAV_ITEMS = [
  { href: '/',                          label: 'Home',            icon: '🏠', roles: [] },
  { href: '/dashboard',                 label: 'Dashboard',       icon: '📊', roles: ['Admin', 'FacilityManager', 'Receptionist', 'Employee'] },
  { href: '/dashboard/bookings',        label: 'Bookings',        icon: '📅', roles: ['Admin', 'FacilityManager', 'Receptionist', 'Employee'] },
  { href: '/dashboard/rooms',           label: 'Rooms',           icon: '🏢', roles: ['Admin', 'FacilityManager', 'Receptionist', 'Employee'] },
  { href: '/dashboard/room-management', label: 'Room Management', icon: '⚙️', roles: ['FacilityManager'] },
];

function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useAuthContext();
  const userRoles = (currentUser?.roles ?? []);

  const navItems = ALL_NAV_ITEMS.filter(
    item => item.roles.length === 0 || item.roles.some(r => userRoles.includes(r))
  );

  return (
    <aside className="sidebar">
      <nav aria-label="Main navigation">
        <ul className="sidebar-nav">
          {navItems.map(({ href, label, icon }) => (
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
