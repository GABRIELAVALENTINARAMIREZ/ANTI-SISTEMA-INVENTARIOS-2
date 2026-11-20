<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Soporte para longitudes de string compatibles con MySQL / MariaDB en XAMPP
        Schema::defaultStringLength(191);
    }
}
