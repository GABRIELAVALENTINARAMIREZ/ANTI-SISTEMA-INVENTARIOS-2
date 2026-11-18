import React, { useState } from 'react';
import {
  CheckCircle2,
  History,
  Plus,
  Power,
  Shield,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';
import { RegistroAuditoria, RolUsuario, Usuario } from '../types';
import { ROLE_PERMISSIONS } from '../utils/formatters';

interface UsersViewProps {
  usuarios: Usuario[];
  auditoria: RegistroAuditoria[];
  currentUser: Usuario;
  canManageUsers: boolean;
  onAddUsuario: (user: Omit<Usuario, 'id' | 'ultimoAcceso'>) => boolean;
  onUpdateRol: (id: string, rol: RolUsuario) => void;
  onToggleUsuarioEstado: (id: string) => void;
  onSwitchSession: (user: Usuario) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
  usuarios,
  auditoria,
  currentUser,
  canManageUsers,
  onAddUsuario,
  onUpdateRol,
  onToggleUsuarioEstado,
  onSwitchSession,
}) => {
  const [tab, setTab] = useState<'usuarios' | 'permisos' | 'auditoria'>('usuarios');
  const [modalOpen, setModalOpen] = useState(false);

  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState<RolUsuario>('Empleado');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !usuario.trim() || !correo.trim()) return;
    const ok = onAddUsuario({
      nombre: nombre.trim(),
      usuario: usuario.trim().toLowerCase(),
      correo: correo.trim().toLowerCase(),
      rol,
      estado: 'Activo',
    });
    if (ok) {
      setModalOpen(false);
      setNombre('');
      setUsuario('');
      setCorreo('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1D1D1F] dark:text-white">
            Usuarios, roles y auditoría
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Administra accesos por rol (Administrador, Encargado de inventario y Empleado) y consulta la bitácora del sistema.
          </p>
        </div>

        {canManageUsers && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            Registrar usuario
          </button>
        )}
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1 p-1 w-fit rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setTab('usuarios')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === 'usuarios'
              ? 'bg-white dark:bg-[#1E1E22] text-[#1D1D1F] dark:text-white shadow-xs'
              : 'text-neutral-500'
          }`}
        >
          Cuentas de usuario ({usuarios.length})
        </button>
        <button
          onClick={() => setTab('permisos')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === 'permisos'
              ? 'bg-white dark:bg-[#1E1E22] text-[#1D1D1F] dark:text-white shadow-xs'
              : 'text-neutral-500'
          }`}
        >
          Matriz de permisos
        </button>
        <button
          onClick={() => setTab('auditoria')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
            tab === 'auditoria'
              ? 'bg-white dark:bg-[#1E1E22] text-[#1D1D1F] dark:text-white shadow-xs'
              : 'text-neutral-500'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Auditoría ({auditoria.length})
        </button>
      </div>

      {tab === 'usuarios' && (
        <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50/70 dark:bg-neutral-900/40">
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Correo</th>
                  <th className="py-3 px-4">Rol asignado</th>
                  <th className="py-3 px-4">Último acceso</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-xs">
                {usuarios.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/35 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.nombre}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white font-semibold flex items-center justify-center text-xs">
                              {u.nombre
                                .split(' ')
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join('')}
                            </span>
                          )}
                          <div>
                            <div className="font-semibold text-[#1D1D1F] dark:text-white">
                              {u.nombre}{' '}
                              {isCurrent && (
                                <span className="text-[11px] font-normal text-[#E63946]">
                                  (Sesión actual)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-neutral-400">
                              @{u.usuario}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">
                        {u.correo}
                      </td>
                      <td className="py-3.5 px-4">
                        {canManageUsers && !isCurrent ? (
                          <select
                            value={u.rol}
                            onChange={(e) => onUpdateRol(u.id, e.target.value as RolUsuario)}
                            className="h-8 px-2.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-medium"
                          >
                            <option value="Administrador">Administrador</option>
                            <option value="Encargado de inventario">
                              Encargado de inventario
                            </option>
                            <option value="Empleado">Empleado</option>
                          </select>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#1D1D1F] dark:text-white">
                            <Shield className="w-3.5 h-3.5 text-[#FF6B35]" />
                            {u.rol}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-500 whitespace-nowrap">
                        {u.ultimoAcceso}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {u.estado === 'Activo' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700">
                            <XCircle className="w-3.5 h-3.5" />
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {u.estado === 'Activo' && !isCurrent && (
                            <button
                              onClick={() => onSwitchSession(u)}
                              title="Probar permisos de este usuario"
                              className="px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 hover:border-[#FF6B35] hover:text-[#FF6B35] text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              <UserCheck className="w-3 h-3" />
                              Usar rol
                            </button>
                          )}
                          {canManageUsers && !isCurrent && (
                            <button
                              onClick={() => onToggleUsuarioEstado(u.id)}
                              title={u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                              className="p-1.5 rounded-md text-neutral-500 hover:text-[#E63946] hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'permisos' && (
        <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 bg-neutral-50/70 dark:bg-neutral-900/40">
                  <th className="py-3 px-4">Capacidad del sistema</th>
                  <th className="py-3 px-4 text-center">Administrador</th>
                  <th className="py-3 px-4 text-center">Encargado de inventario</th>
                  <th className="py-3 px-4 text-center">Empleado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {[
                  { label: 'Crear y editar productos', key: 'canCreateProduct' },
                  { label: 'Eliminar productos del catálogo', key: 'canDeleteProduct' },
                  { label: 'Gestionar proveedores', key: 'canManageSuppliers' },
                  { label: 'Registrar entradas y salidas', key: 'canRegisterMovements' },
                  { label: 'Crear nuevas recetas', key: 'canManageRecipes' },
                  { label: 'Registrar consumo por recetas', key: 'canExecuteRecipes' },
                  { label: 'Gestionar lotes y bajas', key: 'canManageBatches' },
                  { label: 'Exportar reportes PDF / Excel', key: 'canExportReports' },
                  { label: 'Administrar usuarios y roles', key: 'canManageUsers' },
                ].map((row) => (
                  <tr key={row.key}>
                    <td className="py-3 px-4 font-medium text-[#1D1D1F] dark:text-white">
                      {row.label}
                    </td>
                    {(['Administrador', 'Encargado de inventario', 'Empleado'] as RolUsuario[]).map(
                      (r) => {
                        const allowed =
                          ROLE_PERMISSIONS[r][row.key as keyof typeof ROLE_PERMISSIONS['Administrador']];
                        return (
                          <td key={r} className="py-3 px-4 text-center">
                            {allowed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                            ) : (
                              <XCircle className="w-4 h-4 text-neutral-300 dark:text-neutral-700 mx-auto" />
                            )}
                          </td>
                        );
                      }
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'auditoria' && (
        <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 bg-neutral-50/70 dark:bg-neutral-900/40">
                  <th className="py-3 px-4">Fecha y hora</th>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Módulo</th>
                  <th className="py-3 px-4">Acción</th>
                  <th className="py-3 px-4">Detalle registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {auditoria.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 px-4 font-mono tabular-nums text-neutral-500 whitespace-nowrap">
                      {a.fecha}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1D1D1F] dark:text-white whitespace-nowrap">
                      {a.usuario} · <span className="text-neutral-400">{a.rol}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                      {a.modulo}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#FF6B35]">
                      {a.accion}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                      {a.detalle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                Registrar nuevo usuario
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Nombre completo *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Usuario *</label>
                  <input
                    type="text"
                    required
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="ej. lgomez"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Rol</label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value as RolUsuario)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Encargado de inventario">Encargado de inventario</option>
                    <option value="Empleado">Empleado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Correo electrónico *</label>
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="correo@gama.com.co"
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E63946] text-white text-xs font-semibold"
                >
                  Crear cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
