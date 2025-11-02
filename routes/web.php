<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudyContentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\UserController;

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

    // Edit content
    Route::get('/study-content/{id}/edit', [StudyContentController::class, 'edit'])->name('study-content.edit-content');
    Route::put('/study-content/{id}', [StudyContentController::class, 'update'])->name('study-content.update');

    // delete a content
    Route::delete('/study-content/{id}', [StudyContentController::class, 'destroy'])->name('study-content.destroy');


    // Following and Followers structure...
    Route::get('/list/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/list/users/{id}/follow', [UserController::class, 'follow'])->name('users.follow');
    Route::delete('/list/users/{id}/unfollow', [UserController::class, 'unfollow'])->name('users.unfollow');


});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
