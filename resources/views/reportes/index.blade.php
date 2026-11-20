@extends('layouts.app')

@section('title', 'Reportes')
@section('page_header', 'Métricas de Existencias y Valoración')

@section('content')
<div class="row g-3 mb-4">
    <div class="col-md-6">
        <div class="card shadow-sm border-0 bg-primary text-white p-3">
            <span class="text-white-50 text-uppercase small">Valor Total del Inventario</span>
            <h2 class="fw-bold mt-1 mb-0">${{ number_format($valorInventario, 0, ',', '.') }} COP</h2>
            <small class="text-white-50 mt-1">Costo ponderado de insumos en bodega</small>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card shadow-sm border-0 bg-dark text-white p-3">
            <span class="text-white-50 text-uppercase small">Total de Unidades / Insumos</span>
            <h2 class="fw-bold mt-1 mb-0">{{ number_format($totalItems, 0, ',', '.') }}</h2>
            <small class="text-white-50 mt-1">Suma global de existencias registradas</small>
        </div>
    </div>
</div>

<div class="card shadow-sm border-0">
    <div class="card-header bg-white py-3">
        <h6 class="mb-0 fw-bold"><i class="bi bi-exclamation-octagon me-2 text-warning"></i>Insumos Críticos Bajo Stock Mínimo</h6>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
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
                        <td><strong>{{ $p->nombre }}</strong></td>
                        <td class="text-danger fw-bold">{{ $p->cantidad }} {{ $p->unidad_medida }}</td>
                        <td>{{ $p->stock_minimo }} {{ $p->unidad_medida }}</td>
                        <td><span class="badge bg-danger">{{ $p->stock_minimo - $p->cantidad }} faltantes</span></td>
                        <td>
                            <a href="{{ route('movimientos.index') }}" class="btn btn-sm btn-outline-success">Generar Orden Compra</a>
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
