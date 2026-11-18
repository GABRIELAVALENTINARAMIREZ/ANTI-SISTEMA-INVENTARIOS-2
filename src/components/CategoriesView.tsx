import React, { useState } from 'react';
import {
  ArrowRight,
  Beef,
  Croissant,
  CupSoda,
  Droplets,
  Edit3,
  Leaf,
  Package,
  Plus,
  Snowflake,
  Utensils,
  X,
} from 'lucide-react';
import { Categoria, Producto } from '../types';
import { formatCOP, getEstadoProducto } from '../utils/formatters';

interface CategoriesViewProps {
  categorias: Categoria[];
  productos: Producto[];
  canEdit: boolean;
  onSelectCategoryInventory: (catId: string) => void;
  onAddCategoria: (cat: Omit<Categoria, 'id'>) => void;
  onUpdateCategoria: (cat: Categoria) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Beef,
  Croissant,
  Leaf,
  Droplets,
  CupSoda,
  Snowflake,
  Package,
  Utensils,
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categorias,
  productos,
  canEdit,
  onSelectCategoryInventory,
  onAddCategoria,
  onUpdateCategoria,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Categoria | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [icono, setIcono] = useState('Package');
  const [color, setColor] = useState('#E63946');

  const openCreate = () => {
    setEditingCat(null);
    setNombre('');
    setDescripcion('');
    setIcono('Package');
    setColor('#FF6B35');
    setModalOpen(true);
  };

  const openEdit = (c: Categoria) => {
    setEditingCat(c);
    setNombre(c.nombre);
    setDescripcion(c.descripcion);
    setIcono(c.icono);
    setColor(c.color);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (editingCat) {
      onUpdateCategoria({
        ...editingCat,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        icono,
        color,
      });
    } else {
      onAddCategoria({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        icono,
        color,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1D1D1F] dark:text-white">
            Gestión de categorías
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Organiza proteínas, panes, verduras, salsas, bebidas, congelados y empaques del restaurante.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nueva categoría
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categorias.map((cat) => {
          const IconComp = ICON_MAP[cat.icono] || Package;
          const catProds = productos.filter((p) => p.categoriaId === cat.id);
          const totalVal = catProds.reduce(
            (sum, p) => sum + p.cantidad * p.precioCompraCOP,
            0
          );
          const alertas = catProds.filter(
            (p) => getEstadoProducto(p) !== 'disponible'
          ).length;

          return (
            <div
              key={cat.id}
              className="p-5 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: cat.color }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  {canEdit && (
                    <button
                      onClick={() => openEdit(cat)}
                      title="Editar categoría"
                      className="p-1.5 rounded-md text-neutral-400 hover:text-[#1D1D1F] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h2 className="font-display text-base font-bold text-[#1D1D1F] dark:text-white">
                  {cat.nombre}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 min-h-[32px]">
                  {cat.descripcion}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    <strong className="font-mono tabular-nums text-[#1D1D1F] dark:text-white">
                      {catProds.length}
                    </strong>{' '}
                    productos
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-[#1D1D1F] dark:text-white">
                    {formatCOP(totalVal)}
                  </span>
                </div>
                {alertas > 0 && (
                  <p className="text-[11px] font-medium text-[#E63946] mt-1.5">
                    {alertas} {alertas === 1 ? 'producto con alerta' : 'productos con alerta'}
                  </p>
                )}
              </div>

              <button
                onClick={() => onSelectCategoryInventory(cat.id)}
                className="mt-4 w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-[#E63946] hover:text-[#E63946] dark:hover:border-[#FF6B35] dark:hover:text-[#FF6B35] text-xs font-semibold text-[#1D1D1F] dark:text-neutral-200 inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                Administrar
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                {editingCat ? 'Editar categoría' : 'Nueva categoría'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nombre de la categoría *
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Icono
                  </label>
                  <select
                    value={icono}
                    onChange={(e) => setIcono(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  >
                    {Object.keys(ICON_MAP).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Color distintivo
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
