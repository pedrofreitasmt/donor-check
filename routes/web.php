<?php

use App\Http\Controllers\DonorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('donors', DonorController::class)->except('show');
});

require __DIR__.'/settings.php';
