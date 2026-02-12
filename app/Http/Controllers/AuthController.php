<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Employee;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [
            'email.required' => 'กรุณากรอกอีเมล',
            'email.email' => 'รูปแบบอีเมลไม่ถูกต้อง',
            'password.required' => 'กรุณากรอกรหัสผ่าน',
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        ])->onlyInput('email');
    }

    /**
     * Demo login - login by role without password
     */
    public function demoLogin(Request $request)
    {
        $request->validate([
            'role' => ['required', 'string'],
        ]);

        $role = $request->input('role');

        // Find first employee with matching role
        $employee = Employee::where('role', $role)->first();

        if (!$employee || !$employee->user) {
            return back()->withErrors([
                'email' => 'ไม่พบผู้ใช้สำหรับบทบาทนี้ กรุณา seed ข้อมูลก่อน',
            ]);
        }

        // Login as that user
        Auth::login($employee->user, true);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
