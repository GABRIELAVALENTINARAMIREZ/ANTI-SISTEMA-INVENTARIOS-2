<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Sistema de Inventarios') - GAMA FastStock</title>
    <!-- Bootstrap 5.3 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- GAMA Design System & Template Stylesheet (Fonts In Use Specimen Theme) -->
    <link rel="stylesheet" href="/css/gama-template.css">
    @yield('styles')
</head>
<body>
<div class="container-fluid p-0">
    <div class="row g-0">
        <!-- Sidebar Navigation -->
        <nav class="col-md-3 col-lg-2 d-md-block sidebar collapse show" id="sidebarMenu">
            <div class="position-sticky pt-2">
                <div class="brand-masthead mb-3">
                    <div class="d-flex align-items-center">
                        <span class="badge bg-danger p-2 me-2 fs-6" style="border-radius: var(--radius-stamps) !important;"><i class="bi bi-box-seam-fill"></i></span>
                        <div>
                            <div class="brand-wordmark">GAMA FASTSTOCK</div>
                            <div class="brand-tagline">Control de Inventarios</div>
                        </div>
                    </div>
                </div>
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
                            <i class="bi bi-speedometer2"></i> Inicio / Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('inventario.*') ? 'active' : '' }}" href="{{ route('inventario.index') }}">
                            <i class="bi bi-boxes"></i> Inventario
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('categorias.*') ? 'active' : '' }}" href="{{ route('categorias.index') }}">
                            <i class="bi bi-tags"></i> Categorías
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('proveedores.*') ? 'active' : '' }}" href="{{ route('proveedores.index') }}">
                            <i class="bi bi-truck"></i> Proveedores
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('movimientos.*') ? 'active' : '' }}" href="{{ route('movimientos.index') }}">
                            <i class="bi bi-arrow-left-right"></i> Movimientos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('recetas.*') ? 'active' : '' }}" href="{{ route('recetas.index') }}">
                            <i class="bi bi-journal-text"></i> Recetas y Menú
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('lotes.*') ? 'active' : '' }}" href="{{ route('lotes.index') }}">
                            <i class="bi bi-calendar-check"></i> Lotes y Vencimientos
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('reportes.*') ? 'active' : '' }}" href="{{ route('reportes.index') }}">
                            <i class="bi bi-bar-chart-line"></i> Reportes
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->routeIs('usuarios.*') ? 'active' : '' }}" href="{{ route('usuarios.index') }}">
                            <i class="bi bi-people"></i> Usuarios
                        </a>
                    </li>
                </ul>

                <hr class="mx-3" style="border-color: rgba(255,255,255,0.12);">
                <div class="px-3 text-white-50 small">
                    <div style="font-size: 11px;"><i class="bi bi-database me-1 text-success"></i> MySQL: <code>127.0.0.1:3306</code></div>
                    <div style="font-size: 11px;"><i class="bi bi-hdd-network me-1 text-info"></i> XAMPP Local</div>
                    <div class="mt-2"><span class="badge bg-secondary" style="font-size: 10px !important;">Rama: dev</span></div>
                </div>
            </div>
        </nav>

        <!-- Main Content Area -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <!-- Top Navbar (Masthead / Header) -->
            <header class="top-navbar mb-4 mt-3 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-outline-secondary d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu">
                        <i class="bi bi-list"></i>
                    </button>
                    <h1 class="page-headline">@yield('page_header', 'Panel Principal')</h1>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        <i class="bi bi-circle-fill me-1" style="font-size: 0.5rem;"></i> XAMPP MySQL Listo
                    </span>
                    <div class="d-flex align-items-center gap-2">
                        <div class="user-avatar-stamp">
                            CM
                        </div>
                        <div class="d-none d-sm-block text-start">
                            <div class="fw-bold" style="font-size: 13px;">Camila Mendoza</div>
                            <div class="text-muted" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Administrador</div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Alerts & Notifications -->
            @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show border-0" role="alert" style="border-radius: var(--radius-cards); border-left: 4px solid var(--gama-success) !important;">
                    <i class="bi bi-check-circle-fill me-2"></i> {{ session('success') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif

            <!-- Page Body -->
            @yield('content')

            <!-- Footer -->
            <footer class="py-4 mt-5 text-center text-muted small border-top" style="border-color: var(--gama-border-hairline) !important; font-size: 12px;">
                Sistema de Inventarios GAMA &copy; 2026 &bull; Desarrollado en <strong>Laravel + MySQL + Bootstrap</strong> &bull; Versionado con <strong>Liquibase</strong>
            </footer>
        </main>
    </div>
</div>

<!-- Bootstrap 5.3 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
@yield('scripts')
</body>
</html>
