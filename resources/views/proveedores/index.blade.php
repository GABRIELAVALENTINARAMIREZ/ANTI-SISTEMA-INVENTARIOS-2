@extends('layouts.app')

@section('title', 'Proveedores')
@section('page_header', 'Directorio de Proveedores')

@section('content')
<div class="row g-3">
    @forelse($proveedores as $prov)
    <div class="col-md-6 col-lg-4">
        <div class="card h-100">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0" style="font-family: var(--font-display); font-size: 18px; text-transform: uppercase;">{{ $prov->nombre }}</h6>
                    <span class="badge {{ $prov->estado == 'Activo' ? 'bg-success' : 'bg-secondary' }}">
                        {{ $prov->estado }}
                    </span>
                </div>
                <div class="text-muted small mb-3">NIT: <code style="background-color: var(--gama-bg-canvas); padding: 1px 5px; border-radius: var(--radius-badges); border: 1px solid var(--gama-border-hairline);">{{ $prov->nit }}</code></div>
                
                <div class="small mb-1" style="font-size: 12px;"><i class="bi bi-telephone me-2 text-danger"></i>{{ $prov->telefono ?? 'Sin teléfono' }}</div>
                <div class="small mb-1" style="font-size: 12px;"><i class="bi bi-envelope me-2 text-danger"></i>{{ $prov->correo ?? 'Sin correo' }}</div>
                <div class="small mb-3" style="font-size: 12px;"><i class="bi bi-geo-alt me-2 text-danger"></i>{{ $prov->direccion ?? 'Sin dirección' }}</div>

                <div class="border-top pt-2" style="border-color: var(--gama-border-hairline) !important;">
                    <small class="text-muted d-block mb-1 fw-bold text-uppercase" style="font-size: 10px; letter-spacing: 0.05em;">Suministros frecuentes:</small>
                    @if(is_array($prov->productos_suministrados))
                        @foreach($prov->productos_suministrados as $prod)
                            <span class="badge bg-light text-secondary border me-1 mb-1" style="font-size: 10px !important;">{{ $prod }}</span>
                        @endforeach
                    @else
                        <small class="text-muted" style="font-size: 11px;">Insumos varios de restaurante</small>
                    @endif
                </div>
            </div>
            <div class="card-footer py-2 d-flex justify-content-between align-items-center">
                <small class="text-muted fw-semibold" style="font-size: 11px;">{{ $prov->productos_count ?? 0 }} PRODUCTOS VINCULADOS</small>
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
