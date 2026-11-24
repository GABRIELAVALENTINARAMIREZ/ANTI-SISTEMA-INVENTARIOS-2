@extends('layouts.app')

@section('title', 'Kardex de Movimientos')
@section('page_header', 'Historial de Entradas, Salidas y Mermas')

@section('content')
<div class="card">
    <div class="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 class="mb-0"><i class="bi bi-arrow-left-right me-2 text-danger"></i>Registro de Kardex</h6>
        <span class="badge bg-secondary">{{ $movimientos->count() }} operaciones</span>
    </div>
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Motivo / Subtipo</th>
                    <th>Tercero / Proveedor</th>
                    <th>Responsable</th>
                    <th>Observaciones</th>
                    <th class="text-end">Total (COP)</th>
                </tr>
            </thead>
            <tbody>
                @forelse($movimientos as $m)
                <tr>
                    <td><code style="font-size: 12px; background-color: var(--gama-bg-canvas); padding: 2px 6px; border-radius: var(--radius-badges); border: 1px solid var(--gama-border-hairline);">#{{ $m->id_movimiento }}</code></td>
                    <td class="text-muted" style="font-size: 12px;">{{ $m->fecha ? $m->fecha->format('d/m/Y H:i') : '' }}</td>
                    <td>
                        @if($m->tipo == 'entrada')
                            <span class="badge bg-success-subtle text-success border border-success-subtle">Entrada</span>
                        @else
                            <span class="badge bg-danger-subtle text-danger border border-danger-subtle">Salida</span>
                        @endif
                    </td>
                    <td><strong style="font-size: 13px;">{{ $m->subtipo }}</strong></td>
                    <td class="text-muted" style="font-size: 12px;">{{ $m->proveedor?->nombre ?? 'Uso Interno' }}</td>
                    <td class="text-muted" style="font-size: 12px;">{{ $m->usuario?->nombre }}</td>
                    <td class="text-muted" style="font-size: 12px;">{{ $m->observacion }}</td>
                    <td class="text-end fw-bold" style="font-family: var(--font-display); font-size: 15px;">${{ number_format($m->total_cop, 0, ',', '.') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="text-center py-5 text-muted">
                        No hay movimientos de inventario registrados.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
