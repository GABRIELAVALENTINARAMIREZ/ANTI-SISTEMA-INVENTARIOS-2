@extends('layouts.app')

@section('title', 'Proveedores')
@section('page_header', 'Directorio de Proveedores')

@section('content')
<div class="row g-3">
    @forelse($proveedores as $prov)
    <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold text-dark mb-0">{{ $prov->nombre }}</h6>
                    <span class="badge {{ $prov->estado == 'Activo' ? 'bg-success' : 'bg-secondary' }}">
                        {{ $prov->estado }}
                    </span>
                </div>
                <div class="text-muted small mb-3">NIT: <code>{{ $prov->nit }}</code></div>
                
                <div class="small mb-1"><i class="bi bi-telephone me-2 text-danger"></i>{{ $prov->telefono ?? 'Sin teléfono' }}</div>
                <div class="small mb-1"><i class="bi bi-envelope me-2 text-danger"></i>{{ $prov->correo ?? 'Sin correo' }}</div>
                <div class="small mb-3"><i class="bi bi-geo-alt me-2 text-danger"></i>{{ $prov->direccion ?? 'Sin dirección' }}</div>

                <div class="border-top pt-2">
                    <small class="text-muted d-block mb-1 fw-semibold">Suministros frecuentes:</small>
                    @if(is_array($prov->productos_suministrados))
                        @foreach($prov->productos_suministrados as $prod)
                            <span class="badge bg-light text-secondary border me-1 mb-1">{{ $prod }}</span>
                        @endforeach
                    @else
                        <small class="text-muted">Insumos varios de restaurante</small>
                    @endif
                </div>
            </div>
            <div class="card-footer bg-white border-0 py-2 d-flex justify-content-between align-items-center">
                <small class="text-muted">{{ $prov->productos_count ?? 0 }} productos vinculados</small>
                <a href="{{ route('inventario.index') }}" class="btn btn-sm btn-outline-primary">Ver catálogo</a>
            </div>
        </div>
    </div>
    @empty
    <div class="col-12 text-center py-5 text-muted">
        <i class="bi bi-truck fs-2 d-block mb-2"></i>
        No hay proveedores registrados en la base de datos.
    </div>
    @endforelse
</div>
@endsection
