@extends('layouts.app')

@section('title', 'Recetas y Menú')
@section('page_header', 'Escandallo y Recetas del Menú')

@section('content')
<div class="row g-3">
    @forelse($recetas as $rec)
    <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <span class="badge bg-danger">{{ $rec->categoria_menu }}</span>
                <small class="text-muted"><i class="bi bi-clock me-1"></i>{{ $rec->tiempo_preparacion_min }} min</small>
            </div>
            <div class="card-body">
                <h5 class="fw-bold mb-2">{{ $rec->nombre }}</h5>
                <h6 class="text-success fw-bold mb-3">${{ number_format($rec->precio_venta, 0, ',', '.') }} COP</h6>
                
                <h6 class="small fw-bold text-uppercase text-muted border-bottom pb-1">Ingredientes requeridos:</h6>
                <ul class="list-unstyled small mb-0">
                    @forelse($rec->ingredientes as $ing)
                    <li class="d-flex justify-content-between py-1 border-bottom border-light">
                        <span>{{ $ing->producto?->nombre }}</span>
                        <span class="badge bg-light text-dark">{{ $ing->cantidad }} {{ $ing->producto?->unidad_medida }}</span>
                    </li>
                    @empty
                    <li class="text-muted">Sin ingredientes configurados</li>
                    @endforelse
                </ul>
            </div>
            <div class="card-footer bg-light border-0 py-2">
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
