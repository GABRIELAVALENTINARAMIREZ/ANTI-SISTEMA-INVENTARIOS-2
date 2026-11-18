import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { EstadoLote, EstadoProducto } from '../types';

export const ProductStatusBadge: React.FC<{ estado: EstadoProducto }> = ({ estado }) => {
  if (estado === 'disponible') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60 whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        Disponible
      </span>
    );
  }
  if (estado === 'bajo_stock') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60 whitespace-nowrap">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        Bajo stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-[#E63946] border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800/60 whitespace-nowrap">
      <XCircle className="w-3.5 h-3.5 text-[#E63946] dark:text-red-400 shrink-0" />
      Agotado
    </span>
  );
};

export const BatchStatusBadge: React.FC<{ estado: EstadoLote; dadoDeBaja?: boolean }> = ({
  estado,
  dadoDeBaja,
}) => {
  if (dadoDeBaja) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 whitespace-nowrap">
        <XCircle className="w-3.5 h-3.5 shrink-0" />
        Dado de baja
      </span>
    );
  }
  if (estado === 'vigente') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60 whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        Vigente
      </span>
    );
  }
  if (estado === 'proximo_vencer') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60 whitespace-nowrap">
        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        Próximo a vencer
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-[#E63946] border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800/60 whitespace-nowrap">
      <XCircle className="w-3.5 h-3.5 text-[#E63946] dark:text-red-400 shrink-0" />
      Vencido
    </span>
  );
};
