import React, { useEffect, useState } from 'react';
import {
  Download,
  Edit3,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { ASSETS } from '../data/initialData';
import { Categoria, EstadoProducto, Producto, Proveedor } from '../types';
import {
  exportToCSV,
  formatCOP,
  formatNumber,
  getEstadoProducto,
} from '../utils/formatters';
import { ProductThumbnail } from './ProductThumbnail';
import { ProductStatusBadge } from './StatusBadge';

interface InventoryViewProps {
  productos: Producto[];
  categorias: Categoria[];
  proveedores: Proveedor[];
  initialCategoryFilter?: string;
  openAddTrigger?: number;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onAddProducto: (prod: Omit<Producto, 'id' | 'ultimaActualizacion'>) => boolean;
  onUpdateProducto: (prod: Producto) => boolean;
  onDeleteProducto: (id: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  productos,
  categorias,
  proveedores,
  initialCategoryFilter = 'todas',
  openAddTrigger = 0,
  canCreate,
  canEdit,
  canDelete,
  onAddProducto,
  onUpdateProducto,
  onDeleteProducto,
}) => {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>(initialCategoryFilter);
  const [statusFilter, setStatusFilter] = useState<'todos' | EstadoProducto>('todos');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Producto | null>(null);
  const [detailProd, setDetailProd] = useState<Producto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null);

  // Form state
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id || 'cat-1');
  const [cantidad, setCantidad] = useState('0');
  const [unidad, setUnidad] = useState('unidades');
  const [stockMinimo, setStockMinimo] = useState('10');
  const [precioCompraCOP, setPrecioCompraCOP] = useState('1000');
  const [proveedorId, setProveedorId] = useState(proveedores[0]?.id || 'prov-1');
  const [ubicacion, setUbicacion] = useState('Despensa Central');
  const [imagen, setImagen] = useState(ASSETS.acompanamientos);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setCatFilter(initialCategoryFilter);
  }, [initialCategoryFilter]);

  useEffect(() => {
    if (openAddTrigger > 0 && canCreate) {
      openCreateModal();
    }
  }, [openAddTrigger]);

  const openCreateModal = () => {
    setEditingProd(null);
    setCodigo('');
    setNombre('');
    setCategoriaId(categorias[0]?.id || 'cat-1');
    setCantidad('20');
    setUnidad('unidades');
    setStockMinimo('10');
    setPrecioCompraCOP('1500');
    setProveedorId(proveedores[0]?.id || 'prov-1');
    setUbicacion('Bodega Principal');
    setImagen(ASSETS.acompanamientos);
    setFormError('');
    setFormModalOpen(true);
  };

  const openEditModal = (p: Producto) => {
    setEditingProd(p);
    setCodigo(p.codigo);
    setNombre(p.nombre);
    setCategoriaId(p.categoriaId);
    setCantidad(String(p.cantidad));
    setUnidad(p.unidad);
    setStockMinimo(String(p.stockMinimo));
    setPrecioCompraCOP(String(p.precioCompraCOP));
    setProveedorId(p.proveedorId);
    setUbicacion(p.ubicacion);
    setImagen(p.imagen);
    setFormError('');
    setFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const qtyNum = Number(cantidad);
    const minNum = Number(stockMinimo);
    const priceNum = Number(precioCompraCOP);

    if (!codigo.trim() || !nombre.trim() || !unidad.trim()) {
      setFormError('Completa los campos obligatorios: código, nombre y unidad de medida.');
      return;
    }
    if (isNaN(qtyNum) || qtyNum < 0 || isNaN(minNum) || minNum < 0 || isNaN(priceNum) || priceNum < 0) {
      setFormError('Las cantidades, el stock mínimo y el precio no pueden ser negativos.');
      return;
    }

    if (editingProd) {
      const ok = onUpdateProducto({
        ...editingProd,
        codigo: codigo.trim().toUpperCase(),
        nombre: nombre.trim(),
        categoriaId,
        cantidad: qtyNum,
        unidad: unidad.trim(),
        stockMinimo: minNum,
        precioCompraCOP: priceNum,
        proveedorId,
        ubicacion: ubicacion.trim() || 'General',
        imagen,
      });
      if (ok) setFormModalOpen(false);
    } else {
      const ok = onAddProducto({
        codigo: codigo.trim().toUpperCase(),
        nombre: nombre.trim(),
        categoriaId,
        cantidad: qtyNum,
        unidad: unidad.trim(),
        stockMinimo: minNum,
        precioCompraCOP: priceNum,
        proveedorId,
        ubicacion: ubicacion.trim() || 'General',
        imagen,
      });
      if (ok) setFormModalOpen(false);
    }
  };

  const filtered = productos.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.nombre.toLowerCase().includes(q) ||
      p.codigo.toLowerCase().includes(q) ||
      p.ubicacion.toLowerCase().includes(q);
    const matchesCat = catFilter === 'todas' || p.categoriaId === catFilter;
    const estado = getEstadoProducto(p);
    const matchesStatus = statusFilter === 'todos' || estado === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleExport = () => {
    const headers = [
      'Código',
      'Nombre',
      'Categoría',
      'Cantidad',
      'Unidad',
      'Stock Mínimo',
      'Precio Compra (COP)',
      'Proveedor',
      'Estado',
    ];
    const rows = filtered.map((p) => {
      const cat = categorias.find((c) => c.id === p.categoriaId)?.nombre || '';
      const prov = proveedores.find((pr) => pr.id === p.proveedorId)?.nombre || '';
      const est = getEstadoProducto(p);
      return [
        p.codigo,
        p.nombre,
        cat,
        p.cantidad,
        p.unidad,
        p.stockMinimo,
        p.precioCompraCOP,
        prov,
        est === 'disponible' ? 'Disponible' : est === 'bajo_stock' ? 'Bajo stock' : 'Agotado',
      ];
    });
    exportToCSV('gama_inventario_2026.csv', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1D1D1F] dark:text-white">
            Inventario de ingredientes
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Administra existencias, precios de compra en pesos colombianos y alertas de stock mínimo.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#1A1A1D] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-[#1D1D1F] dark:text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-neutral-500" />
            Exportar CSV
          </button>
          {canCreate && (
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Agregar producto
            </button>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, nombre o ubicación..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-medium text-[#1D1D1F] dark:text-white focus:outline-none"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            {(
              [
                { id: 'todos', label: 'Todos' },
                { id: 'disponible', label: 'Disponible' },
                { id: 'bajo_stock', label: 'Bajo stock' },
                { id: 'agotado', label: 'Agotado' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-[#1E1E22] text-[#1D1D1F] dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-[#1D1D1F] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl bg-white dark:bg-[#161618] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-50/70 dark:bg-neutral-900/40">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4 text-right">Cantidad</th>
                <th className="py-3 px-4">Unidad</th>
                <th className="py-3 px-4 text-right">Stock mín.</th>
                <th className="py-3 px-4 text-right">Precio compra</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-neutral-500">
                    No hay ingredientes que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const cat = categorias.find((c) => c.id === p.categoriaId);
                  const prov = proveedores.find((pr) => pr.id === p.proveedorId);
                  const estado = getEstadoProducto(p);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/35 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                        {p.codigo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <ProductThumbnail src={p.imagen} alt={p.nombre} size="sm" />
                          <div>
                            <div className="font-semibold text-[#1D1D1F] dark:text-white">
                              {p.nombre}
                            </div>
                            <div className="text-[11px] text-neutral-400">{p.ubicacion}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                        {cat?.nombre || '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#1D1D1F] dark:text-white whitespace-nowrap">
                        {formatNumber(p.cantidad)}
                      </td>
                      <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {p.unidad}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {formatNumber(p.stockMinimo)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-[#1D1D1F] dark:text-white whitespace-nowrap">
                        {formatCOP(p.precioCompraCOP)}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300 max-w-[160px] truncate">
                        {prov?.nombre || '—'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <ProductStatusBadge estado={estado} />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setDetailProd(p)}
                            title="Consultar detalles"
                            className="p-1.5 rounded-md text-neutral-500 hover:text-[#1D1D1F] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(p)}
                              title="Editar"
                              className="p-1.5 rounded-md text-neutral-500 hover:text-[#FF6B35] hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteTarget(p)}
                              title="Eliminar"
                              className="p-1.5 rounded-md text-neutral-500 hover:text-[#E63946] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#1D1D1F] dark:text-white">
                {editingProd ? 'Editar ingrediente' : 'Agregar nuevo producto'}
              </h3>
              <button
                onClick={() => setFormModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs font-medium text-[#E63946] dark:text-red-300">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Código SKU *
                  </label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="ej. CAR-005"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Nombre del ingrediente *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="ej. Tocineta ahumada"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Proveedor
                  </label>
                  <select
                    value={proveedorId}
                    onChange={(e) => setProveedorId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  >
                    {proveedores.map((pr) => (
                      <option key={pr.id} value={pr.id}>
                        {pr.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Unidad
                  </label>
                  <input
                    type="text"
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    placeholder="unidades / kg"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Stock mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={stockMinimo}
                    onChange={(e) => setStockMinimo(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Compra (COP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={precioCompraCOP}
                    onChange={(e) => setPrecioCompraCOP(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-[#1D1D1F] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Ubicación física
                  </label>
                  <input
                    type="text"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Imagen de referencia
                  </label>
                  <select
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1D1D1F] dark:text-white"
                  >
                    <option value={ASSETS.proteinas}>Carnes y proteínas</option>
                    <option value={ASSETS.panesQueso}>Panes y quesos</option>
                    <option value={ASSETS.acompanamientos}>Verduras, papas y empaques</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold"
                >
                  {editingProd ? 'Guardar cambios' : 'Registrar producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailProd && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[#1D1D1F] dark:text-white">
                Ficha de ingrediente
              </h3>
              <button
                onClick={() => setDetailProd(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <ProductThumbnail src={detailProd.imagen} alt={detailProd.nombre} size="lg" />
                <div>
                  <span className="text-xs font-mono text-neutral-500">{detailProd.codigo}</span>
                  <h4 className="font-display text-lg font-bold text-[#1D1D1F] dark:text-white">
                    {detailProd.nombre}
                  </h4>
                  <div className="mt-1">
                    <ProductStatusBadge estado={getEstadoProducto(detailProd)} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <div>
                  <span className="text-neutral-500">Stock actual</span>
                  <p className="font-mono font-semibold text-sm text-[#1D1D1F] dark:text-white mt-0.5">
                    {detailProd.cantidad} {detailProd.unidad}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Stock mínimo</span>
                  <p className="font-mono font-semibold text-sm text-[#1D1D1F] dark:text-white mt-0.5">
                    {detailProd.stockMinimo} {detailProd.unidad}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Precio compra</span>
                  <p className="font-mono font-semibold text-sm text-[#1D1D1F] dark:text-white mt-0.5">
                    {formatCOP(detailProd.precioCompraCOP)}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Valor en bodega</span>
                  <p className="font-mono font-semibold text-sm text-[#1D1D1F] dark:text-white mt-0.5">
                    {formatCOP(detailProd.cantidad * detailProd.precioCompraCOP)}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">Proveedor principal</span>
                  <p className="font-medium text-[#1D1D1F] dark:text-white mt-0.5">
                    {proveedores.find((pr) => pr.id === detailProd.proveedorId)?.nombre || '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-500">Ubicación y última actualización</span>
                  <p className="font-medium text-[#1D1D1F] dark:text-white mt-0.5">
                    {detailProd.ubicacion} · {detailProd.ultimaActualizacion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#1A1A1D] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-[#1D1D1F] dark:text-white">
              Eliminar ingrediente
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              ¿Confirmas que deseas eliminar <strong>{deleteTarget.nombre}</strong> ({deleteTarget.codigo}) del catálogo? Esta acción quedará registrada en auditoría.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteProducto(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-[#E63946] hover:bg-[#d32f3d] text-white text-xs font-semibold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
