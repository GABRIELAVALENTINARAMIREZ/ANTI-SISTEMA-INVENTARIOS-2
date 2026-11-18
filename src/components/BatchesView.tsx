import React, { useState } from 'react';
import {
  AlertTriangle,
  CalendarClock,
  Plus,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { EstadoLote, Lote, Producto } from '../types';
import { formatNumber, getDiasParaVencer, getEstadoLote } from '../utils/formatters';
import { BatchStatusBadge } from './StatusBadge';

interface BatchesViewProps {
  lotes: Lote[];
  productos: Producto[];
  canManage: boolean;
  onAddLote: (lote: Omit<Lote, 'id'>) => boolean;
  onDarDeBajaLote: (loteId: string) => void;
}

export const BatchesView: React.FC<BatchesViewProps> = ({
  lotes,
  productos,
  canManage,
  onAddLote,
  onDarDeBajaLote,
}) => {
  const [filter, setFilter] = useState<'todos' | EstadoLote>('todos');
  const [modalOpen, setModalOpen] = useState(false);

  const [numeroLote, setNumeroLote] = useState('LOT-2026-050');
  const [productoId, setProductoId] = useState(productos[0]?.id || 'prod-1');
  const [cantidad, setCantidad] = useState('30');
  const [fechaIngreso, setFechaIngreso] = useState('2026-11-18');
  const [fechaVencimiento, setFechaVencimiento] = useState('2026-11-28');
  const [ubicacion, setUbicacion] = useState('Cámara fría 1');

  const vencidosCount = lotes.filter(
    (l) => !l.dadoDeBaja && getEstadoLote(l.fechaVencimiento) === 'vencido'
  ).length;
  const proximosCount = lotes.filter(
    (l) => !l.dadoDeBaja && getEstadoLote(l.fechaVencimiento) === 'proximo_vencer'
  ).length;

  const filtered = lotes.filter((l) => {
    if (filter === 'todos') return true;
    return getEstadoLote(l.fechaVencimiento) === filter;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cantNum = Number(cantidad);
    if (!numeroLote.trim() || isNaN(cantNum) || cantNum <= 0) return;

    const ok = onAddLote({
      numeroLote: numeroLote.trim().toUpperCase(),
      productoId,
      cantidad: cantNum,
      fechaIngreso,
      fechaVencimiento,
      ubicacion: ubicacion.trim() || 'Bodega',
    });
    if (ok) {
      setModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1D1D1F] dark:text-white">
            Lotes y vencimientos
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Trazabilidad por lote, control de fechas de caducidad y rotación FIFO de ingredientes perecederos.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            Registrar lote
          </button>
        )}
      </div>

      {/* Alert Summary Strip */}
      {(vencidosCount > 0 || proximosCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vencidosCount > 0 && (
            <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-[#E63946] shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-[#E63946] dark:text-red-300">
                  {vencidosCount} {vencidosCount === 1 ? 'lote vencido' : 'lotes vencidos'} en almacenamiento
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                  Retira de inmediato de cocina y registra la baja para mantener trazabilidad.
                </p>
              </div>
            </div>
          )}
          {proximosCount > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#D97706] dark:text-[#FFBE0B] shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  {proximosCount} {proximosCount === 1 ? 'lote próximo' : 'lotes próximos'} a vencer (≤ 7 días)
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                  Prioriza el despacho de estos ingredientes en las recetas del día.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 w-fit rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        {(
          [
            { id: 'todos', label: 'Todos los lotes' },
            { id: 'vigente', label: 'Vigentes' },
            { id: 'proximo_vencer', label: 'Próximos a vencer' },
            { id: 'vencido', label: 'Vencidos' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              filter === tab.id
                ? 'bg-white dark:bg-[#1E1E22] text-[#1D1D1F] dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-[#1D1D1F] dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Batches Table */}
      <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50/70 dark:bg-neutral-900/40">
                <th className="py-3 px-4">Número de lote</th>
                <th className="py-3 px-4">Ingrediente</th>
                <th className="py-3 px-4 text-right">Cantidad</th>
                <th className="py-3 px-4">Fecha ingreso</th>
                <th className="py-3 px-4">Fecha vencimiento</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-xs">
              {filtered.map((l) => {
                const prod = productos.find((p) => p.id === l.productoId);
                const estado = getEstadoLote(l.fechaVencimiento);
                const dias = getDiasParaVencer(l.fechaVencimiento);

                return (
                  <tr
                    key={l.id}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/35 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1D1D1F] dark:text-white whitespace-nowrap">
                      {l.numeroLote}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#1D1D1F] dark:text-white">
                      {prod?.nombre || 'Ingrediente eliminado'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold whitespace-nowrap">
                      {formatNumber(l.cantidad)} {prod?.unidad || ''}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-500 whitespace-nowrap">
                      {l.fechaIngreso}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono tabular-nums text-[#1D1D1F] dark:text-white inline-flex items-center gap-1.5">
                        <CalendarClock className="w-3.5 h-3.5 text-neutral-400" />
                        {l.fechaVencimiento}
                      </div>
                      {!l.dadoDeBaja && (
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {dias < 0
                            ? `Venció hace ${Math.abs(dias)} días`
                            : dias === 0
                              ? 'Vence hoy'
                              : `En ${dias} días`}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                      {l.ubicacion}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <BatchStatusBadge estado={estado} dadoDeBaja={l.dadoDeBaja} />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {canManage && !l.dadoDeBaja && (
                        <button
                          onClick={() => onDarDeBajaLote(l.id)}
                          title="Dar de baja por vencimiento"
                          className="px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 hover:border-[#E63946] hover:text-[#E63946] text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Dar de baja
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                Registrar nuevo lote
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Número de lote *</label>
                <input
                  type="text"
                  required
                  value={numeroLote}
                  onChange={(e) => setNumeroLote(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Ingrediente</label>
                <select
                  value={productoId}
                  onChange={(e) => setProductoId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                >
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} · {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Fecha ingreso</label>
                  <input
                    type="date"
                    value={fechaIngreso}
                    onChange={(e) => setFechaIngreso(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Fecha vencimiento</label>
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                  />
                </div>
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
                  Guardar lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
