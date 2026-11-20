@extends('layouts.app')

@section('title', 'Dashboard')
@section('page_header', 'Resumen General del Inventario')

@section('content')
<div class="row g-3 mb-4">
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="card card-stat shadow-sm p-3 bg-white">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="text-muted small text-uppercase fw-semibold">Total Productos</span>
                    <h3 class="fw-bold mb-0 mt-1">{{ $totalProductos }}</h3>
                    <small class="text-success"><i class="bi bi-tags"></i> En {{ $totalCategorias }} categorías</small>
                </div>
                <div class="rounded-3 p-3 bg-primary bg-opacity-10 text-primary fs-3">
                    <i class="bi bi-box-seam"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="card card-stat shadow-sm p-3 bg-white">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="text-muted small text-uppercase fw-semibold">Bajo Stock</span>
                    <h3 class="fw-bold mb-0 mt-1 text-warning">{{ $bajoStockCount }}</h3>
                    <small class="text-muted">Requieren reorden</small>
                </div>
                <div class="rounded-3 p-3 bg-warning bg-opacity-10 text-warning fs-3">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="card card-stat shadow-sm p-3 bg-white">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="text-muted small text-uppercase fw-semibold">Agotados</span>
                    <h3 class="fw-bold mb-0 mt-1 text-danger">{{ $agotadosCount }}</h3>
                    <small class="text-danger fw-semibold">Crítico para recetas</small>
                </div>
                <div class="rounded-3 p-3 bg-danger bg-opacity-10 text-danger fs-3">
                    <i class="bi bi-x-circle"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="card card-stat shadow-sm p-3 bg-white">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="text-muted small text-uppercase fw-semibold">Lotes por Vencer</span>
                    <h3 class="fw-bold mb-0 mt-1 text-info">{{ $lotesProximos->count() }}</h3>
                    <small class="text-muted">En los próximos 5 días</small>
                </div>
                <div class="rounded-3 p-3 bg-info bg-opacity-10 text-info fs-3">
                    <i class="bi bi-calendar2-event"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row g-3">
    <!-- Movimientos Recientes -->
    <div class="col-lg-8">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-clock-history me-2 text-danger"></i>Movimientos Recientes de Kardex</h6>
                <a href="{{ route('movimientos.index') }}" class="btn btn-sm btn-outline-danger">Ver todos</a>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Subtipo</th>
                                <th>Responsable</th>
                                <th class="text-end">Total (COP)</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($movimientosRecientes as $mov)
                            <tr>
                                <td class="small">{{ $mov->fecha ? $mov->fecha->format('d/m/Y H:i') : 'Reciente' }}</td>
                                <td>
                                    @if($mov->tipo == 'entrada')
                                        <span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-arrow-down-left"></i> Entrada</span>
                                    @else
                                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="bi bi-arrow-up-right"></i> Salida</span>
                                    @endif
                                </td>
                                <td>{{ $mov->subtipo }}</td>
                                <td class="small text-muted">{{ $mov->usuario?->nombre ?? 'Sistema' }}</td>
                                <td class="text-end fw-semibold">${{ number_format($mov->total_cop, 0, ',', '.') }}</td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="5" class="text-center py-4 text-muted">
                                    <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                                    No hay movimientos recientes registrados aún en MySQL.
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Alertas y Accesos Rápidos -->
    <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-3">
            <div class="card-header bg-white py-3">
                <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-lightning-charge-fill me-2 text-warning"></i>Acciones Rápidas</h6>
            </div>
            <div class="card-body d-grid gap-2">
                <a href="{{ route('inventario.index') }}" class="btn btn-outline-primary text-start">
                    <i class="bi bi-plus-circle me-2"></i> Consultar / Registrar Productos
                </a>
                <a href="{{ route('movimientos.index') }}" class="btn btn-outline-success text-start">
                    <i class="bi bi-box-arrow-in-down me-2"></i> Registrar Entrada de Mercancía
                </a>
                <a href="{{ route('recetas.index') }}" class="btn btn-outline-danger text-start">
                    <i class="bi bi-fire me-2"></i> Descontar por Preparación de Receta
                </a>
                <a href="{{ route('reportes.index') }}" class="btn btn-outline-dark text-start">
                    <i class="bi bi-file-earmark-bar-graph me-2"></i> Exportar Informes de Stock
                </a>
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-header bg-white py-3">
                <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-bell-fill me-2 text-info"></i>Alertas de Lotes</h6>
            </div>
            <div class="card-body p-3">
                @forelse($lotesProximos as $lote)
                <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div>
                        <div class="fw-semibold small">{{ $lote->producto?->nombre ?? 'Lote '.$lote->numero_lote }}</div>
                        <small class="text-muted">Vence: {{ $lote->fecha_vencimiento->format('d/m/Y') }}</small>
                    </div>
                    <span class="badge bg-warning text-dark">{{ $lote->cantidad }} {{ $lote->producto?->unidad_medida }}</span>
                </div>
                @empty
                <div class="text-center text-muted small py-3">
                    <i class="bi bi-check-circle text-success fs-4 d-block mb-1"></i>
                    Todos los lotes están dentro de fechas vigentes.
                </div>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection
