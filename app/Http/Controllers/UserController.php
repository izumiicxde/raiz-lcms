<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $currentUser = Auth::user();

        $users = User::query()
            ->where('id', '!=', $currentUser->id)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('course', 'like', "%{$search}%");
                });
            })
            ->withCount(['followers', 'following'])
            // prioritize users with same course as current user
            ->orderByRaw('CASE WHEN course = ? THEN 0 ELSE 1 END', [$currentUser->course])
            ->orderBy('name')
            ->paginate(10)
            ->through(function ($user) use ($currentUser) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'course' => $user->course,
                    'year' => $user->year,
                    'section' => $user->section,
                    'followers_count' => $user->followers_count,
                    'following_count' => $user->following_count,
                    'is_following' => $currentUser
                        ? $currentUser->following->contains($user->id)
                        : false,
                ];
            });

        return Inertia::render('list/users', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }


    /**
     * Follow a user.
     */
    public function follow($id)
    {
        $user = Auth::user();

        if ($user->id === $id) {
            return back()->withErrors(['You cannot follow yourself.']);
        }

        if (!$user->following()->where('following_id', $id)->exists()) {
            $user->following()->attach($id);
        }

        return back();
    }

    /**
     * Unfollow a user.
     */
    public function unfollow($id)
    {
        $user = Auth::user();

        if ($user->following()->where('following_id', $id)->exists()) {
            $user->following()->detach($id);
        }

        return back();
    }
}
