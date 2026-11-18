import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Database,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import { NavSection, Notificacion, Usuario } from '../types';

interface TopNavProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: Usuario;
  notificaciones: Notificacion[];
  onMarkAllRead: () => void;
  onOpenGlobalSearch: () => void;
  onOpenArchitecture: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: NavSection; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'inventario', label: 'Inventario' },
  { id: 'categorias', label: 'Categorías' },
  { id: 'proveedores', label: 'Proveedores' },
  { id: 'movimientos', label: 'Movimientos' },
  { id: 'recetas', label: 'Recetas' },
  { id: 'lotes', label: 'Lotes y vencimientos' },
  { id: 'reportes', label: 'Reportes' },
  { id: 'usuarios', label: 'Usuarios' },
];

export const TopNav: React.FC<TopNavProps> = ({
  activeSection,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  currentUser,
  notificaciones,
  onMarkAllRead,
  onOpenGlobalSearch,
  onOpenArchitecture,
  onOpenProfile,
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notificaciones.filter((n) => !n.leida).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#141416]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 no-print">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Burger Logo + GAMA */}
        <button
          onClick={() => onNavigate('inicio')}
          className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946] rounded-lg py-1"
        >
          <span className="w-9 h-9 rounded-xl bg-[#E63946] flex items-center justify-center shadow-sm group-hover:bg-[#d32f3d] transition-colors">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 11h16a2 2 0 0 0 0-4c-1.5-2.5-4.5-4-8-4S5.5 4.5 4 7a2 2 0 0 0 0 4Z" />
              <path d="M3 14h18" />
              <path d="M4 17h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1Z" />
            </svg>
          </span>
          <span className="font-display font-bold text-xl tracking-tight text-[#1D1D1F] dark:text-white whitespace-nowrap">
            GAMA
          </span>
        </button>

        {/* Center: Horizontal Navigation Links (No Sidebar!) */}
        <nav
          aria-label="Navegación principal"
          className="hidden xl:flex items-center gap-1 min-w-0"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-2.5 py-2 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors rounded-md ${
                  isActive
                    ? 'text-[#E63946] dark:text-[#FF6B35] font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-[#1D1D1F] dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-2.5 -bottom-[13px] h-[2px] bg-[#E63946] dark:bg-[#FF6B35] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Global Search, Bell, Theme Switch, Avatar Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Global Search */}
          <button
            onClick={onOpenGlobalSearch}
            title="Buscador global"
            aria-label="Abrir buscador global"
            className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-500 dark:text-neutral-400 hover:text-[#1D1D1F] dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Buscar...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
              Ctrl K
            </kbd>
          </button>

          <button
            onClick={onOpenGlobalSearch}
            aria-label="Buscar"
            className="sm:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              aria-label="Notificaciones"
              className="relative w-9 h-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E63946] text-white text-[10px] font-mono font-semibold flex items-center justify-center tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1D1D1F] dark:text-white">
                    Alertas del inventario ({unreadCount})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-xs font-medium text-[#E63946] hover:underline"
                    >
                      Marcar leídas
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                  {notificaciones.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-500">
                      No hay alertas pendientes en este momento.
                    </div>
                  ) : (
                    notificaciones.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          onNavigate(n.moduloDestino);
                          setNotifOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors flex items-start gap-3 ${
                          !n.leida ? 'bg-[#E63946]/[0.03] dark:bg-[#E63946]/[0.06]' : ''
                        }`}
                      >
                        <span
                          className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                            n.severidad === 'critica'
                              ? 'bg-[#E63946]'
                              : n.severidad === 'advertencia'
                                ? 'bg-[#FFBE0B]'
                                : 'bg-blue-500'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
                            {n.titulo}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 line-clamp-2">
                            {n.mensaje}
                          </div>
                          <div className="text-[11px] font-mono text-neutral-400 mt-1">
                            {n.fecha}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switch */}
          <button
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#FFBE0B]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin Avatar & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/70 transition-colors"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.nombre}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-md object-cover"
                />
              ) : (
                <span className="w-7 h-7 rounded-md bg-[#FF6B35] text-white text-xs font-semibold flex items-center justify-center">
                  {currentUser.nombre
                    .split(' ')
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')}
                </span>
              )}
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white leading-tight whitespace-nowrap">
                  {currentUser.nombre.split(' ')[0]}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight whitespace-nowrap">
                  {currentUser.rol}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1.5 z-50">
                <div className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs font-semibold text-[#1D1D1F] dark:text-white truncate">
                    {currentUser.nombre}
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {currentUser.correo}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onOpenProfile();
                    setProfileOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2.5"
                >
                  <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                  Mi perfil y permisos
                </button>
                <button
                  onClick={() => {
                    onOpenArchitecture();
                    setProfileOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2.5"
                >
                  <Database className="w-3.5 h-3.5 text-neutral-400" />
                  Configuración XAMPP / MySQL
                </button>
                <button
                  onClick={() => {
                    onNavigate('usuarios');
                    setProfileOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2.5"
                >
                  <Settings className="w-3.5 h-3.5 text-neutral-400" />
                  Administrar usuarios
                </button>
                <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-[#E63946] hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

          {/* Mobile / Tablet Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú de navegación"
            className="xl:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile/Tablet Horizontal Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141416] px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E63946] text-white font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
