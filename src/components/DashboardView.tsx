import React from 'react';
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  PackageX,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { WEEKLY_MOVEMENT_SERIES } from '../data/initialData';
import { Categoria, Lote, Movimiento, NavSection, Notificacion, Producto } from '../types';
import { formatCOP, getDiasParaVencer, getEstadoProducto } from '../utils/formatters';
import { CategoryDonutChart, MovementsBarChart } from './Charts';
import { ProductThumbnail } from './ProductThumbnail';
import { ProductStatusBadge } from './StatusBadge';

interface DashboardViewProps {
  productos: Producto[];
  categorias: Categoria[];
  movimientos: Movimiento[];
  lotes: Lote[];
  notificaciones: Notificacion[];
  canAddProduct: boolean;
  onNavigate: (section: NavSection) => void;
  onOpenAddProduct: () => void;
  onOpenNewMovement: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  productos,
  categorias,
  movimientos,
  lotes,
  notificaciones,
  canAddProduct,
  onNavigate,
  onOpenAddProduct,
  onOpenNewMovement,
}) => {
  const totalProductos = productos.length;
  const disponibles = productos.filter((p) => getEstadoProducto(p) === 'disponible').length;
  const bajoStock = productos.filter((p) => getEstadoProducto(p) === 'bajo_stock').length;
  const agotados = productos.filter((p) => getEstadoProducto(p) === 'agotado').length;
  const proximosVencer = lotes.filter((l) => {
    if (l.dadoDeBaja) return false;
    const dias = getDiasParaVencer(l.fechaVencimiento);
    return dias <= 7;
  }).length;
  const valorTotal = productos.reduce(
    (sum, p) => sum + p.cantidad * p.precioCompraCOP,
    0
  );

  const criticalProducts = productos.filter(
    (p) => getEstadoProducto(p) !== 'disponible'
  );

  const donutSlices = categorias
    .map((cat) => {
      const catVal = productos
        .filter((p) => p.categoriaId === cat.id)
        .reduce((acc, p) => acc + p.cantidad * p.precioCompraCOP, 0);
      return {
        id: cat.id,
        label: cat.nombre,
        value: catVal,
        color: cat.color,
      };
    })
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  const kpis = [
    {
      label: 'Productos registrados',
      value: String(totalProductos),
      sub: `${categorias.length} categorías activas`,
      icon: Boxes,
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 text-[#1D1D1F] dark:text-white',
      onClick: () => onNavigate('inventario'),
    },
    {
      label: 'Ingredientes disponibles',
      value: String(disponibles),
      sub: 'Con stock óptimo',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
      onClick: () => onNavigate('inventario'),
    },
    {
      label: 'Productos con bajo stock',
      value: String(bajoStock),
      sub: 'Requieren reposición',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 dark:bg-amber-950/50 text-[#D97706] dark:text-[#FFBE0B]',
      onClick: () => onNavigate('inventario'),
    },
    {
      label: 'Productos agotados',
      value: String(agotados),
      sub: 'Sin existencias',
      icon: PackageX,
      iconBg: 'bg-red-50 dark:bg-red-950/50 text-[#E63946]',
      onClick: () => onNavigate('inventario'),
    },
    {
      label: 'Próximos a vencer',
      value: String(proximosVencer),
      sub: 'Vencidos o ≤ 7 días',
      icon: CalendarClock,
      iconBg: 'bg-orange-50 dark:bg-orange-950/50 text-[#FF6B35]',
      onClick: () => onNavigate('lotes'),
    },
    {
      label: 'Valor total del inventario',
      value: formatCOP(valorTotal),
      sub: 'Costo de adquisición',
      icon: DollarSign,
      iconBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
      onClick: () => onNavigate('reportes'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-white text-balance">
            Bienvenido a GAMA 🍔
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Controla los ingredientes, productos y movimientos de tu restaurante desde un solo lugar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewMovement}
            className="px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1A1A1D] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4 text-[#FF6B35]" />
            Registrar movimiento
          </button>
          {canAddProduct && (
            <button
              onClick={onOpenAddProduct}
              className="px-4 py-2.5 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              + Agregar producto
            </button>
          )}
        </div>
      </div>

      {/* 6 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.label}
              onClick={kpi.onClick}
              className="text-left p-4 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E63946]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="font-display text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#1D1D1F] dark:text-white truncate">
                {kpi.value}
              </div>
              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 mt-1">
                {kpi.label}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {kpi.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                Entradas y salidas de inventario
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Flujo valorizado en pesos colombianos · Últimos 7 días
              </p>
            </div>
            <button
              onClick={() => onNavigate('movimientos')}
              className="text-xs font-medium text-[#E63946] hover:underline whitespace-nowrap"
            >
              Ver historial
            </button>
          </div>
          <MovementsBarChart data={WEEKLY_MOVEMENT_SERIES} />
        </div>

        <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                Distribución por categorías
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Participación sobre el capital invertido
              </p>
            </div>
            <button
              onClick={() => onNavigate('categorias')}
              className="text-xs font-medium text-[#E63946] hover:underline whitespace-nowrap"
            >
              Gestionar
            </button>
          </div>
          <CategoryDonutChart slices={donutSlices} />
        </div>
      </div>

      {/* Bottom Grid: Recent Movements + Critical Products & Important Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Movements Table */}
        <div className="lg:col-span-7 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                Últimos movimientos
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Actividad reciente de compras, recetas y mermas
              </p>
            </div>
            <button
              onClick={() => onNavigate('movimientos')}
              className="text-xs font-medium text-[#E63946] hover:underline"
            >
              Todos los movimientos
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50/70 dark:bg-neutral-900/40">
                  <th className="py-2.5 px-4">Tipo</th>
                  <th className="py-2.5 px-4">Detalle</th>
                  <th className="py-2.5 px-4">Responsable</th>
                  <th className="py-2.5 px-4 text-right">Total COP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-xs">
                {movimientos.slice(0, 5).map((mov) => {
                  const firstProd = productos.find(
                    (p) => p.id === mov.detalles[0]?.productoId
                  );
                  return (
                    <tr
                      key={mov.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        {mov.tipo === 'entrada' ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            Entrada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#E63946]">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Salida
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#1D1D1F] dark:text-white truncate max-w-[230px]">
                          {mov.subtipo}
                          {firstProd ? ` · ${firstProd.nombre}` : ''}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                          {mov.fecha}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                        {mov.responsable}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#1D1D1F] dark:text-white whitespace-nowrap">
                        {formatCOP(mov.totalCOP)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Products & Important Alerts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Critical Stock List */}
          <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                Productos críticos
              </h2>
              <button
                onClick={() => onNavigate('inventario')}
                className="text-xs font-medium text-[#E63946] hover:underline"
              >
                Reabastecer
              </button>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {criticalProducts.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-500">
                  Todos los ingredientes están sobre su stock mínimo.
                </div>
              ) : (
                criticalProducts.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id}
                    className="px-5 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ProductThumbnail src={prod.imagen} alt={prod.nombre} size="sm" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#1D1D1F] dark:text-white truncate">
                          {prod.nombre}
                        </div>
                        <div className="text-[11px] font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
                          Actual: {prod.cantidad} {prod.unidad} · Mín: {prod.stockMinimo}
                        </div>
                      </div>
                    </div>
                    <ProductStatusBadge estado={getEstadoProducto(prod)} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Important Alerts */}
          <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="font-display text-sm font-semibold text-[#1D1D1F] dark:text-white">
                Alertas importantes
              </h2>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {notificaciones.slice(0, 3).map((alerta) => (
                <button
                  key={alerta.id}
                  onClick={() => onNavigate(alerta.moduloDestino)}
                  className="w-full text-left px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors flex items-start gap-3"
                >
                  <AlertTriangle
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      alerta.severidad === 'critica'
                        ? 'text-[#E63946]'
                        : 'text-[#FFBE0B]'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
                      {alerta.titulo}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {alerta.mensaje}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
