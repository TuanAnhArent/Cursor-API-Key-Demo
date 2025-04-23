import Link from 'next/link';
import { Home, Code2, Lightbulb, User, FileText, ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (sidebar && menuButton && 
          !sidebar.contains(event.target as Node) && 
          !menuButton.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        id="menu-button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1a1f2e] text-white md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`fixed md:static w-[280px] min-h-screen bg-[#1a1f2e] border-r border-gray-800 p-4 flex flex-col transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-4 py-6">
          <Link href="/" className="block">
            <Image 
              src="/tunkunn_logo.svg" 
              alt="Tunkunn" 
              width={120} 
              height={40}
              className="mb-8 cursor-pointer"
            />
          </Link>
        </div>

        {/* Personal Section */}
        <div className="mb-6">
          <button className="w-full flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white rounded-lg">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">
              T
            </div>
            <span>Personal</span>
            <ChevronDown size={16} className="ml-auto" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <Link 
            href="/dashboards" 
            className="flex items-center gap-3 px-4 py-3 text-white rounded-lg bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            <Home size={20} />
            <span>Overview</span>
          </Link>

          <Link 
            href="/playground" 
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg mt-1"
            onClick={() => setIsOpen(false)}
          >
            <Code2 size={20} />
            <span>API Playground</span>
          </Link>

          <Link 
            href="/use-cases" 
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg mt-1"
            onClick={() => setIsOpen(false)}
          >
            <Lightbulb size={20} />
            <span>Use Cases</span>
          </Link>

          <div className="mt-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg">
              <User size={20} />
              <span>My Account</span>
              <ChevronDown size={16} className="ml-auto" />
            </button>
          </div>

          <Link 
            href="/documentation" 
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg mt-1"
            onClick={() => setIsOpen(false)}
          >
            <FileText size={20} />
            <span>Documentation</span>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-4 h-4 ml-auto"
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path d="M7 17L17 7M17 7H8M17 7V16" />
            </svg>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="mt-auto pt-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
              T
            </div>
            <div className="text-left">
              <div className="text-sm text-white">Tuan Anh Hoang</div>
              <div className="text-xs text-gray-500">View profile</div>
            </div>
            <ChevronDown size={16} className="ml-auto" />
          </button>
        </div>
      </div>
    </>
  );
} 