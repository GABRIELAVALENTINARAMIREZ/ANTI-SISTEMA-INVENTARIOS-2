/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { BatchesView } from './components/BatchesView';
import { CategoriesView } from './components/CategoriesView';
import { DashboardView } from './components/DashboardView';
import {
  ArchitectureModal,
  GlobalSearchModal,
  ProfileModal,
} from './components/GlobalModals';
import { InventoryView } from './components/InventoryView';
import { LoginScreen } from './components/LoginScreen';
import { MovementsView } from './components/MovementsView';
import { RecipesView } from './components/RecipesView';
import { ReportsView } from './components/ReportsView';
import { SuppliersView } from './components/SuppliersView';
import { TopNav } from './components/TopNav';
import { UsersView } from './components/UsersView';
import {
  INITIAL_AUDITORIA,
  INITIAL_CATEGORIAS,
  INITIAL_LOTES,
  INITIAL_MOVIMIENTOS,
  INITIAL_PRODUCTOS,
  INITIAL_PROVEEDORES,
  INITIAL_RECETAS,
  INITIAL_USUARIOS,
} from './data/initialData';
import {
  Categoria,
  Lote,
  Movimiento,
  NavSection,
  Notificacion,
  Producto,
  Proveedor,
  Receta,
  RegistroAuditoria,
  RolUsuario,
  SubtipoMovimiento,
  TipoMovimiento,
  ToastMessage,
  Usuario,
} from './types';
import {
  getDiasParaVencer,
  getEstadoLote,
  getEstadoProducto,
  ROLE_PERMISSIONS,
} from './utils/formatters';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>(INITIAL_USUARIOS);
  const [currentUser, setCurrentUser] = useState<Usuario>(INITIAL_USUARIOS[0]);

  const [activeSection, setActiveSection] = useState<NavSection>('inicio');
  const [inventoryCatFilter, setInventoryCatFilter] = useState<string>('todas');
  const [openAddProductTrigger, setOpenAddProductTrigger] = useState(0);

  const [categorias, setCategorias] = useState<Categoria[]>(INITIAL_CATEGORIAS);
  const [proveedores, setProveedores] = useState<Proveedor[]>(INITIAL_PROVEEDORES);
  const [productos, setProductos] = useState<Producto[]>(INITIAL_PRODUCTOS);
  const [movimientos, setMovimientos] = useState<Movimiento[]>(INITIAL_MOVIMIENTOS);
  const [recetas, setRecetas] = useState<Receta[]>(INITIAL_RECETAS);
  const [lotes, setLotes] = useState<Lote[]>(INITIAL_LOTES);
  const [auditoria, setAuditoria] = useState<RegistroAuditoria[]>(INITIAL_AUDITORIA);

  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [architectureOpen, setArchitectureOpen] = useState(false);

  // Sync .dark on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const pushToast = (tipo: ToastMessage['tipo'], titulo: string, mensaje: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, tipo, titulo, mensaje }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const logAudit = (accion: string, modulo: string, detalle: string) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setAuditoria((prev) => [
      {
        id: `aud-${Date.now()}`,
        fecha: `2026-11-18 ${hh}:${mm}`,
        usuario: currentUser.nombre,
        rol: currentUser.rol,
        accion,
        modulo,
        detalle,
      },
      ...prev,
    ]);
  };

  // Automatic real-time alerts derived from inventory & batch states
  const notificaciones: Notificacion[] = useMemo(() => {
    const alerts: Notificacion[] = [];
    productos.forEach((p) => {
      const est = getEstadoProducto(p);
      if (est === 'agotado') {
        const id = `notif-out-${p.id}`;
        alerts.push({
          id,
          titulo: `Producto agotado: ${p.nombre}`,
          mensaje: `Existencia en 0 ${p.unidad}. Requiere compra urgente.`,
          severidad: 'critica',
          fecha: p.ultimaActualizacion,
          leida: readNotifIds.has(id),
          moduloDestino: 'inventario',
        });
      } else if (est === 'bajo_stock') {
        const id = `notif-low-${p.id}`;
        alerts.push({
          id,
          titulo: `Bajo stock: ${p.nombre}`,
          mensaje: `Quedan ${p.cantidad} ${p.unidad} (mínimo ${p.stockMinimo}).`,
          severidad: 'advertencia',
          fecha: p.ultimaActualizacion,
          leida: readNotifIds.has(id),
          moduloDestino: 'inventario',
        });
      }
    });

    lotes.forEach((l) => {
      if (l.dadoDeBaja) return;
      const est = getEstadoLote(l.fechaVencimiento);
      const prod = productos.find((p) => p.id === l.productoId);
      if (est === 'vencido') {
        const id = `notif-exp-${l.id}`;
        alerts.push({
          id,
          titulo: `Lote vencido: ${l.numeroLote}`,
          mensaje: `${prod?.nombre || 'Ingrediente'} venció el ${l.fechaVencimiento}.`,
          severidad: 'critica',
          fecha: l.fechaVencimiento,
          leida: readNotifIds.has(id),
          moduloDestino: 'lotes',
        });
      } else if (est === 'proximo_vencer') {
        const id = `notif-soon-${l.id}`;
        const dias = getDiasParaVencer(l.fechaVencimiento);
        alerts.push({
          id,
          titulo: `Próximo a vencer: ${l.numeroLote}`,
          mensaje: `${prod?.nombre || 'Ingrediente'} vence en ${dias} días (${l.fechaVencimiento}).`,
          severidad: 'advertencia',
          fecha: l.fechaVencimiento,
          leida: readNotifIds.has(id),
          moduloDestino: 'lotes',
        });
      }
    });

    return alerts;
  }, [productos, lotes, readNotifIds]);

  const perms = ROLE_PERMISSIONS[currentUser.rol];

  // Handlers
  const handleAddProducto = (prod: Omit<Producto, 'id' | 'ultimaActualizacion'>): boolean => {
    const duplicate = productos.some(
      (p) => p.codigo.toLowerCase() === prod.codigo.toLowerCase()
    );
    if (duplicate) {
      pushToast('error', 'Código duplicado', `Ya existe un producto con el código ${prod.codigo}.`);
      return false;
    }
    const newProd: Producto = {
      ...prod,
      id: `prod-${Date.now()}`,
      ultimaActualizacion: '2026-11-18',
    };
    setProductos((prev) => [newProd, ...prev]);
    logAudit('CREAR_PRODUCTO', 'Inventario', `Registrado ${newProd.codigo} · ${newProd.nombre}`);
    pushToast('exito', 'Producto registrado', `${newProd.nombre} agregado al inventario.`);
    return true;
  };

  const handleUpdateProducto = (updated: Producto): boolean => {
    const duplicate = productos.some(
      (p) => p.id !== updated.id && p.codigo.toLowerCase() === updated.codigo.toLowerCase()
    );
    if (duplicate) {
      pushToast('error', 'Código duplicado', `El código ${updated.codigo} pertenece a otro producto.`);
      return false;
    }
    setProductos((prev) =>
      prev.map((p) =>
        p.id === updated.id ? { ...updated, ultimaActualizacion: '2026-11-18' } : p
      )
    );
    logAudit('EDITAR_PRODUCTO', 'Inventario', `Actualizado ${updated.codigo} · ${updated.nombre}`);
    pushToast('exito', 'Producto actualizado', `Cambios guardados para ${updated.nombre}.`);
    return true;
  };

  const handleDeleteProducto = (id: string) => {
    const target = productos.find((p) => p.id === id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      logAudit('ELIMINAR_PRODUCTO', 'Inventario', `Eliminado ${target.codigo} · ${target.nombre}`);
      pushToast('info', 'Producto eliminado', `${target.nombre} fue retirado del catálogo.`);
    }
  };

  const handleAddCategoria = (cat: Omit<Categoria, 'id'>) => {
    const newCat: Categoria = { ...cat, id: `cat-${Date.now()}` };
    setCategorias((prev) => [...prev, newCat]);
    logAudit('CREAR_CATEGORIA', 'Categorías', `Nueva categoría: ${newCat.nombre}`);
    pushToast('exito', 'Categoría creada', `${newCat.nombre} lista para clasificar productos.`);
  };

  const handleUpdateCategoria = (cat: Categoria) => {
    setCategorias((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
    logAudit('EDITAR_CATEGORIA', 'Categorías', `Editada categoría: ${cat.nombre}`);
    pushToast('exito', 'Categoría actualizada', `Se guardaron los cambios de ${cat.nombre}.`);
  };

  const handleAddProveedor = (prov: Omit<Proveedor, 'id'>): boolean => {
    if (proveedores.some((p) => p.nit.toLowerCase() === prov.nit.toLowerCase())) {
      pushToast('error', 'NIT duplicado', `El NIT ${prov.nit} ya está registrado.`);
      return false;
    }
    const newProv: Proveedor = { ...prov, id: `prov-${Date.now()}` };
    setProveedores((prev) => [newProv, ...prev]);
    logAudit('CREAR_PROVEEDOR', 'Proveedores', `Registrado proveedor ${newProv.nombre}`);
    pushToast('exito', 'Proveedor registrado', `${newProv.nombre} añadido al directorio.`);
    return true;
  };

  const handleUpdateProveedor = (prov: Proveedor): boolean => {
    if (
      proveedores.some(
        (p) => p.id !== prov.id && p.nit.toLowerCase() === prov.nit.toLowerCase()
      )
    ) {
      pushToast('error', 'NIT duplicado', `El NIT ${prov.nit} ya pertenece a otro proveedor.`);
      return false;
    }
    setProveedores((prev) => prev.map((p) => (p.id === prov.id ? prov : p)));
    logAudit('EDITAR_PROVEEDOR', 'Proveedores', `Actualizado proveedor ${prov.nombre}`);
    pushToast('exito', 'Proveedor actualizado', `Datos actualizados para ${prov.nombre}.`);
    return true;
  };

  const handleToggleProveedorEstado = (id: string) => {
    const target = proveedores.find((p) => p.id === id);
    if (!target) return;
    const nextEstado = target.estado === 'Activo' ? 'Inactivo' : 'Activo';
    setProveedores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nextEstado } : p))
    );
    logAudit(
      'CAMBIO_ESTADO_PROVEEDOR',
      'Proveedores',
      `${target.nombre} marcado como ${nextEstado}`
    );
    pushToast('info', 'Estado actualizado', `${target.nombre} ahora está ${nextEstado}.`);
  };

  const handleRegistrarMovimiento = (payload: {
    tipo: TipoMovimiento;
    subtipo: SubtipoMovimiento;
    productoId: string;
    cantidad: number;
    costoUnitarioCOP: number;
    proveedorId?: string;
    observacion: string;
    fecha: string;
    crearLote?: { numeroLote: string; fechaVencimiento: string };
  }): boolean => {
    const prod = productos.find((p) => p.id === payload.productoId);
    if (!prod) return false;

    if (payload.tipo === 'salida' && payload.cantidad > prod.cantidad) {
      pushToast(
        'error',
        'Stock insuficiente',
        `Solo hay ${prod.cantidad} ${prod.unidad} disponibles de ${prod.nombre}.`
      );
      return false;
    }

    if (
      payload.crearLote &&
      lotes.some((l) => l.numeroLote.toLowerCase() === payload.crearLote!.numeroLote.toLowerCase())
    ) {
      pushToast(
        'error',
        'Lote duplicado',
        `El lote ${payload.crearLote.numeroLote} ya existe en el sistema.`
      );
      return false;
    }

    const newQty =
      payload.tipo === 'entrada'
        ? prod.cantidad + payload.cantidad
        : Math.max(0, prod.cantidad - payload.cantidad);

    setProductos((prev) =>
      prev.map((p) =>
        p.id === prod.id
          ? {
              ...p,
              cantidad: newQty,
              precioCompraCOP:
                payload.tipo === 'entrada' && payload.costoUnitarioCOP > 0
                  ? payload.costoUnitarioCOP
                  : p.precioCompraCOP,
              ultimaActualizacion: '2026-11-18',
            }
          : p
      )
    );

    const mov: Movimiento = {
      id: `mov-${Date.now()}`,
      fecha: payload.fecha,
      tipo: payload.tipo,
      subtipo: payload.subtipo,
      proveedorId: payload.proveedorId,
      responsable: currentUser.nombre,
      observacion: payload.observacion,
      totalCOP: payload.cantidad * payload.costoUnitarioCOP,
      detalles: [
        {
          productoId: prod.id,
          cantidad: payload.cantidad,
          costoUnitarioCOP: payload.costoUnitarioCOP,
        },
      ],
    };
    setMovimientos((prev) => [mov, ...prev]);

    if (payload.crearLote) {
      setLotes((prev) => [
        {
          id: `lot-${Date.now()}`,
          numeroLote: payload.crearLote!.numeroLote,
          productoId: prod.id,
          cantidad: payload.cantidad,
          fechaIngreso: payload.fecha.slice(0, 10),
          fechaVencimiento: payload.crearLote!.fechaVencimiento,
          ubicacion: prod.ubicacion,
        },
        ...prev,
      ]);
    }

    logAudit(
      payload.tipo === 'entrada' ? 'REGISTRAR_ENTRADA' : 'REGISTRAR_SALIDA',
      'Movimientos',
      `${payload.subtipo}: ${payload.cantidad} ${prod.unidad} de ${prod.nombre}`
    );

    pushToast(
      'exito',
      payload.tipo === 'entrada' ? 'Entrada registrada' : 'Salida registrada',
      `Stock de ${prod.nombre} actualizado a ${newQty} ${prod.unidad}.`
    );
    return true;
  };

  const handleExecuteReceta = (recetaId: string, cantidadPlatos: number): boolean => {
    const receta = recetas.find((r) => r.id === recetaId);
    if (!receta || cantidadPlatos <= 0) return false;

    // Validate all ingredients first
    for (const ing of receta.ingredientes) {
      const prod = productos.find((p) => p.id === ing.productoId);
      const needed = ing.cantidad * cantidadPlatos;
      if (!prod || prod.cantidad < needed) {
        pushToast(
          'error',
          'Ingredientes insuficientes',
          `No hay suficiente ${prod?.nombre || 'ingrediente'} para preparar ${cantidadPlatos}x ${receta.nombre}.`
        );
        return false;
      }
    }

    // Deduct all ingredients atomically
    let totalCostCOP = 0;
    const detalles = receta.ingredientes.map((ing) => {
      const prod = productos.find((p) => p.id === ing.productoId)!;
      const needed = ing.cantidad * cantidadPlatos;
      totalCostCOP += needed * prod.precioCompraCOP;
      return {
        productoId: prod.id,
        cantidad: needed,
        costoUnitarioCOP: prod.precioCompraCOP,
      };
    });

    setProductos((prev) =>
      prev.map((p) => {
        const match = receta.ingredientes.find((i) => i.productoId === p.id);
        if (!match) return p;
        return {
          ...p,
          cantidad: Math.max(0, p.cantidad - match.cantidad * cantidadPlatos),
          ultimaActualizacion: '2026-11-18',
        };
      })
    );

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    setMovimientos((prev) => [
      {
        id: `mov-${Date.now()}`,
        fecha: `2026-11-18 ${hh}:${mm}`,
        tipo: 'salida',
        subtipo: 'Venta / Receta',
        responsable: currentUser.nombre,
        observacion: `Preparación automática de ${cantidadPlatos}x ${receta.nombre}`,
        totalCOP: totalCostCOP,
        detalles,
      },
      ...prev,
    ]);

    logAudit(
      'EJECUTAR_RECETA',
      'Recetas',
      `Descuento automático por ${cantidadPlatos}x ${receta.nombre}`
    );

    pushToast(
      'exito',
      'Consumo aplicado',
      `Se descontaron los ingredientes de ${cantidadPlatos}x ${receta.nombre}.`
    );
    return true;
  };

  const handleAddReceta = (receta: Omit<Receta, 'id'>) => {
    const newRec: Receta = { ...receta, id: `rec-${Date.now()}` };
    setRecetas((prev) => [newRec, ...prev]);
    logAudit('CREAR_RECETA', 'Recetas', `Nueva receta registrada: ${newRec.nombre}`);
    pushToast('exito', 'Receta guardada', `${newRec.nombre} disponible para cocina.`);
  };

  const handleAddLote = (lote: Omit<Lote, 'id'>): boolean => {
    if (lotes.some((l) => l.numeroLote.toLowerCase() === lote.numeroLote.toLowerCase())) {
      pushToast('error', 'Lote duplicado', `El número ${lote.numeroLote} ya está registrado.`);
      return false;
    }
    const newLote: Lote = { ...lote, id: `lot-${Date.now()}` };
    setLotes((prev) => [newLote, ...prev]);
    logAudit('REGISTRAR_LOTE', 'Lotes', `Creado lote ${newLote.numeroLote}`);
    pushToast('exito', 'Lote registrado', `${newLote.numeroLote} añadido al control.`);
    return true;
  };

  const handleDarDeBajaLote = (loteId: string) => {
    const lote = lotes.find((l) => l.id === loteId);
    if (!lote || lote.dadoDeBaja) return;
    const prod = productos.find((p) => p.id === lote.productoId);

    setLotes((prev) =>
      prev.map((l) => (l.id === loteId ? { ...l, dadoDeBaja: true } : l))
    );

    if (prod && prod.cantidad > 0) {
      const deduct = Math.min(prod.cantidad, lote.cantidad);
      setProductos((prev) =>
        prev.map((p) =>
          p.id === prod.id
            ? { ...p, cantidad: Math.max(0, p.cantidad - deduct), ultimaActualizacion: '2026-11-18' }
            : p
        )
      );
      setMovimientos((prev) => [
        {
          id: `mov-${Date.now()}`,
          fecha: '2026-11-18 11:30',
          tipo: 'salida',
          subtipo: 'Baja por vencimiento',
          responsable: currentUser.nombre,
          observacion: `Baja del lote ${lote.numeroLote} (${lote.fechaVencimiento})`,
          totalCOP: deduct * prod.precioCompraCOP,
          detalles: [
            {
              productoId: prod.id,
              cantidad: deduct,
              costoUnitarioCOP: prod.precioCompraCOP,
            },
          ],
        },
        ...prev,
      ]);
    }

    logAudit('BAJA_LOTE', 'Lotes', `Lote ${lote.numeroLote} dado de baja por vencimiento`);
    pushToast('info', 'Lote dado de baja', `El lote ${lote.numeroLote} fue retirado del stock.`);
  };

  const handleAddUsuario = (user: Omit<Usuario, 'id' | 'ultimoAcceso'>): boolean => {
    if (
      usuarios.some(
        (u) =>
          u.usuario.toLowerCase() === user.usuario.toLowerCase() ||
          u.correo.toLowerCase() === user.correo.toLowerCase()
      )
    ) {
      pushToast('error', 'Usuario duplicado', 'Ya existe una cuenta con ese usuario o correo.');
      return false;
    }
    const newUser: Usuario = {
      ...user,
      id: `usr-${Date.now()}`,
      ultimoAcceso: 'Pendiente primer ingreso',
    };
    setUsuarios((prev) => [...prev, newUser]);
    logAudit('CREAR_USUARIO', 'Usuarios', `Cuenta creada para ${newUser.nombre} (${newUser.rol})`);
    pushToast('exito', 'Usuario creado', `${newUser.nombre} agregado con rol ${newUser.rol}.`);
    return true;
  };

  const handleUpdateRol = (id: string, rol: RolUsuario) => {
    const target = usuarios.find((u) => u.id === id);
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol } : u)));
    if (target) {
      logAudit('CAMBIO_ROL', 'Usuarios', `Rol de ${target.nombre} cambiado a ${rol}`);
      pushToast('info', 'Rol actualizado', `${target.nombre} ahora es ${rol}.`);
    }
  };

  const handleToggleUsuarioEstado = (id: string) => {
    const target = usuarios.find((u) => u.id === id);
    if (!target) return;
    const next = target.estado === 'Activo' ? 'Inactivo' : 'Activo';
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, estado: next } : u)));
    logAudit('ESTADO_USUARIO', 'Usuarios', `Cuenta de ${target.nombre} marcada como ${next}`);
    pushToast('info', 'Estado actualizado', `Cuenta de ${target.nombre}: ${next}.`);
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        usuarios={usuarios}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setActiveSection('inicio');
          pushToast('exito', 'Bienvenido', `Sesión iniciada como ${user.nombre} (${user.rol}).`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0E0E10] text-[#1D1D1F] dark:text-[#F4F4F6]">
      {/* Fixed Horizontal Top Navigation Bar — NO SIDEBAR */}
      <TopNav
        activeSection={activeSection}
        onNavigate={(sec) => {
          if (sec === 'inventario') setInventoryCatFilter('todas');
          setActiveSection(sec);
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        currentUser={currentUser}
        notificaciones={notificaciones}
        onMarkAllRead={() =>
          setReadNotifIds(new Set(notificaciones.map((n) => n.id)))
        }
        onOpenGlobalSearch={() => setSearchOpen(true)}
        onOpenArchitecture={() => setArchitectureOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeSection === 'inicio' && (
              <DashboardView
                productos={productos}
                categorias={categorias}
                movimientos={movimientos}
                lotes={lotes}
                notificaciones={notificaciones}
                canAddProduct={perms.canCreateProduct}
                onNavigate={(sec) => setActiveSection(sec)}
                onOpenAddProduct={() => {
                  setInventoryCatFilter('todas');
                  setActiveSection('inventario');
                  setOpenAddProductTrigger((n) => n + 1);
                }}
                onOpenNewMovement={() => setActiveSection('movimientos')}
              />
            )}

            {activeSection === 'inventario' && (
              <InventoryView
                productos={productos}
                categorias={categorias}
                proveedores={proveedores}
                initialCategoryFilter={inventoryCatFilter}
                openAddTrigger={openAddProductTrigger}
                canCreate={perms.canCreateProduct}
                canEdit={perms.canEditProduct}
                canDelete={perms.canDeleteProduct}
                onAddProducto={handleAddProducto}
                onUpdateProducto={handleUpdateProducto}
                onDeleteProducto={handleDeleteProducto}
              />
            )}

            {activeSection === 'categorias' && (
              <CategoriesView
                categorias={categorias}
                productos={productos}
                canEdit={perms.canCreateProduct}
                onSelectCategoryInventory={(catId) => {
                  setInventoryCatFilter(catId);
                  setActiveSection('inventario');
                }}
                onAddCategoria={handleAddCategoria}
                onUpdateCategoria={handleUpdateCategoria}
              />
            )}

            {activeSection === 'proveedores' && (
              <SuppliersView
                proveedores={proveedores}
                canManage={perms.canManageSuppliers}
                onAddProveedor={handleAddProveedor}
                onUpdateProveedor={handleUpdateProveedor}
                onToggleEstado={handleToggleProveedorEstado}
              />
            )}

            {activeSection === 'movimientos' && (
              <MovementsView
                productos={productos}
                proveedores={proveedores}
                movimientos={movimientos}
                currentUser={currentUser}
                canRegister={perms.canRegisterMovements}
                onRegistrarMovimiento={handleRegistrarMovimiento}
              />
            )}

            {activeSection === 'recetas' && (
              <RecipesView
                recetas={recetas}
                productos={productos}
                canManage={perms.canManageRecipes}
                canExecute={perms.canExecuteRecipes}
                onExecuteReceta={handleExecuteReceta}
                onAddReceta={handleAddReceta}
              />
            )}

            {activeSection === 'lotes' && (
              <BatchesView
                lotes={lotes}
                productos={productos}
                canManage={perms.canManageBatches}
                onAddLote={handleAddLote}
                onDarDeBajaLote={handleDarDeBajaLote}
              />
            )}

            {activeSection === 'reportes' && (
              <ReportsView
                productos={productos}
                categorias={categorias}
                movimientos={movimientos}
                canExport={perms.canExportReports}
              />
            )}

            {activeSection === 'usuarios' && (
              <UsersView
                usuarios={usuarios}
                auditoria={auditoria}
                currentUser={currentUser}
                canManageUsers={perms.canManageUsers}
                onAddUsuario={handleAddUsuario}
                onUpdateRol={handleUpdateRol}
                onToggleUsuarioEstado={handleToggleUsuarioEstado}
                onSwitchSession={(u) => {
                  setCurrentUser(u);
                  pushToast(
                    'info',
                    'Cambio de sesión',
                    `Ahora navegas como ${u.nombre} (${u.rol}).`
                  );
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 px-6 text-xs text-neutral-500 dark:text-neutral-400 no-print">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GAMA · Sistema de Gestión de Inventarios para Restaurante de Comidas Rápidas</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setArchitectureOpen(true)}
              className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors"
            >
              Esquema MySQL (gama_db)
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="hover:text-[#E63946] transition-colors"
            >
              Pantalla de acceso
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        productos={productos}
        proveedores={proveedores}
        recetas={recetas}
        lotes={lotes}
        onNavigate={(sec) => setActiveSection(sec)}
      />

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={currentUser}
      />

      <ArchitectureModal
        open={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
      />

      {/* Toast Feedback Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto p-3.5 rounded-xl bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-neutral-700 shadow-lg flex items-start gap-3"
          >
            {t.tipo === 'exito' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            ) : t.tipo === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#E63946] mt-0.5 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#FF6B35] mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
                {t.titulo}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {t.mensaje}
              </p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
