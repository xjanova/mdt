<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\WorkflowController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CommunicationController;

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
