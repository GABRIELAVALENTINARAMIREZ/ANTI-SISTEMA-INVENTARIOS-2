@extends('layouts.app')

@section('title', 'Categorías')
@section('page_header', 'Categorías de Inventario')

@section('content')
<div class="row g-3">
    @forelse($categorias as $cat)
    <div class="col-md-6 col-lg-3">
        <div class="card h-100">
            <div class="card-body p-3">
                <div class="d-flex align-items-center mb-3">
                    <div class="specimen-stamp-box p-3 me-3 text-white" style="width: 48px; height: 48px; background-color: {{ $cat->color }}; border-radius: var(--radius-stamps) !important;">
                        <i class="bi {{ $cat->icono }} fs-4"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-0" style="font-family: var(--font-display); font-size: 17px; text-transform: uppercase;">{{ $cat->nombre }}</h6>
                        <small class="text-muted" style="font-size: 11px; font-weight: 600;">{{ $cat->productos_count ?? 0 }} PRODUCTOS</small>
                    </div>
                </div>
                <p class="text-muted mb-0" style="font-size: 12px; line-height: 1.4;">{{ $cat->descripcion }}</p>
            </div>
            <div class="card-footer py-2 text-end">
                <a href="{{ route('inventario.index', ['categoria' => $cat->id_categoria]) }}" class="btn btn-sm btn-outline-danger">
                    Ver productos <i class="bi bi-arrow-right"></i>
                </a>
            </div>
        </div>
    </div>
    @empty
    <div class="col-12 text-center py-5 text-muted">
        <i class="bi bi-tag fs-2 d-block mb-2"></i>
        No hay categorías registradas aún.
    </div>
    @endforelse
</div>
@endsection
