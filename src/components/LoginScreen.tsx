import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Moon, ShieldCheck, Sun } from 'lucide-react';
import { ASSETS } from '../data/initialData';
import { RolUsuario, Usuario } from '../types';

interface LoginScreenProps {
  usuarios: Usuario[];
  onLogin: (user: Usuario) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  usuarios,
  onLogin,
  darkMode,
  onToggleDarkMode,
}) => {
  const [identifier, setIdentifier] = useState('camila.mendoza@gama.com.co');
  const [password, setPassword] = useState('gama2026*');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const normalized = identifier.trim().toLowerCase();
    if (!normalized || !password.trim()) {
      setError('Ingresa tu usuario o correo electrónico y tu contraseña.');
      return;
    }

    const found = usuarios.find(
      (u) =>
        u.correo.toLowerCase() === normalized || u.usuario.toLowerCase() === normalized
    );

    if (!found) {
      setError('No encontramos una cuenta activa con esas credenciales.');
      return;
    }
    if (found.estado === 'Inactivo') {
      setError('Esta cuenta se encuentra desactivada. Contacta al administrador.');
      return;
    }

    onLogin(found);
  };

  const quickSelectRole = (rol: RolUsuario) => {
    const match = usuarios.find((u) => u.rol === rol && u.estado === 'Activo');
    if (match) {
      setIdentifier(match.correo);
      setPassword('gama2026*');
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0E0E10] flex flex-col lg:flex-row items-stretch">
      {/* Left Visual Column: Fast-food editorial photography */}
      <div className="relative lg:w-1/2 min-h-[280px] lg:min-h-screen overflow-hidden bg-[#1D1D1F]">
        <img
          src={ASSETS.loginHero}
          alt="Hamburguesa doble con queso cheddar, papas fritas crujientes y gaseosa fría"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover lg:absolute lg:inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

        <div className="relative lg:absolute lg:inset-0 p-8 sm:p-12 flex flex-col justify-between h-full text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-[#E63946] flex items-center justify-center shadow-md">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 11h16a2 2 0 0 0 0-4c-1.5-2.5-4.5-4-8-4S5.5 4.5 4 7a2 2 0 0 0 0 4Z" />
                  <path d="M3 14h18" />
                  <path d="M4 17h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1Z" />
                </svg>
              </span>
              <span className="font-display font-bold text-2xl tracking-tight">GAMA</span>
            </div>
          </div>

          <div className="max-w-lg mt-12 lg:mt-0">
            <p className="text-xs font-medium text-[#FFBE0B] mb-2">
              FastStock · Control Administrativo de Cocina
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-balance">
              Precisión en cada ingrediente, desde la cava hasta la plancha.
            </h1>
            <p className="text-sm text-neutral-200 mt-3 leading-relaxed">
              Administra existencias, recetas estandarizadas, proveedores, lotes y mermas para tu restaurante de comidas rápidas en tiempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 bg-white dark:bg-[#141416]">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1D1D1F] dark:text-white">
                Iniciar sesión
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Ingresa con tu usuario o correo institucional
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label="Cambiar tema"
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#FFBE0B]" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs font-medium text-[#E63946] dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-identifier"
                className="block text-xs font-semibold text-[#1D1D1F] dark:text-neutral-200 mb-1.5"
              >
                Usuario o correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ej. cmendoza o correo@gama.com.co"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-[#1D1D1F] dark:text-neutral-200 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-11 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Mostrar u ocultar contraseña"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              Iniciar sesión
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Role quick-select for testing RBAC permissions */}
          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
              Acceso rápido por rol (demostración de permisos)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['Administrador', 'Encargado de inventario', 'Empleado'] as RolUsuario[]).map(
                (rol) => (
                  <button
                    key={rol}
                    type="button"
                    onClick={() => quickSelectRole(rol)}
                    className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-[#FF6B35] dark:hover:border-[#FF6B35] bg-neutral-50 dark:bg-neutral-900 text-left transition-colors"
                  >
                    <div className="text-xs font-semibold text-[#1D1D1F] dark:text-white truncate">
                      {rol === 'Encargado de inventario' ? 'Encargado' : rol}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {rol === 'Administrador'
                        ? 'Control total'
                        : rol === 'Encargado de inventario'
                          ? 'Stock y compras'
                          : 'Cocina y salidas'}
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
