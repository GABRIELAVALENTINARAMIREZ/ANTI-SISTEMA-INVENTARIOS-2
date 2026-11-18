import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChefHat,
  Clock,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { ASSETS } from '../data/initialData';
import { DetalleReceta, Producto, Receta } from '../types';
import { formatCOP, formatNumber } from '../utils/formatters';
import { ProductThumbnail } from './ProductThumbnail';

interface RecipesViewProps {
  recetas: Receta[];
  productos: Producto[];
  canManage: boolean;
  canExecute: boolean;
  onExecuteReceta: (recetaId: string, cantidadPlatos: number) => boolean;
  onAddReceta: (receta: Omit<Receta, 'id'>) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  recetas,
  productos,
  canManage,
  canExecute,
  onExecuteReceta,
  onAddReceta,
}) => {
  const [execReceta, setExecReceta] = useState<Receta | null>(null);
  const [execQty, setExecQty] = useState('1');
  const [createOpen, setCreateOpen] = useState(false);

  // Create recipe form state
  const [nombre, setNombre] = useState('');
  const [categoriaMenu, setCategoriaMenu] = useState('Hamburguesas');
  const [precioVenta, setPrecioVenta] = useState('19900');
  const [tiempoPrep, setTiempoPrep] = useState('10');
  const [ingList, setIngList] = useState<DetalleReceta[]>([
    { productoId: productos[0]?.id || 'prod-1', cantidad: 1, unidadEtiqueta: 'unidad' },
  ]);

  const getMaxPortions = (receta: Receta): number => {
    if (receta.ingredientes.length === 0) return 0;
    return Math.min(
      ...receta.ingredientes.map((ing) => {
        const prod = productos.find((p) => p.id === ing.productoId);
        if (!prod || ing.cantidad <= 0) return 0;
        return Math.floor(prod.cantidad / ing.cantidad);
      })
    );
  };

  const handleConfirmExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!execReceta) return;
    const n = Math.floor(Number(execQty));
    if (isNaN(n) || n <= 0) return;
    const ok = onExecuteReceta(execReceta.id, n);
    if (ok) {
      setExecReceta(null);
      setExecQty('1');
    }
  };

  const handleCreateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || ingList.length === 0) return;
    onAddReceta({
      nombre: nombre.trim(),
      categoriaMenu,
      precioVentaCOP: Number(precioVenta) || 0,
      tiempoPreparacionMin: Number(tiempoPrep) || 8,
      imagen: ASSETS.loginHero,
      ingredientes: ingList,
    });
    setCreateOpen(false);
    setNombre('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1D1D1F] dark:text-white">
            Recetas y consumo de ingredientes
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Define la ficha técnica de cada plato y descuenta ingredientes automáticamente al registrar preparaciones o ventas.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nueva receta
          </button>
        )}
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {recetas.map((receta) => {
          const maxPortions = getMaxPortions(receta);
          const costoIngredientes = receta.ingredientes.reduce((sum, ing) => {
            const p = productos.find((prod) => prod.id === ing.productoId);
            return sum + (p ? p.precioCompraCOP * ing.cantidad : 0);
          }, 0);

          return (
            <div
              key={receta.id}
              className="p-5 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <ProductThumbnail src={receta.imagen} alt={receta.nombre} size="md" />
                    <div className="min-w-0">
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {receta.categoriaMenu} · {receta.tiempoPreparacionMin} min
                      </div>
                      <h2 className="font-display text-base font-bold text-[#1D1D1F] dark:text-white truncate">
                        {receta.nombre}
                      </h2>
                    </div>
                  </div>
                  <span className="font-mono tabular-nums text-xs font-bold text-[#1D1D1F] dark:text-white shrink-0">
                    {formatCOP(receta.precioVentaCOP)}
                  </span>
                </div>

                {/* Ingredients Breakdown */}
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                    <span>Ingredientes por unidad</span>
                    <span>Stock actual</span>
                  </div>
                  {receta.ingredientes.map((ing, idx) => {
                    const prod = productos.find((p) => p.id === ing.productoId);
                    const hasEnough = prod ? prod.cantidad >= ing.cantidad : false;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-0.5"
                      >
                        <span className="text-neutral-700 dark:text-neutral-300 truncate pr-2">
                          <strong className="font-mono tabular-nums text-[#1D1D1F] dark:text-white">
                            {ing.cantidad}
                          </strong>{' '}
                          {ing.unidadEtiqueta}{' '}
                          <span className="text-neutral-400">({prod?.nombre})</span>
                        </span>
                        <span
                          className={`font-mono tabular-nums text-[11px] font-medium shrink-0 ${
                            hasEnough
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-[#E63946]'
                          }`}
                        >
                          {prod ? formatNumber(prod.cantidad) : 0}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Costo insumos:{' '}
                    <strong className="font-mono tabular-nums text-[#1D1D1F] dark:text-white">
                      {formatCOP(costoIngredientes)}
                    </strong>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      maxPortions > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-[#E63946]'
                    }`}
                  >
                    {maxPortions > 0 ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Máx. {maxPortions} prep.
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Insumos insuficientes
                      </>
                    )}
                  </span>
                </div>

                {canExecute && (
                  <button
                    disabled={maxPortions <= 0}
                    onClick={() => {
                      setExecReceta(receta);
                      setExecQty('1');
                    }}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                      maxPortions > 0
                        ? 'bg-[#FF6B35] hover:bg-[#e85b28] text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    <ChefHat className="w-4 h-4" />
                    Registrar preparación / venta
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Execute Recipe Consumption Modal */}
      {execReceta && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                Registrar consumo: {execReceta.nombre}
              </h3>
              <button
                onClick={() => setExecReceta(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleConfirmExec} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Cantidad de platos preparados / vendidos
                </label>
                <input
                  type="number"
                  min="1"
                  max={getMaxPortions(execReceta)}
                  value={execQty}
                  onChange={(e) => setExecQty(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm font-mono font-bold text-[#1D1D1F] dark:text-white"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Disponibilidad máxima actual: {getMaxPortions(execReceta)} unidades
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                <p className="text-[11px] font-semibold text-neutral-500 mb-2">
                  Descuento automático en inventario:
                </p>
                {execReceta.ingredientes.map((ing, i) => {
                  const prod = productos.find((p) => p.id === ing.productoId);
                  const totalDeduct = ing.cantidad * (Number(execQty) || 0);
                  const insufficient = prod ? totalDeduct > prod.cantidad : true;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {prod?.nombre}
                      </span>
                      <span
                        className={`font-mono tabular-nums font-semibold ${
                          insufficient ? 'text-[#E63946]' : 'text-[#1D1D1F] dark:text-white'
                        }`}
                      >
                        -{formatNumber(totalDeduct)} {prod?.unidad}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExecReceta(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold"
                >
                  Confirmar y descontar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Recipe Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                Crear nueva receta de menú
              </h3>
              <button
                onClick={() => setCreateOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateRecipe} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Nombre del plato *</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="ej. Combo Mega Burger"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Categoría de menú</label>
                  <input
                    type="text"
                    value={categoriaMenu}
                    onChange={(e) => setCategoriaMenu(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Precio venta (COP)</label>
                  <input
                    type="number"
                    min="0"
                    value={precioVenta}
                    onChange={(e) => setPrecioVenta(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Tiempo prep. (min)
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="1"
                      value={tiempoPrep}
                      onChange={(e) => setTiempoPrep(e.target.value)}
                      className="w-full h-10 pl-8 pr-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Ingredientes requeridos</span>
                  <button
                    type="button"
                    onClick={() =>
                      setIngList((prev) => [
                        ...prev,
                        {
                          productoId: productos[0]?.id || 'prod-1',
                          cantidad: 1,
                          unidadEtiqueta: 'porción',
                        },
                      ])
                    }
                    className="text-xs font-semibold text-[#E63946] hover:underline"
                  >
                    + Añadir ingrediente
                  </button>
                </div>
                {ingList.map((ing, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <select
                      value={ing.productoId}
                      onChange={(e) => {
                        const val = e.target.value;
                        const prod = productos.find((p) => p.id === val);
                        setIngList((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? {
                                  ...item,
                                  productoId: val,
                                  unidadEtiqueta: prod?.unidad || 'unidad',
                                }
                              : item
                          )
                        );
                      }}
                      className="col-span-6 h-9 px-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                    >
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={ing.cantidad}
                      onChange={(e) => {
                        const qty = Number(e.target.value);
                        setIngList((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, cantidad: qty } : item))
                        );
                      }}
                      className="col-span-3 h-9 px-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={ing.unidadEtiqueta}
                      onChange={(e) => {
                        const lbl = e.target.value;
                        setIngList((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, unidadEtiqueta: lbl } : item
                          )
                        );
                      }}
                      className="col-span-2 h-9 px-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIngList((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="col-span-1 p-1.5 text-neutral-400 hover:text-[#E63946]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E63946] text-white text-xs font-semibold"
                >
                  Guardar receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
