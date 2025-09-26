<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('auth-token')->plainTextToken;

        // Load user roles and permissions
        $user->load(['roles.permissions' => function ($query) {
            $query->where('is_active', true)->where('is_deleted', false);
        }]);
        
        // Get all permissions for the user (Admin role gets all permissions)
        $permissions = $user->getAllPermissions();
        
        // Group permissions by module for easier frontend consumption
        $permissionsByModule = $permissions->groupBy('module')->map(function ($modulePermissions) {
            return $modulePermissions->groupBy('submodule')->map(function ($submodulePermissions) {
                return $submodulePermissions->pluck('name')->toArray();
            });
        });

        return response()->json([
            'token' => $token,
            'user' => $user,
            'permissions' => $permissions->pluck('name')->toArray(),
            'permissionsByModule' => $permissionsByModule
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        
        // Load user roles and permissions
        $user->load(['roles.permissions' => function ($query) {
            $query->where('is_active', true)->where('is_deleted', false);
        }]);
        
        // Get all permissions for the user (Admin role gets all permissions)
        $permissions = $user->getAllPermissions();
        
        // Group permissions by module for easier frontend consumption
        $permissionsByModule = $permissions->groupBy('module')->map(function ($modulePermissions) {
            return $modulePermissions->groupBy('submodule')->map(function ($submodulePermissions) {
                return $submodulePermissions->pluck('name')->toArray();
            });
        });
        
        return response()->json([
            'user' => $user,
            'permissions' => $permissions->pluck('name')->toArray(),
            'permissionsByModule' => $permissionsByModule
        ]);
    }

    /**
     * Send password reset link.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No user found with this email address.'
            ], 404);
        }

        // Generate a random password
        $newPassword = Str::random(10);
        
        // Store the old password in case we need to revert
        $oldPassword = $user->password;
        
        // Update user's password
        $user->password = Hash::make($newPassword);
        $user->save();

        // Send email with new password using EmailService
        try {
            $emailResult = $this->emailService->sendEmailImmediately(
                $user->email,
                'supplier_details',
                [
                    'supplier' => (object)[
                        'name' => $user->name,
                        'email' => $user->email
                    ],
                    'company' => [
                        'company_name' => 'KRIMAH LTD POS'
                    ],
                    'newPassword' => $newPassword,
                    'isPasswordReset' => true
                ],
                $user->id,
                'User'
            );
            
            if ($emailResult['success']) {
                return response()->json([
                    'message' => 'Password has been reset and sent to your email!'
                ]);
            } else {
                // If email fails, revert the password change
                $user->password = $oldPassword;
                $user->save();
                
                return response()->json([
                    'message' => 'Failed to send email. Please try again.'
                ], 500);
            }
        } catch (\Exception $e) {
            // If email fails, revert the password change
            $user->password = $oldPassword;
            $user->save();
            
            return response()->json([
                'message' => 'Failed to send email. Please try again.'
            ], 500);
        }
    }

    /**
     * Test email configuration
     */
    public function testEmail(Request $request)
    {
        try {
            // Get email settings
            $emailService = app(EmailService::class);
            $emailSettings = $emailService->getEmailSettings();
            
            // Test SMTP connection first
            $smtpTest = $this->testSmtpConnection($emailSettings);
            
            // Test email configuration
            $result = $emailService->sendEmailImmediately(
                $request->email ?? 'test@example.com',
                'supplier_details',
                [
                    'supplier' => (object)[
                        'name' => 'Test User',
                        'email' => 'test@example.com'
                    ],
                    'company' => [
                        'company_name' => 'KRIMAH LTD POS'
                    ],
                    'isPasswordReset' => true,
                    'newPassword' => 'test123456'
                ]
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully',
                'email_settings' => $emailSettings,
                'smtp_test' => $smtpTest,
                'result' => $result
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Test email failed: ' . $e->getMessage(),
                'email_settings' => $emailSettings ?? [],
                'smtp_test' => $smtpTest ?? null,
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Test SMTP connection
     */
    private function testSmtpConnection($emailSettings)
    {
        try {
            $host = $emailSettings['smtp_host'];
            $port = $emailSettings['smtp_port'];
            
            // Test basic connection
            $connection = @fsockopen($host, $port, $errno, $errstr, 10);
            
            if (!$connection) {
                return [
                    'success' => false,
                    'error' => "Could not connect to $host:$port - $errstr ($errno)"
                ];
            }
            
            fclose($connection);
            
            return [
                'success' => true,
                'message' => "Successfully connected to $host:$port"
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => 'SMTP connection test failed: ' . $e->getMessage()
            ];
        }
    }
} 