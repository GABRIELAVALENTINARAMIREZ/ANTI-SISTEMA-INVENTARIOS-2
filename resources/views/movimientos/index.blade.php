@extends('layouts.app')

@section('title', 'Kardex de Movimientos')
@section('page_header', 'Historial de Entradas, Salidas y Mermas')

@section('content')
<div class="card shadow-sm border-0">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h6 class="mb-0 fw-bold"><i class="bi bi-arrow-left-right me-2 text-danger"></i>Registro de Kardex</h6>
        <span class="badge bg-secondary">{{ $movimientos->count() }} operaciones</span>
    </div>
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
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
                    <td><code>#{{ $m->id_movimiento }}</code></td>
                    <td class="small">{{ $m->fecha ? $m->fecha->format('d/m/Y H:i') : '' }}</td>
                    <td>
                        @if($m->tipo == 'entrada')
                            <span class="badge bg-success-subtle text-success border border-success-subtle">Entrada</span>
                        @else
                            <span class="badge bg-danger-subtle text-danger border border-danger-subtle">Salida</span>
                        @endif
                    </td>
                    <td><strong>{{ $m->subtipo }}</strong></td>
                    <td class="small">{{ $m->proveedor?->nombre ?? 'Uso Interno' }}</td>
                    <td class="small">{{ $m->usuario?->nombre }}</td>
                    <td class="small text-muted">{{ $m->observacion }}</td>
                    <td class="text-end fw-bold">${{ number_format($m->total_cop, 0, ',', '.') }}</td>
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
