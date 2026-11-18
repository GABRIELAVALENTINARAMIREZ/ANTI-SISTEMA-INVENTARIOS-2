import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Filter,
  Search,
} from 'lucide-react';
import {
  Movimiento,
  Producto,
  Proveedor,
  SubtipoMovimiento,
  TipoMovimiento,
  Usuario,
} from '../types';
import { formatCOP, formatNumber } from '../utils/formatters';

interface MovementsViewProps {
  productos: Producto[];
  proveedores: Proveedor[];
  movimientos: Movimiento[];
  currentUser: Usuario;
  canRegister: boolean;
  onRegistrarMovimiento: (payload: {
    tipo: TipoMovimiento;
    subtipo: SubtipoMovimiento;
    productoId: string;
    cantidad: number;
    costoUnitarioCOP: number;
    proveedorId?: string;
    observacion: string;
    fecha: string;
    crearLote?: { numeroLote: string; fechaVencimiento: string };
  }) => boolean;
}

export const MovementsView: React.FC<MovementsViewProps> = ({
  productos,
  proveedores,
  movimientos,
  currentUser,
  canRegister,
  onRegistrarMovimiento,
}) => {
  const [activeTab, setActiveTab] = useState<'entradas' | 'salidas'>('entradas');

  // Entradas form
  const [entProvId, setEntProvId] = useState(proveedores[0]?.id || '');
  const [entProdId, setEntProdId] = useState(productos[0]?.id || '');
  const [entCant, setEntCant] = useState('25');
  const [entCosto, setEntCosto] = useState(String(productos[0]?.precioCompraCOP || 1000));
  const [entFecha, setEntFecha] = useState('2026-11-18');
  const [entObs, setEntObs] = useState('');
  const [entCrearLote, setEntCrearLote] = useState(false);
  const [entNumeroLote, setEntNumeroLote] = useState('LOT-2026-049');
  const [entVence, setEntVence] = useState('2026-12-05');

  // Salidas form
  const [salSubtipo, setSalSubtipo] = useState<SubtipoMovimiento>('Consumo en cocina');
  const [salProdId, setSalProdId] = useState(productos[0]?.id || '');
  const [salCant, setSalCant] = useState('5');
  const [salFecha, setSalFecha] = useState('2026-11-18');
  const [salObs, setSalObs] = useState('');

  // History filters
  const [histTipo, setHistTipo] = useState<'todos' | TipoMovimiento>('todos');
  const [histSearch, setHistSearch] = useState('');

  const selectedEntProd = productos.find((p) => p.id === entProdId);
  const selectedSalProd = productos.find((p) => p.id === salProdId);

  const handleEntradaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cantNum = Number(entCant);
    const costoNum = Number(entCosto);
    if (!entProdId || isNaN(cantNum) || cantNum <= 0 || isNaN(costoNum) || costoNum < 0) return;

    const ok = onRegistrarMovimiento({
      tipo: 'entrada',
      subtipo: 'Compra a proveedor',
      productoId: entProdId,
      cantidad: cantNum,
      costoUnitarioCOP: costoNum,
      proveedorId: entProvId,
      observacion: entObs.trim() || 'Ingreso de mercancía a bodega',
      fecha: `${entFecha} 12:00`,
      crearLote:
        entCrearLote && entNumeroLote.trim()
          ? { numeroLote: entNumeroLote.trim().toUpperCase(), fechaVencimiento: entVence }
          : undefined,
    });

    if (ok) {
      setEntObs('');
      setEntCant('10');
    }
  };

  const handleSalidaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cantNum = Number(salCant);
    if (!salProdId || isNaN(cantNum) || cantNum <= 0) return;

    const ok = onRegistrarMovimiento({
      tipo: 'salida',
      subtipo: salSubtipo,
      productoId: salProdId,
      cantidad: cantNum,
      costoUnitarioCOP: selectedSalProd?.precioCompraCOP || 0,
      observacion: salObs.trim() || salSubtipo,
      fecha: `${salFecha} 12:00`,
    });

    if (ok) {
      setSalObs('');
      setSalCant('1');
    }
  };

  const filteredHistory = movimientos.filter((m) => {
    const matchesTipo = histTipo === 'todos' || m.tipo === histTipo;
    const q = histSearch.trim().toLowerCase();
    const prodNames = m.detalles
      .map((d) => productos.find((p) => p.id === d.productoId)?.nombre || '')
      .join(' ')
      .toLowerCase();
    const matchesSearch =
      !q ||
      m.subtipo.toLowerCase().includes(q) ||
      m.responsable.toLowerCase().includes(q) ||
      m.observacion.toLowerCase().includes(q) ||
      prodNames.includes(q);
    return matchesTipo && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#1D1D1F] dark:text-white">
          Entradas y salidas de inventario
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Registra compras a proveedores, consumos de cocina, mermas y ajustes autorizados con actualización automática de existencias.
        </p>
      </div>

      {/* Tabs + Form Panel */}
      {canRegister && (
        <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 px-4 pt-3 gap-2">
            <button
              onClick={() => setActiveTab('entradas')}
              className={`px-4 py-2.5 rounded-t-lg text-xs font-semibold inline-flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'entradas'
                  ? 'border-[#FF6B35] text-[#FF6B35] bg-white dark:bg-[#161618]'
                  : 'border-transparent text-neutral-500 hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Entradas (Compras)
            </button>
            <button
              onClick={() => setActiveTab('salidas')}
              className={`px-4 py-2.5 rounded-t-lg text-xs font-semibold inline-flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'salidas'
                  ? 'border-[#E63946] text-[#E63946] bg-white dark:bg-[#161618]'
                  : 'border-transparent text-neutral-500 hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Salidas (Consumo / Pérdidas)
            </button>
          </div>

          {activeTab === 'entradas' ? (
            <form onSubmit={handleEntradaSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Proveedor
                  </label>
                  <select
                    value={entProvId}
                    onChange={(e) => setEntProvId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  >
                    {proveedores
                      .filter((pr) => pr.estado === 'Activo')
                      .map((pr) => (
                        <option key={pr.id} value={pr.id}>
                          {pr.nombre}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Ingrediente
                  </label>
                  <select
                    value={entProdId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setEntProdId(id);
                      const found = productos.find((p) => p.id === id);
                      if (found) setEntCosto(String(found.precioCompraCOP));
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  >
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} · {p.nombre} ({p.cantidad} {p.unidad})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Cantidad ({selectedEntProd?.unidad || 'unidades'})
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={entCant}
                    onChange={(e) => setEntCant(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Costo unitario (COP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={entCosto}
                    onChange={(e) => setEntCosto(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Fecha de ingreso
                  </label>
                  <input
                    type="date"
                    value={entFecha}
                    onChange={(e) => setEntFecha(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Responsable
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={currentUser.nombre}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/60 text-xs text-neutral-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Observación / Nº Factura
                  </label>
                  <input
                    type="text"
                    value={entObs}
                    onChange={(e) => setEntObs(e.target.value)}
                    placeholder="ej. Factura #FAC-9021"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entCrearLote}
                      onChange={(e) => setEntCrearLote(e.target.checked)}
                      className="rounded border-neutral-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                    Asociar lote y fecha de vencimiento
                  </label>

                  {entCrearLote && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={entNumeroLote}
                        onChange={(e) => setEntNumeroLote(e.target.value)}
                        placeholder="LOT-2026-XXX"
                        className="h-9 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                      />
                      <input
                        type="date"
                        value={entVence}
                        onChange={(e) => setEntVence(e.target.value)}
                        className="h-9 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-neutral-500">
                    Total compra:{' '}
                    <strong className="font-mono tabular-nums text-sm text-[#1D1D1F] dark:text-white">
                      {formatCOP((Number(entCant) || 0) * (Number(entCosto) || 0))}
                    </strong>
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-[#FF6B35] hover:bg-[#e85b28] text-white text-xs font-semibold whitespace-nowrap"
                  >
                    Registrar entrada
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSalidaSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Motivo de salida
                  </label>
                  <select
                    value={salSubtipo}
                    onChange={(e) => setSalSubtipo(e.target.value as SubtipoMovimiento)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  >
                    <option value="Consumo en cocina">Consumo en cocina</option>
                    <option value="Pérdida / Desperdicio">Pérdida o desperdicio</option>
                    <option value="Ajuste autorizado">Ajuste autorizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Ingrediente
                  </label>
                  <select
                    value={salProdId}
                    onChange={(e) => setSalProdId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  >
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} · {p.nombre} (Disp: {p.cantidad} {p.unidad})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Cantidad a descontar ({selectedSalProd?.unidad || 'unidades'})
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max={selectedSalProd?.cantidad || 0}
                    step="any"
                    required
                    value={salCant}
                    onChange={(e) => setSalCant(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={salFecha}
                    onChange={(e) => setSalFecha(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Justificación / Observación
                  </label>
                  <input
                    type="text"
                    value={salObs}
                    onChange={(e) => setSalObs(e.target.value)}
                    placeholder="ej. Turno noche freidora, o merma por manipulación..."
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-neutral-500">
                    Costo estimado:{' '}
                    <strong className="font-mono tabular-nums text-sm text-[#E63946]">
                      {formatCOP(
                        (Number(salCant) || 0) * (selectedSalProd?.precioCompraCOP || 0)
                      )}
                    </strong>
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold whitespace-nowrap"
                  >
                    Descontar del inventario
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Movement History */}
      <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
            Historial completo de movimientos
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={histSearch}
                onChange={(e) => setHistSearch(e.target.value)}
                placeholder="Buscar ingrediente o responsable..."
                className="h-9 pl-8 pr-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <Filter className="w-3 h-3 text-neutral-400 ml-1.5 mr-1" />
              {(['todos', 'entrada', 'salida'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setHistTipo(t)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    histTipo === t
                      ? 'bg-white dark:bg-[#1E1E22] text-[#1D1D1F] dark:text-white shadow-xs'
                      : 'text-neutral-500'
                  }`}
                >
                  {t === 'todos' ? 'Todos' : t === 'entrada' ? 'Entradas' : 'Salidas'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50/70 dark:bg-neutral-900/40">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Motivo / Concepto</th>
                <th className="py-3 px-4">Ingredientes y cantidades</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4 text-right">Valor (COP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-xs">
              {filteredHistory.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/35 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-500 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {m.fecha}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {m.tipo === 'entrada' ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        Entrada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#E63946]">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Salida
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1D1D1F] dark:text-white">
                      {m.subtipo}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate max-w-[240px]">
                      {m.observacion}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      {m.detalles.map((d, i) => {
                        const prod = productos.find((p) => p.id === d.productoId);
                        return (
                          <div
                            key={i}
                            className="text-neutral-700 dark:text-neutral-300 font-mono text-[11px]"
                          >
                            {m.tipo === 'entrada' ? '+' : '-'}
                            {formatNumber(d.cantidad)} {prod?.unidad || ''} ·{' '}
                            <span className="font-sans">{prod?.nombre || 'Producto'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {m.responsable}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-[#1D1D1F] dark:text-white whitespace-nowrap">
                    {formatCOP(m.totalCOP)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
