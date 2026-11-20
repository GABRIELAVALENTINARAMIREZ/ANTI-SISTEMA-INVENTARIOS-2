@extends('layouts.app')

@section('title', 'Usuarios')
@section('page_header', 'Usuarios del Sistema y Permisos')

@section('content')
<div class="row g-3">
    @forelse($usuarios as $u)
    <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-danger text-white text-center fw-bold me-3" style="width: 48px; height: 48px; line-height: 48px; font-size: 1.1rem;">
                        {{ strtoupper(substr($u->nombre, 0, 2)) }}
                    </div>
                    <div>
                        <h6 class="fw-bold mb-0">{{ $u->nombre }}</h6>
                        <small class="text-muted">@<span>{{ $u->usuario }}</span></small>
                    </div>
                </div>
                <div class="small mb-1"><i class="bi bi-envelope me-2 text-danger"></i>{{ $u->correo }}</div>
                <div class="small mb-1"><i class="bi bi-shield-check me-2 text-danger"></i><strong>{{ $u->rol?->nombre }}</strong></div>
                <div class="small mb-2"><i class="bi bi-clock-history me-2 text-muted"></i>Último acceso: {{ $u->ultimo_acceso ? $u->ultimo_acceso->format('d/m/Y H:i') : 'Nunca' }}</div>
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
