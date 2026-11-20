@extends('layouts.app')

@section('title', 'Categorías')
@section('page_header', 'Categorías de Inventario')

@section('content')
<div class="row g-3">
    @forelse($categorias as $cat)
    <div class="col-md-6 col-lg-3">
        <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <div class="rounded-3 p-3 me-3 text-white" style="background-color: {{ $cat->color }};">
                        <i class="bi {{ $cat->icono }} fs-4"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-0">{{ $cat->nombre }}</h6>
                        <small class="text-muted">{{ $cat->productos_count ?? 0 }} productos</small>
                    </div>
                </div>
                <p class="text-muted small mb-0">{{ $cat->descripcion }}</p>
            </div>
            <div class="card-footer bg-light border-0 py-2 text-end">
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
