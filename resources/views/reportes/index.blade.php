@extends('layouts.app')

@section('title', 'Reportes')
@section('page_header', 'Métricas de Existencias y Valoración')

@section('content')
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="card p-3 bg-primary text-white" style="border: 1px solid var(--gama-info) !important;">
            <span class="text-white-50 text-uppercase" style="font-size: 11px; font-weight: 700; letter-spacing: 0.06em;">Valor Total del Inventario</span>
            <h2 class="fw-bold mt-1 mb-0" style="font-family: var(--font-display); font-size: 32px;">${{ number_format($valorInventario, 0, ',', '.') }} COP</h2>
            <small class="text-white-50 mt-1" style="font-size: 11px;">Costo ponderado de insumos en bodega</small>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card p-3 bg-dark text-white" style="border: 1px solid #334155 !important;">
            <span class="text-white-50 text-uppercase" style="font-size: 11px; font-weight: 700; letter-spacing: 0.06em;">Total de Unidades / Insumos</span>
            <h2 class="fw-bold mt-1 mb-0" style="font-family: var(--font-display); font-size: 32px;">{{ number_format($totalItems, 0, ',', '.') }}</h2>
            <small class="text-white-50 mt-1" style="font-size: 11px;">Suma global de existencias registradas</small>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header py-3">
        <h6 class="mb-0"><i class="bi bi-exclamation-octagon me-2 text-warning"></i>Insumos Críticos Bajo Stock Mínimo</h6>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Stock Actual</th>
                        <th>Stock Mínimo</th>
                        <th>Déficit</th>
                        <th>Acción Sugerida</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($productosBajoStock as $p)
                    <tr>
                        <td><strong style="font-size: 14px;">{{ $p->nombre }}</strong></td>
                        <td class="text-danger fw-bold" style="font-family: var(--font-display); font-size: 15px;">{{ $p->cantidad }} {{ $p->unidad_medida }}</td>
                        <td class="text-muted" style="font-size: 13px;">{{ $p->stock_minimo }} {{ $p->unidad_medida }}</td>
                        <td><span class="badge bg-danger">{{ $p->stock_minimo - $p->cantidad }} faltantes</span></td>
                        <td>
                            <a href="{{ route('movimientos.index') }}" class="btn btn-sm btn-outline-success" style="color: var(--gama-success) !important; border-color: var(--gama-success) !important;">Generar Orden Compra</a>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="text-center py-4 text-muted">
                            <i class="bi bi-shield-check text-success fs-3 d-block mb-1"></i>
                            No hay productos en estado crítico de stock.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
