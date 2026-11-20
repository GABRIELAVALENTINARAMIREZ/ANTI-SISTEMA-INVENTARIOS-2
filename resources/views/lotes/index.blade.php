@extends('layouts.app')

@section('title', 'Control de Lotes')
@section('page_header', 'Trazabilidad y Fechas de Vencimiento de Lotes')

@section('content')
<div class="card shadow-sm border-0">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h6 class="mb-0 fw-bold"><i class="bi bi-calendar-check me-2 text-danger"></i>Lotes Registrados</h6>
        <span class="badge bg-secondary">{{ $lotes->count() }} lotes</span>
    </div>
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>Nº Lote</th>
                    <th>Producto</th>
                    <th>Ubicación</th>
                    <th>Cantidad</th>
                    <th>Fecha Ingreso</th>
                    <th>Fecha Vencimiento</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                @forelse($lotes as $l)
                <tr>
                    <td><code>{{ $l->numero_lote }}</code></td>
                    <td><strong>{{ $l->producto?->nombre }}</strong></td>
                    <td class="small">{{ $l->ubicacion?->nombre ?? 'N/A' }}</td>
                    <td class="fw-semibold">{{ $l->cantidad }} {{ $l->producto?->unidad_medida }}</td>
                    <td class="small">{{ $l->fecha_ingreso ? $l->fecha_ingreso->format('d/m/Y') : '' }}</td>
                    <td class="small">{{ $l->fecha_vencimiento ? $l->fecha_vencimiento->format('d/m/Y') : '' }}</td>
                    <td>
                        @php $estado = $l->estado; @endphp
                        @if($estado == 'vencido')
                            <span class="badge bg-danger">Vencido</span>
                        @elseif($estado == 'proximo_vencer')
                            <span class="badge bg-warning text-dark">Próximo a Vencer</span>
                        @else
                            <span class="badge bg-success">Vigente</span>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="text-center py-5 text-muted">
                        No hay lotes registrados actualmente.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
