@extends('layouts.app')

@section('title', 'Recetas y Menú')
@section('page_header', 'Escandallo y Recetas del Menú')

@section('content')
<div class="row g-3">
    @forelse($recetas as $rec)
    <div class="col-md-6 col-lg-4">
        <div class="card h-100">
            <div class="card-header py-3 d-flex justify-content-between align-items-center">
                <span class="badge bg-danger">{{ $rec->categoria_menu }}</span>
                <small class="text-muted fw-semibold" style="font-size: 11px;"><i class="bi bi-clock me-1"></i>{{ $rec->tiempo_preparacion_min }} MIN</small>
            </div>
            <div class="card-body p-3">
                <h5 class="fw-bold mb-1" style="font-family: var(--font-display); font-size: 20px; text-transform: uppercase;">{{ $rec->nombre }}</h5>
                <h6 class="text-success fw-bold mb-3" style="font-family: var(--font-display); font-size: 17px;">${{ number_format($rec->precio_venta, 0, ',', '.') }} COP</h6>
                
                <h6 class="small fw-bold text-uppercase text-muted border-bottom pb-1" style="font-size: 10px; letter-spacing: 0.05em; border-color: var(--gama-border-hairline) !important;">Ingredientes requeridos:</h6>
                <ul class="list-unstyled mb-0" style="font-size: 12px;">
                    @forelse($rec->ingredientes as $ing)
                    <li class="d-flex justify-content-between py-1 border-bottom" style="border-color: var(--gama-border-hairline) !important;">
                        <span>{{ $ing->producto?->nombre }}</span>
                        <span class="badge bg-light text-dark border" style="font-size: 10px !important;">{{ $ing->cantidad }} {{ $ing->producto?->unidad_medida }}</span>
                    </li>
                    @empty
                    <li class="text-muted py-1">Sin ingredientes configurados</li>
                    @endforelse
                </ul>
            </div>
            <div class="card-footer py-2">
                <button class="btn btn-sm btn-outline-danger w-100"><i class="bi bi-fire me-1"></i> Descontar del inventario</button>
            </div>
        </div>
    </div>
    @empty
    <div class="col-12 text-center py-5 text-muted">
        <i class="bi bi-journal-x fs-2 d-block mb-2"></i>
        No hay recetas configuradas.
    </div>
    @endforelse
</div>
@endsection
