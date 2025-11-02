<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            // Validate incoming request
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'uucms_no' => 'required|string|max:12|regex:/^[A-Za-z0-9]+$/|unique:' . User::class,
                'course' => 'required|string|max:255',
                'year' => 'required|integer|min:1|max:4',
                'section' => 'required|string|size:1|alpha',
            ]);

            // Create user record
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'uucms_no' => $request->uucms_no,
                'course' => $request->course,
                'year' => $request->year,
                'section' => strtoupper($request->section),
            ]);

            // Fire registration event
            event(new Registered($user));

            // Log the user in
            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false))
                ->with('success', 'Registration successful. Welcome to your dashboard.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Laravel already handles validation exceptions — just rethrow
            throw $e;
        } catch (Throwable $e) {
            // Log unexpected errors for debugging
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'input' => $request->except(['password', 'password_confirmation']),
            ]);

            // Redirect back with a generic error
            return redirect()->back()
                ->withInput()
                ->with('error', 'An unexpected error occurred during registration. Please try again later.');
        }
    }
}
