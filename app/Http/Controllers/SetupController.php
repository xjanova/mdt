<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SetupController extends Controller
{
    public function showSetupForm()
    {
        // ถ้ามี user แล้ว ไม่ให้เข้าหน้า setup
        if (User::count() > 0) {
            return redirect()->route('dashboard');
        }

        return view('setup');
    }

    public function setup(Request $request)
    {
        // ถ้ามี user แล้ว ไม่ให้ setup ซ้ำ
        if (User::count() > 0) {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'company_name' => ['nullable', 'string', 'max:255'],
        ], [
            'name.required' => 'กรุณากรอกชื่อ-นามสกุล',
            'email.required' => 'กรุณากรอกอีเมล',
            'email.email' => 'รูปแบบอีเมลไม่ถูกต้อง',
            'password.required' => 'กรุณากรอกรหัสผ่าน',
            'password.min' => 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
            'password.confirmed' => 'รหัสผ่านไม่ตรงกัน',
        ]);

        DB::transaction(function () use ($validated) {
            // สร้าง Super Admin user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'is_super_admin' => true,
                'email_verified_at' => now(),
            ]);

            // สร้าง Employee record
            Employee::create([
                'user_id' => $user->id,
                'employee_code' => 'ADMIN001',
                'position' => 'Super Admin',
                'role' => 'central_admin',
                'is_active' => true,
            ]);

            // Auto-login
            Auth::login($user);
        });

        return redirect()->route('dashboard')
            ->with('success', 'ตั้งค่า Super Admin เรียบร้อยแล้ว! ยินดีต้อนรับสู่ระบบ MDT ERP');
    }
}
