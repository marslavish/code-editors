'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Monaco', path: '/monaco' },
  { name: 'CodeMirror', path: '/codemirror' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className='border-b'>
      <nav className='max-w-7xl mx-auto px-4'>
        <ul className='flex gap-4 -mb-px'>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`inline-block px-4 py-3 border-b-2 ${
                  pathname === item.path
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'
                } transition-colors`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
