<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\StudyContent;

class DashboardController extends Controller
{
    /**
     * Show all study materials uploaded by the current user.
     */
    public function index()
    {
        $user = Auth::user();

        $contents = StudyContent::with('tags')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('dashboard', [
            'contents' => $contents,
        ]);
    }
}
