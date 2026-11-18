import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Power,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { Proveedor } from '../types';

interface SuppliersViewProps {
  proveedores: Proveedor[];
  canManage: boolean;
  onAddProveedor: (prov: Omit<Proveedor, 'id'>) => boolean;
  onUpdateProveedor: (prov: Proveedor) => boolean;
  onToggleEstado: (id: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  proveedores,
  canManage,
  onAddProveedor,
  onUpdateProveedor,
  onToggleEstado,
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const [viewing, setViewing] = useState<Proveedor | null>(null);

  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [productosText, setProductosText] = useState('');
  const [error, setError] = useState('');

  const openCreate = () => {
    setEditing(null);
    setNombre('');
    setNit('');
    setTelefono('');
    setCorreo('');
    setDireccion('');
    setProductosText('');
    setError('');
    setModalOpen(true);
  };

  const openEdit = (p: Proveedor) => {
    setEditing(p);
    setNombre(p.nombre);
    setNit(p.nit);
    setTelefono(p.telefono);
    setCorreo(p.correo);
    setDireccion(p.direccion);
    setProductosText(p.productosSuministrados.join(', '));
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nombre.trim() || !nit.trim() || !telefono.trim()) {
      setError('Nombre, NIT y teléfono son campos obligatorios.');
      return;
    }

    const productosArr = productosText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editing) {
      const ok = onUpdateProveedor({
        ...editing,
        nombre: nombre.trim(),
        nit: nit.trim(),
        telefono: telefono.trim(),
        correo: correo.trim(),
        direccion: direccion.trim(),
        productosSuministrados: productosArr,
      });
      if (ok) setModalOpen(false);
    } else {
      const ok = onAddProveedor({
        nombre: nombre.trim(),
        nit: nit.trim(),
        telefono: telefono.trim(),
        correo: correo.trim(),
        direccion: direccion.trim(),
        productosSuministrados: productosArr,
        estado: 'Activo',
      });
      if (ok) setModalOpen(false);
    }
  };

  const filtered = proveedores.filter((p) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      p.nombre.toLowerCase().includes(q) ||
      p.nit.toLowerCase().includes(q) ||
      p.productosSuministrados.some((item) => item.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1D1D1F] dark:text-white">
            Gestión de proveedores
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Registra, consulta, edita y administra el directorio de proveedores del restaurante.
          </p>
        </div>
        {canManage && (
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            Registrar proveedor
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, NIT o producto suministrado..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm text-[#1D1D1F] dark:text-white focus:outline-none"
          />
        </div>
        <span className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
          {filtered.length} proveedores
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50/70 dark:bg-neutral-900/40">
                <th className="py-3 px-4">Nombre del proveedor</th>
                <th className="py-3 px-4">NIT</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Dirección</th>
                <th className="py-3 px-4">Productos suministrados</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-xs">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/35 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#1D1D1F] dark:text-white">
                    {p.nombre}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {p.nit}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-neutral-700 dark:text-neutral-200 whitespace-nowrap">
                      {p.telefono}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate max-w-[180px]">
                      {p.correo}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 max-w-[200px] truncate">
                    {p.direccion}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 max-w-[220px]">
                    {p.productosSuministrados.join(' · ')}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {p.estado === 'Activo' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setViewing(p)}
                        title="Consultar proveedor"
                        className="p-1.5 rounded-md text-neutral-500 hover:text-[#1D1D1F] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canManage && (
                        <>
                          <button
                            onClick={() => openEdit(p)}
                            title="Editar proveedor"
                            className="p-1.5 rounded-md text-neutral-500 hover:text-[#FF6B35] hover:bg-orange-50 dark:hover:bg-orange-950/30"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onToggleEstado(p.id)}
                            title={p.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                            className="p-1.5 rounded-md text-neutral-500 hover:text-[#E63946] hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#1D1D1F] dark:text-white">
                {editing ? 'Editar proveedor' : 'Registrar nuevo proveedor'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-[#E63946]">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Nombre / Razón social *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    NIT *
                  </label>
                  <input
                    type="text"
                    value={nit}
                    onChange={(e) => setNit(e.target.value)}
                    placeholder="900.123.456-7"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Productos suministrados (separados por coma)
                </label>
                <input
                  type="text"
                  value={productosText}
                  onChange={(e) => setProductosText(e.target.value)}
                  placeholder="Carne de hamburguesa, Salchichas, Alitas"
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
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
                  {editing ? 'Guardar cambios' : 'Registrar proveedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1D1D1F] dark:text-white">
                  {viewing.nombre}
                </h3>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">NIT: {viewing.nit}</p>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span className="font-mono">{viewing.telefono}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>{viewing.correo}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>{viewing.direccion}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                Productos que suministra:
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {viewing.productosSuministrados.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
