@extends('layouts.app')

@section('title', 'Usuarios')
@section('page_header', 'Usuarios del Sistema y Permisos')

@section('content')
<div class="row g-3">
    @forelse($usuarios as $u)
    <div class="col-md-6 col-lg-4">
        <div class="card h-100">
            <div class="card-body p-3">
                <div class="d-flex align-items-center mb-3">
                    <div class="specimen-stamp-box bg-danger text-white text-center fw-bold me-3" style="width: 44px; height: 44px; font-size: 15px; border-radius: var(--radius-stamps) !important; font-family: var(--font-display);">
                        {{ strtoupper(substr($u->nombre, 0, 2)) }}
                    </div>
                    <div>
                        <h6 class="fw-bold mb-0" style="font-family: var(--font-display); font-size: 18px; text-transform: uppercase;">{{ $u->nombre }}</h6>
                        <small class="text-muted" style="font-size: 11px;">@<span>{{ $u->usuario }}</span></small>
                    </div>
                </div>
                <div class="small mb-1" style="font-size: 12px;"><i class="bi bi-envelope me-2 text-danger"></i>{{ $u->correo }}</div>
                <div class="small mb-1" style="font-size: 12px;"><i class="bi bi-shield-check me-2 text-danger"></i><strong>{{ $u->rol?->nombre }}</strong></div>
                <div class="small mb-3 text-muted" style="font-size: 11px;"><i class="bi bi-clock-history me-2"></i>Último acceso: {{ $u->ultimo_acceso ? $u->ultimo_acceso->format('d/m/Y H:i') : 'Nunca' }}</div>
                <div>
                    <span class="badge {{ $u->estado == 'Activo' ? 'bg-success' : 'bg-secondary' }}">{{ $u->estado }}</span>
                </div>
            </div>
        </div>
    </div>
    @empty
    <div class="col-12 text-center py-5 text-muted">
        No hay usuarios registrados.
    </div>
    @endforelse
</div>
@endsection
