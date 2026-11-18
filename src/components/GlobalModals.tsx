import React, { useState } from 'react';
import {
  CheckCircle2,
  Database,
  Download,
  FolderTree,
  Package,
  Search,
  Shield,
  Truck,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { GAMA_SQL_SCHEMA } from '../data/initialData';
import { Lote, NavSection, Producto, Proveedor, Receta, Usuario } from '../types';
import { downloadTextFile, formatCOP, ROLE_PERMISSIONS } from '../utils/formatters';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  productos: Producto[];
  proveedores: Proveedor[];
  recetas: Receta[];
  lotes: Lote[];
  onNavigate: (section: NavSection) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  open,
  onClose,
  productos,
  proveedores,
  recetas,
  lotes,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const matchedProds = q
    ? productos.filter(
        (p) => p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)
      )
    : productos.slice(0, 4);
  const matchedProvs = q
    ? proveedores.filter(
        (p) => p.nombre.toLowerCase().includes(q) || p.nit.toLowerCase().includes(q)
      )
    : [];
  const matchedRecs = q
    ? recetas.filter((r) => r.nombre.toLowerCase().includes(q))
    : [];
  const matchedLotes = q
    ? lotes.filter((l) => l.numeroLote.toLowerCase().includes(q))
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ingrediente, código SKU, proveedor, receta o número de lote..."
            className="flex-1 bg-transparent text-sm text-[#1D1D1F] dark:text-white focus:outline-none placeholder:text-neutral-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {matchedProds.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-semibold text-neutral-400 mb-1.5">
                Ingredientes e Inventario
              </p>
              <div className="space-y-1">
                {matchedProds.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigate('inventario');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Package className="w-4 h-4 text-[#E63946] shrink-0" />
                      <span className="text-xs font-mono text-neutral-500">{p.codigo}</span>
                      <span className="text-sm font-medium text-[#1D1D1F] dark:text-white truncate">
                        {p.nombre}
                      </span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-neutral-500 ml-3 shrink-0">
                      {p.cantidad} {p.unidad}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedRecs.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-semibold text-neutral-400 mb-1.5">
                Recetas del Menú
              </p>
              <div className="space-y-1">
                {matchedRecs.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onNavigate('recetas');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <UtensilsCrossed className="w-4 h-4 text-[#FF6B35]" />
                      <span className="text-sm font-medium text-[#1D1D1F] dark:text-white">
                        {r.nombre}
                      </span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-neutral-500">
                      {formatCOP(r.precioVentaCOP)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedProvs.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-semibold text-neutral-400 mb-1.5">
                Proveedores
              </p>
              <div className="space-y-1">
                {matchedProvs.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => {
                      onNavigate('proveedores');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-[#FFBE0B]" />
                      <span className="text-sm font-medium text-[#1D1D1F] dark:text-white">
                        {pr.nombre}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-500">{pr.nit}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedLotes.length > 0 && (
            <div>
              <p className="px-2 text-[11px] font-semibold text-neutral-400 mb-1.5">
                Lotes registrados
              </p>
              <div className="space-y-1">
                {matchedLotes.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onNavigate('lotes');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                  >
                    <span className="text-xs font-mono font-medium text-[#1D1D1F] dark:text-white">
                      {l.numeroLote}
                    </span>
                    <span className="text-xs text-neutral-500">Vence: {l.fechaVencimiento}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q &&
            matchedProds.length === 0 &&
            matchedProvs.length === 0 &&
            matchedRecs.length === 0 &&
            matchedLotes.length === 0 && (
              <div className="py-10 text-center text-sm text-neutral-500">
                No se encontraron coincidencias para "{query}".
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export const ProfileModal: React.FC<{
  open: boolean;
  onClose: () => void;
  user: Usuario;
}> = ({ open, onClose, user }) => {
  if (!open) return null;
  const perms = ROLE_PERMISSIONS[user.rol];

  const permList = [
    { label: 'Crear y editar ingredientes', ok: perms.canCreateProduct },
    { label: 'Eliminar registros del inventario', ok: perms.canDeleteProduct },
    { label: 'Administrar proveedores', ok: perms.canManageSuppliers },
    { label: 'Registrar entradas y salidas', ok: perms.canRegisterMovements },
    { label: 'Ejecutar consumo por recetas', ok: perms.canExecuteRecipes },
    { label: 'Exportar reportes PDF / Excel', ok: perms.canExportReports },
    { label: 'Gestionar usuarios y roles', ok: perms.canManageUsers },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-[#1D1D1F] dark:text-white">
            Mi perfil y permisos
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.nombre}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#FF6B35] text-white font-bold text-lg flex items-center justify-center">
                {user.nombre
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-base text-[#1D1D1F] dark:text-white">
                {user.nombre}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {user.correo} · @{user.usuario}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-[#1D1D1F] dark:text-neutral-200">
                <Shield className="w-3 h-3 text-[#E63946]" />
                {user.rol}
              </span>
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
              Permisos activos de tu rol
            </p>
            <div className="space-y-2">
              {permList.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <span className="text-neutral-700 dark:text-neutral-300">{item.label}</span>
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      item.ok
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-neutral-400 dark:text-neutral-600'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.ok ? 'Habilitado' : 'Restringido'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ArchitectureModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  if (!open) return null;

  const folderTree = `C:\\xampp\\htdocs\\gama\\
├── index.php
├── login.php
├── dashboard.php
├── config\\
│   └── database.php          # Conexión PDO MySQL (gama_db)
├── includes\\
│   ├── auth.php              # Sesiones seguras y roles RBAC
│   ├── navbar.php            # Barra de navegación horizontal
│   └── helpers.php           # Validaciones y auditoría
├── assets\\
│   ├── css\\
│   ├── js\\
│   └── img\\
├── modules\\
│   ├── inventario\\
│   ├── categorias\\
│   ├── proveedores\\
│   ├── movimientos\\
│   ├── recetas\\
│   └── reportes\\
└── database\\
    └── gama_db.sql           # 13 tablas InnoDB con FK`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#E63946]" />
            <h3 className="font-display text-lg font-semibold text-[#1D1D1F] dark:text-white">
              Arquitectura XAMPP · PHP 8 & MySQL (gama_db)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Este prototipo interactivo de alta fidelidad opera en memoria del navegador para validar flujos, estados, tablas y formularios antes de conectarlo al backend PHP 8 + PDO sobre Apache y MySQL en XAMPP.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1D1D1F] dark:text-white mb-2">
                <FolderTree className="w-4 h-4 text-[#FF6B35]" />
                Estructura del proyecto XAMPP
              </div>
              <pre className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto leading-relaxed">
                {folderTree}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1D1D1F] dark:text-white mb-2">
                  Tablas incluidas en gama_db.sql (13 entidades)
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                  {[
                    'usuarios',
                    'roles',
                    'productos',
                    'categorias',
                    'proveedores',
                    'movimientos',
                    'detalle_movimientos',
                    'recetas',
                    'detalle_recetas',
                    'lotes',
                    'ubicaciones',
                    'notificaciones',
                    'auditoria',
                  ].map((t) => (
                    <div key={t} className="px-2 py-1 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => downloadTextFile('gama_db.sql', GAMA_SQL_SCHEMA)}
                className="mt-4 w-full py-2.5 px-4 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar script gama_db.sql
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
