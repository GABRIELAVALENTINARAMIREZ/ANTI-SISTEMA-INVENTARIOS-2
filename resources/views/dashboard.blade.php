@extends('layouts.app')

@section('title', 'Dashboard')
@section('page_header', 'Resumen General del Inventario')

@section('content')
<!-- Fila de Tarjetas de Métricas (Specimen Density & Display Typography) -->
<div class="row g-3 mb-4">
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="card card-stat p-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="stat-metric-label">Total Productos</div>
                    <div class="stat-metric-number">{{ $totalProductos }}</div>
                    <small class="text-success fw-semibold"><i class="bi bi-tags"></i> En {{ $totalCategorias }} categorías</small>
                </div>
                <div class="specimen-stamp-box p-3 bg-primary bg-opacity-10 text-primary fs-3" style="width: 52px; height: 52px; border-radius: var(--radius-stamps);">
                    <i class="bi bi-box-seam"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="card card-stat p-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="stat-metric-label">Bajo Stock</div>
                    <div class="stat-metric-number text-warning">{{ $bajoStockCount }}</div>
                    <small class="text-muted">Requieren reorden</small>
                </div>
                <div class="specimen-stamp-box p-3 bg-warning bg-opacity-10 text-warning fs-3" style="width: 52px; height: 52px; border-radius: var(--radius-stamps);">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="card card-stat p-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="stat-metric-label">Agotados</div>
                    <div class="stat-metric-number text-danger">{{ $agotadosCount }}</div>
                    <small class="text-danger fw-semibold">Crítico para recetas</small>
                </div>
                <div class="specimen-stamp-box p-3 bg-danger bg-opacity-10 text-danger fs-3" style="width: 52px; height: 52px; border-radius: var(--radius-stamps);">
                    <i class="bi bi-x-circle"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="card card-stat p-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="stat-metric-label">Lotes por Vencer</div>
                    <div class="stat-metric-number text-info">{{ $lotesProximos->count() }}</div>
                    <small class="text-muted">En los próximos 5 días</small>
                </div>
                <div class="specimen-stamp-box p-3 bg-info bg-opacity-10 text-info fs-3" style="width: 52px; height: 52px; border-radius: var(--radius-stamps);">
                    <i class="bi bi-calendar2-event"></i>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row g-3">
    <!-- Movimientos Recientes (Tabla estilo Specimen) -->
    <div class="col-lg-8">
        <div class="card">
            <div class="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0"><i class="bi bi-clock-history me-2 text-danger"></i>Movimientos Recientes de Kardex</h6>
                <a href="{{ route('movimientos.index') }}" class="btn btn-sm btn-outline-danger">Ver todos</a>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead>
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
                                <td class="text-muted" style="font-size: 12px;">{{ $mov->fecha ? $mov->fecha->format('d/m/Y H:i') : 'Reciente' }}</td>
                                <td>
                                    @if($mov->tipo == 'entrada')
                                        <span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-arrow-down-left"></i> Entrada</span>
                                    @else
                                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="bi bi-arrow-up-right"></i> Salida</span>
                                    @endif
                                </td>
                                <td><strong>{{ $mov->subtipo }}</strong></td>
                                <td class="text-muted" style="font-size: 13px;">{{ $mov->usuario?->nombre ?? 'Sistema' }}</td>
                                <td class="text-end fw-bold" style="font-family: var(--font-display); font-size: 15px;">${{ number_format($mov->total_cop, 0, ',', '.') }}</td>
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

    <!-- Acciones Rápidas y Alertas -->
    <div class="col-lg-4">
        <div class="card mb-3">
            <div class="card-header py-3">
                <h6 class="mb-0"><i class="bi bi-lightning-charge-fill me-2 text-warning"></i>Acciones Rápidas</h6>
            </div>
            <div class="card-body d-grid gap-2">
                <a href="{{ route('inventario.index') }}" class="btn btn-outline-primary text-start">
                    <i class="bi bi-plus-circle me-2"></i> Consultar / Registrar Productos
                </a>
                <a href="{{ route('movimientos.index') }}" class="btn btn-outline-success text-start" style="color: var(--gama-success) !important; border-color: var(--gama-success) !important;">
                    <i class="bi bi-box-arrow-in-down me-2"></i> Registrar Entrada de Mercancía
                </a>
                <a href="{{ route('recetas.index') }}" class="btn btn-outline-danger text-start">
                    <i class="bi bi-fire me-2"></i> Descontar por Preparación de Receta
                </a>
                <a href="{{ route('reportes.index') }}" class="btn btn-outline-dark text-start" style="border-radius: var(--radius-buttons);">
                    <i class="bi bi-file-earmark-bar-graph me-2"></i> Exportar Informes de Stock
                </a>
            </div>
        </div>

        <div class="card">
            <div class="card-header py-3">
                <h6 class="mb-0"><i class="bi bi-bell-fill me-2 text-info"></i>Alertas de Lotes</h6>
            </div>
            <div class="card-body p-3">
                @forelse($lotesProximos as $lote)
                <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom" style="border-color: var(--gama-border-hairline) !important;">
                    <div>
                        <div class="fw-semibold" style="font-size: 13px;">{{ $lote->producto?->nombre ?? 'Lote '.$lote->numero_lote }}</div>
                        <small class="text-muted" style="font-size: 11px;">Vence: {{ $lote->fecha_vencimiento->format('d/m/Y') }}</small>
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
