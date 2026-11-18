import React, { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Download,
  FileSpreadsheet,
  Printer,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { WEEKLY_MOVEMENT_SERIES } from '../data/initialData';
import { Categoria, Movimiento, Producto } from '../types';
import { exportToCSV, formatCOP, formatNumber, getEstadoProducto } from '../utils/formatters';
import { CategoryDonutChart, MovementsBarChart } from './Charts';
import { ProductStatusBadge } from './StatusBadge';

interface ReportsViewProps {
  productos: Producto[];
  categorias: Categoria[];
  movimientos: Movimiento[];
  canExport: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  productos,
  categorias,
  movimientos,
  canExport,
}) => {
  const [fechaInicio, setFechaInicio] = useState('2026-11-01');
  const [fechaFin, setFechaFin] = useState('2026-11-18');

  const filteredMovs = movimientos.filter((m) => {
    const day = m.fecha.slice(0, 10);
    return day >= fechaInicio && day <= fechaFin;
  });

  const totalEntradasCOP = filteredMovs
    .filter((m) => m.tipo === 'entrada')
    .reduce((acc, m) => acc + m.totalCOP, 0);

  const totalSalidasCOP = filteredMovs
    .filter((m) => m.tipo === 'salida')
    .reduce((acc, m) => acc + m.totalCOP, 0);

  const totalPerdidasCOP = filteredMovs
    .filter(
      (m) =>
        m.tipo === 'salida' &&
        (m.subtipo === 'Pérdida / Desperdicio' || m.subtipo === 'Baja por vencimiento')
    )
    .reduce((acc, m) => acc + m.totalCOP, 0);

  const valorInventario = productos.reduce(
    (acc, p) => acc + p.cantidad * p.precioCompraCOP,
    0
  );

  // Top used ingredients in selected date range
  const usageMap = new Map<string, { qty: number; cop: number }>();
  filteredMovs
    .filter((m) => m.tipo === 'salida')
    .forEach((m) => {
      m.detalles.forEach((d) => {
        const cur = usageMap.get(d.productoId) || { qty: 0, cop: 0 };
        usageMap.set(d.productoId, {
          qty: cur.qty + d.cantidad,
          cop: cur.cop + d.cantidad * d.costoUnitarioCOP,
        });
      });
    });

  const topConsumed = Array.from(usageMap.entries())
    .map(([prodId, stats]) => ({
      producto: productos.find((p) => p.id === prodId),
      ...stats,
    }))
    .filter((item) => item.producto)
    .sort((a, b) => b.cop - a.cop);

  const criticalOrOut = productos.filter((p) => getEstadoProducto(p) !== 'disponible');

  const donutSlices = categorias
    .map((c) => ({
      id: c.id,
      label: c.nombre,
      value: productos
        .filter((p) => p.categoriaId === c.id)
        .reduce((sum, p) => sum + p.cantidad * p.precioCompraCOP, 0),
      color: c.color,
    }))
    .filter((s) => s.value > 0);

  const handleExportExcel = () => {
    const headers = [
      'Fecha',
      'Tipo',
      'Subtipo',
      'Responsable',
      'Observación',
      'Valor (COP)',
    ];
    const rows = filteredMovs.map((m) => [
      m.fecha,
      m.tipo.toUpperCase(),
      m.subtipo,
      m.responsable,
      m.observacion,
      m.totalCOP,
    ]);
    exportToCSV(`gama_reporte_${fechaInicio}_a_${fechaFin}.csv`, headers, rows);
  };

  const handleQuickPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Formal Letterhead (Visible only on paper / PDF print) */}
      <div className="print-only pb-4 mb-4 border-b-2 border-[#1D1D1F]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-xs bg-[#E63946]" />
              <span className="font-display text-lg font-bold tracking-tight text-[#1D1D1F]">
                GAMA · Gestión de Inventario
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              Reporte Administrativo de Comidas Rápidas · Valorización en Pesos Colombianos (COP)
            </p>
          </div>
          <div className="text-right text-[11px] font-mono tabular-nums text-neutral-700">
            <div>
              Período: <strong>{fechaInicio}</strong> al <strong>{fechaFin}</strong>
            </div>
            <div>Fecha de impresión: 2026-11-18</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 no-print">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1D1D1F] dark:text-white">
            Reportes e inteligencia de inventario
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Analiza consumo de ingredientes, valorización de bodega, pérdidas por desperdicio y rotación por fechas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 text-xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="bg-transparent font-mono text-xs focus:outline-none"
            />
            <span className="text-neutral-400">a</span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="bg-transparent font-mono text-xs focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleQuickPrint}
            className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1A1A1D] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-[#1D1D1F] dark:text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Printer className="w-4 h-4 text-[#FF6B35]" />
            Impresión rápida
          </button>

          {canExport && (
            <>
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1A1A1D] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Exportar Excel
              </button>
              <button
                type="button"
                onClick={handleQuickPrint}
                className="px-3.5 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Exportar PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print-grid-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 print-surface print-avoid-break">
          <div className="flex items-center justify-between text-xs text-neutral-500 print-text-muted">
            <span>Valor actual en bodega</span>
            <Download className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-display text-2xl font-bold font-mono tabular-nums text-[#1D1D1F] dark:text-white mt-2 print-text-main">
            {formatCOP(valorInventario)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 print-text-muted">
            {productos.length} ingredientes valorizados
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 print-surface print-avoid-break">
          <div className="flex items-center justify-between text-xs text-neutral-500 print-text-muted">
            <span>Compras en el período</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-display text-2xl font-bold font-mono tabular-nums text-[#1D1D1F] dark:text-white mt-2 print-text-main">
            {formatCOP(totalEntradasCOP)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 print-text-muted">
            {filteredMovs.filter((m) => m.tipo === 'entrada').length} ingresos registrados
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 print-surface print-avoid-break">
          <div className="flex items-center justify-between text-xs text-neutral-500 print-text-muted">
            <span>Consumo de ingredientes</span>
            <TrendingDown className="w-4 h-4 text-[#FF6B35]" />
          </div>
          <div className="font-display text-2xl font-bold font-mono tabular-nums text-[#1D1D1F] dark:text-white mt-2 print-text-main">
            {formatCOP(totalSalidasCOP)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 print-text-muted">
            {filteredMovs.filter((m) => m.tipo === 'salida').length} despachos y recetas
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 print-surface print-avoid-break">
          <div className="flex items-center justify-between text-xs text-neutral-500 print-text-muted">
            <span>Pérdidas por desperdicio</span>
            <AlertTriangle className="w-4 h-4 text-[#E63946]" />
          </div>
          <div className="font-display text-2xl font-bold font-mono tabular-nums text-[#E63946] mt-2">
            {formatCOP(totalPerdidasCOP)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 print-text-muted">
            Mermas y bajas por vencimiento
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print-charts-grid">
        <div className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 print-surface print-avoid-break">
          <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white mb-4 print-text-main">
            Comportamiento semanal de compras vs consumo
          </h2>
          <MovementsBarChart data={WEEKLY_MOVEMENT_SERIES} />
        </div>
        <div className="lg:col-span-5 p-6 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 print-surface print-avoid-break">
          <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white mb-4 print-text-main">
            Capital invertido por categoría
          </h2>
          <CategoryDonutChart slices={donutSlices} />
        </div>
      </div>

      {/* Bottom Data Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print-grid-2">
        {/* Top Used Ingredients */}
        <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden print-surface print-avoid-break">
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white print-text-main">
              Ingredientes más utilizados
            </h2>
            <p className="text-xs text-neutral-500 print-text-muted">
              Ordenados por costo total consumido en el rango seleccionado
            </p>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {topConsumed.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No hay consumos registrados en este rango de fechas.
              </div>
            ) : (
              topConsumed.map((item) => (
                <div
                  key={item.producto!.id}
                  className="px-5 py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#1D1D1F] dark:text-white print-text-main">
                      {item.producto!.nombre}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 print-text-muted">
                      {formatNumber(item.qty)} {item.producto!.unidad} consumidas
                    </div>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-[#1D1D1F] dark:text-white print-text-main">
                    {formatCOP(item.cop)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Out of stock / Low stock report */}
        <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden print-surface print-avoid-break">
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white print-text-main">
              Productos agotados y en alerta de stock
            </h2>
            <p className="text-xs text-neutral-500 print-text-muted">
              Requieren orden de compra prioritaria
            </p>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {criticalOrOut.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                Sin productos agotados o en bajo stock.
              </div>
            ) : (
              criticalOrOut.map((p) => (
                <div
                  key={p.id}
                  className="px-5 py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#1D1D1F] dark:text-white print-text-main">
                      {p.nombre}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 print-text-muted">
                      Existencia: {p.cantidad} {p.unidad} · Mínimo: {p.stockMinimo}
                    </div>
                  </div>
                  <ProductStatusBadge estado={getEstadoProducto(p)} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Period Movements Table (clean on screen and paper) */}
      <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden print-surface">
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white print-text-main">
              Detalle de movimientos del período
            </h2>
            <p className="text-xs text-neutral-500 print-text-muted">
              {filteredMovs.length} registros comprendidos entre {fechaInicio} y {fechaFin}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50/70 dark:bg-neutral-900/40 print-surface">
                <th className="py-2.5 px-4">Fecha</th>
                <th className="py-2.5 px-4">Tipo</th>
                <th className="py-2.5 px-4">Concepto</th>
                <th className="py-2.5 px-4">Responsable</th>
                <th className="py-2.5 px-4 text-right">Valor (COP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredMovs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">
                    No existen movimientos registrados en este rango de fechas.
                  </td>
                </tr>
              ) : (
                filteredMovs.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-neutral-600 print-text-muted whitespace-nowrap">
                      {m.fecha}
                    </td>
                    <td className="py-2.5 px-4 font-semibold whitespace-nowrap">
                      <span
                        className={
                          m.tipo === 'entrada'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-[#E63946]'
                        }
                      >
                        {m.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-[#1D1D1F] dark:text-white print-text-main">
                        {m.subtipo}
                      </div>
                      <div className="text-[11px] text-neutral-500 print-text-muted">
                        {m.observacion}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-300 print-text-main whitespace-nowrap">
                      {m.responsable}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold text-[#1D1D1F] dark:text-white print-text-main whitespace-nowrap">
                      {formatCOP(m.totalCOP)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Signature Footer */}
      <div className="print-only pt-8 mt-6 border-t border-neutral-300 text-[11px] text-neutral-600">
        <div className="flex items-end justify-between">
          <div>
            Documento generado automáticamente por <strong>GAMA</strong> · Sistema Administrativo FastStock
          </div>
          <div className="text-center w-56 pt-6 border-t border-neutral-400">
            Firma de recibido / Administración
          </div>
        </div>
      </div>
    </div>
  );
};
