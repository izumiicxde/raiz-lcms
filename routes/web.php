<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudyContentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\FileUploadController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // file uploads
    Route::post('/upload', [StudyContentController::class, 'store'])->name('studycontents.store');
    Route::get('/upload', [StudyContentController::class, 'create'])->name('studycontents.create');

    // render user specific content on dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
