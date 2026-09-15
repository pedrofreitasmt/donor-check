<?php

use App\Http\Controllers\DonorController;
use App\Http\Controllers\LookupController;
use App\Http\Controllers\ScreeningController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('donors', DonorController::class)->except('show');

    Route::resource('screenings', ScreeningController::class)->except('edit', 'update', 'destroy');

    Route::post('/lookup', LookupController::class)->name('lookup');
});

require __DIR__.'/settings.php';
