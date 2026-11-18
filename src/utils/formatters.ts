import { EstadoLote, EstadoProducto, Producto, RolUsuario } from '../types';

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 2,
  }).format(value);
}

export function getEstadoProducto(producto: Pick<Producto, 'cantidad' | 'stockMinimo'>): EstadoProducto {
  if (producto.cantidad <= 0) return 'agotado';
  if (producto.cantidad <= producto.stockMinimo) return 'bajo_stock';
  return 'disponible';
}

export function getDiasParaVencer(fechaVencimiento: string, referenceDate = '2026-11-18'): number {
  const ref = new Date(referenceDate + 'T00:00:00');
  const exp = new Date(fechaVencimiento + 'T00:00:00');
  const diffMs = exp.getTime() - ref.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getEstadoLote(fechaVencimiento: string, referenceDate = '2026-11-18'): EstadoLote {
  const days = getDiasParaVencer(fechaVencimiento, referenceDate);
  if (days < 0) return 'vencido';
  if (days <= 7) return 'proximo_vencer';
  return 'vigente';
}

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvContent =
    '\uFEFF' +
    [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadTextFile(filename: string, content: string, mime = 'text/sql;charset=utf-8'): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const ROLE_PERMISSIONS: Record<
  RolUsuario,
  {
    canCreateProduct: boolean;
    canEditProduct: boolean;
    canDeleteProduct: boolean;
    canManageSuppliers: boolean;
    canRegisterMovements: boolean;
    canManageRecipes: boolean;
    canExecuteRecipes: boolean;
    canManageBatches: boolean;
    canExportReports: boolean;
    canManageUsers: boolean;
  }
> = {
  Administrador: {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: true,
    canManageSuppliers: true,
    canRegisterMovements: true,
    canManageRecipes: true,
    canExecuteRecipes: true,
    canManageBatches: true,
    canExportReports: true,
    canManageUsers: true,
  },
  'Encargado de inventario': {
    canCreateProduct: true,
    canEditProduct: true,
    canDeleteProduct: false,
    canManageSuppliers: true,
    canRegisterMovements: true,
    canManageRecipes: true,
    canExecuteRecipes: true,
    canManageBatches: true,
    canExportReports: true,
    canManageUsers: false,
  },
  Empleado: {
    canCreateProduct: false,
    canEditProduct: false,
    canDeleteProduct: false,
    canManageSuppliers: false,
    canRegisterMovements: true,
    canManageRecipes: false,
    canExecuteRecipes: true,
    canManageBatches: false,
    canExportReports: false,
    canManageUsers: false,
  },
};
