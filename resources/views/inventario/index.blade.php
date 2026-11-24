@extends('layouts.app')

@section('title', 'Catálogo de Inventario')
@section('page_header', 'Gestión de Inventario de Insumos y Productos')

@section('content')
<!-- Barra de Búsqueda y Filtros Facetados (Estilo Specimen / Editorial) -->
<div class="card mb-4">
    <div class="card-body p-3">
        <form method="GET" action="{{ route('inventario.index') }}" class="row g-2 align-items-center">
            <div class="col-md-4">
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" name="buscar" value="{{ request('buscar') }}" class="form-control" placeholder="Buscar por código o nombre...">
                </div>
            </div>
            <div class="col-md-3">
                <select name="categoria" class="form-select">
                    <option value="">Todas las categorías</option>
                    @foreach($categorias as $cat)
                        <option value="{{ $cat->id_categoria }}" {{ request('categoria') == $cat->id_categoria ? 'selected' : '' }}>
                            {{ $cat->nombre }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-3">
                <select name="estado" class="form-select">
                    <option value="">Todos los estados</option>
                    <option value="disponible" {{ request('estado') == 'disponible' ? 'selected' : '' }}>Disponible</option>
                    <option value="bajo" {{ request('estado') == 'bajo' ? 'selected' : '' }}>Bajo Stock</option>
                    <option value="agotado" {{ request('estado') == 'agotado' ? 'selected' : '' }}>Agotado</option>
                </select>
            </div>
            <div class="col-md-2 d-flex gap-2">
                <button type="submit" class="btn btn-primary w-100"><i class="bi bi-funnel"></i> Filtrar</button>
                <a href="{{ route('inventario.index') }}" class="btn btn-outline-secondary" title="Limpiar filtros"><i class="bi bi-arrow-counterclockwise"></i></a>
            </div>
        </form>
    </div>
</div>

<!-- Catálogo de Existencias (Tabla de Densidad Compacta) -->
<div class="card">
    <div class="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 class="mb-0"><i class="bi bi-boxes me-2 text-danger"></i>Listado de Existencias</h6>
        <span class="badge bg-secondary">{{ $productos->count() }} ítems encontrados</span>
    </div>
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Ubicación</th>
                    <th>Stock Actual</th>
                    <th>Stock Mín.</th>
                    <th>Precio Compra</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                @forelse($productos as $prod)
                <tr>
                    <td><code style="font-size: 12px; background-color: var(--gama-bg-canvas); padding: 2px 6px; border-radius: var(--radius-badges); border: 1px solid var(--gama-border-hairline);">{{ $prod->codigo }}</code></td>
                    <td>
                        <div class="fw-bold" style="font-size: 14px;">{{ $prod->nombre }}</div>
                        <small class="text-muted" style="font-size: 11px;">{{ $prod->proveedor?->nombre }}</small>
                    </td>
                    <td>
                        <span class="badge bg-light text-dark border">{{ $prod->categoria?->nombre }}</span>
                    </td>
                    <td class="text-muted" style="font-size: 12px;">{{ $prod->ubicacion?->nombre ?? 'N/A' }}</td>
                    <td class="fw-bold" style="font-size: 15px; font-family: var(--font-display);">
                        {{ $prod->cantidad }} <span class="fw-normal text-muted" style="font-family: var(--font-ui); font-size: 11px;">{{ $prod->unidad_medida }}</span>
                    </td>
                    <td class="text-muted" style="font-size: 12px;">{{ $prod->stock_minimo }}</td>
                    <td style="font-family: var(--font-display); font-size: 14px; font-weight: 700;">${{ number_format($prod->precio_compra, 0, ',', '.') }} COP</td>
                    <td>
                        @if($prod->cantidad <= 0)
                            <span class="badge bg-danger">Agotado</span>
                        @elseif($prod->cantidad <= $prod->stock_minimo)
                            <span class="badge bg-warning text-dark">Bajo Stock</span>
                        @else
                            <span class="badge bg-success">Disponible</span>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="text-center py-5 text-muted">
                        <i class="bi bi-search fs-3 d-block mb-2"></i>
                        No se encontraron productos registrados en la base de datos MySQL de XAMPP.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
