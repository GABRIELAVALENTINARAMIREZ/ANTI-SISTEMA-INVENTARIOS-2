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
    <style>
        :root {
            --gama-primary: #E63946;
            --gama-dark: #1D3557;
            --gama-light: #F8F9FA;
            --gama-accent: #FFB703;
        }
        body {
            background-color: #f4f6f9;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        }
        .sidebar {
            min-height: 100vh;
            background: linear-gradient(180deg, #1A1D20 0%, #212529 100%);
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }
        .sidebar .brand-title {
            color: #ffffff;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .sidebar .nav-link {
            color: #adb5bd;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            margin: 0.15rem 0.5rem;
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }
        .sidebar .nav-link:hover, .sidebar .nav-link.active {
            color: #ffffff;
            background-color: rgba(230, 57, 70, 0.85);
        }
        .sidebar .nav-link i {
            margin-right: 0.75rem;
            font-size: 1.1rem;
        }
        .top-navbar {
            background-color: #ffffff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            border-bottom: 1px solid #e9ecef;
        }
        .card-stat {
            border: none;
            border-radius: 0.75rem;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-stat:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }
    </style>
    @yield('styles')
</head>
<body>
<div class="container-fluid p-0">
    <div class="row g-0">
        <!-- Sidebar Navigation -->
        <nav class="col-md-3 col-lg-2 d-md-block sidebar collapse show" id="sidebarMenu">
            <div class="position-sticky pt-3">
                <div class="px-3 pb-3 mb-3 border-bottom border-secondary">
                    <div class="d-flex align-items-center">
                        <span class="badge bg-danger p-2 me-2 fs-6"><i class="bi bi-box-seam-fill"></i></span>
                        <div>
                            <div class="brand-title fs-5 mb-0">GAMA FastStock</div>
                            <small class="text-white-50">Control de Inventarios</small>
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

                <hr class="text-secondary mx-3">
                <div class="px-3 text-white-50 small">
                    <div><i class="bi bi-database me-1 text-success"></i> MySQL: <code>127.0.0.1:3306</code></div>
                    <div><i class="bi bi-hdd-network me-1 text-info"></i> XAMPP Local</div>
                    <div class="mt-1"><span class="badge bg-secondary">Rama: dev</span></div>
                </div>
            </div>
        </nav>

        <!-- Main Content Area -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <!-- Top Navbar -->
            <header class="top-navbar py-2 px-3 mb-4 rounded-3 mt-3 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-outline-secondary d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu">
                        <i class="bi bi-list"></i>
                    </button>
                    <h5 class="mb-0 text-dark fw-bold">@yield('page_header', 'Panel Principal')</h5>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                        <i class="bi bi-circle-fill me-1" style="font-size: 0.6rem;"></i> XAMPP MySQL Listo
                    </span>
                    <div class="d-flex align-items-center gap-2">
                        <div class="rounded-circle bg-danger text-white text-center fw-bold" style="width: 36px; height: 36px; line-height: 36px;">
                            CM
                        </div>
                        <div class="d-none d-sm-block text-start">
                            <div class="fw-semibold small">Camila Mendoza</div>
                            <div class="text-muted" style="font-size: 0.75rem;">Administrador</div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Alerts & Notifications -->
            @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i> {{ session('success') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif

            <!-- Page Body -->
            @yield('content')

            <!-- Footer -->
            <footer class="py-4 mt-5 text-center text-muted small border-top">
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
