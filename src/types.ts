export type NavSection =
  | 'inicio'
  | 'inventario'
  | 'categorias'
  | 'proveedores'
  | 'movimientos'
  | 'recetas'
  | 'lotes'
  | 'reportes'
  | 'usuarios';

export type RolUsuario = 'Administrador' | 'Encargado de inventario' | 'Empleado';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  usuario: string;
  rol: RolUsuario;
  estado: 'Activo' | 'Inactivo';
  avatar?: string;
  ultimoAcceso: string;
}

export type EstadoProducto = 'disponible' | 'bajo_stock' | 'agotado';

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  nit: string;
  telefono: string;
  correo: string;
  direccion: string;
  productosSuministrados: string[];
  estado: 'Activo' | 'Inactivo';
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  imagen: string;
  categoriaId: string;
  cantidad: number;
  unidad: string;
  stockMinimo: number;
  precioCompraCOP: number;
  proveedorId: string;
  ubicacion: string;
  ultimaActualizacion: string;
}

export type TipoMovimiento = 'entrada' | 'salida';
export type SubtipoMovimiento =
  | 'Compra a proveedor'
  | 'Consumo en cocina'
  | 'Venta / Receta'
  | 'Pérdida / Desperdicio'
  | 'Ajuste autorizado'
  | 'Baja por vencimiento';

export interface DetalleMovimiento {
  productoId: string;
  cantidad: number;
  costoUnitarioCOP: number;
}

export interface Movimiento {
  id: string;
  fecha: string;
  tipo: TipoMovimiento;
  subtipo: SubtipoMovimiento;
  proveedorId?: string;
  responsable: string;
  observacion: string;
  totalCOP: number;
  detalles: DetalleMovimiento[];
}

export interface DetalleReceta {
  productoId: string;
  cantidad: number;
  unidadEtiqueta: string;
}

export interface Receta {
  id: string;
  nombre: string;
  categoriaMenu: string;
  precioVentaCOP: number;
  tiempoPreparacionMin: number;
  imagen: string;
  ingredientes: DetalleReceta[];
}

export type EstadoLote = 'vigente' | 'proximo_vencer' | 'vencido';

export interface Lote {
  id: string;
  numeroLote: string;
  productoId: string;
  cantidad: number;
  fechaIngreso: string;
  fechaVencimiento: string;
  ubicacion: string;
  dadoDeBaja?: boolean;
}

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  severidad: 'critica' | 'advertencia' | 'info';
  fecha: string;
  leida: boolean;
  moduloDestino: NavSection;
}

export interface RegistroAuditoria {
  id: string;
  fecha: string;
  usuario: string;
  rol: RolUsuario;
  accion: string;
  modulo: string;
  detalle: string;
}

export interface ToastMessage {
  id: string;
  tipo: 'exito' | 'error' | 'info';
  titulo: string;
  mensaje: string;
}
