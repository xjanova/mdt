<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\WorkflowController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CommunicationController;

// ===== Setup (ครั้งแรก) =====
Route::get('/setup', [SetupController::class, 'showSetupForm'])->name('setup');
Route::post('/setup', [SetupController::class, 'setup'])->name('setup.store');

// ===== Auth =====
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/demo-login", [AuthController::class, "demoLogin"])->name("demo.login");
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// ===== App Routes (ต้อง login + setup เสร็จแล้ว) =====
Route::middleware(['setup.complete', 'auth'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');

    Route::get('/sales', [SalesReportController::class, 'index'])->name('sales.index');

    Route::get('/workflows', [WorkflowController::class, 'index'])->name('workflows.index');
    Route::get('/workflows/{workflow}', [WorkflowController::class, 'show'])->name('workflows.show');

    Route::get('/problems', [ProblemController::class, 'index'])->name('problems.index');
    Route::get('/problems/{problem}', [ProblemController::class, 'show'])->name('problems.show');

    Route::get('/branches', [BranchController::class, 'index'])->name('branches.index');
    Route::get('/branches/{branch}', [BranchController::class, 'show'])->name('branches.show');

    Route::get('/communications', [CommunicationController::class, 'index'])->name('communications.index');
    Route::get('/communications/{communication}', [CommunicationController::class, 'show'])->name('communications.show');
});
