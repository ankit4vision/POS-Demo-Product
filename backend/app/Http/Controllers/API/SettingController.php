<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use App\Services\S3Service;

class SettingController extends Controller
{
    protected $s3Service;

    public function __construct(S3Service $s3Service)
    {
        $this->s3Service = $s3Service;
    }

    // Get all settings (grouped)
    public function index()
    {
        $settings = Setting::all()->groupBy('group');
        $result = [];
        foreach ($settings as $group => $items) {
            $result[$group] = [];
            foreach ($items as $item) {
                $result[$group][$item->key] = $item->value;
            }
        }
        return response()->json($result);
    }

    // Update billing settings
    public function updateBilling(Request $request)
    {
        $fields = [
            'company_name', 'address', 'city', 'state', 'country', 'gstin', 'phone', 'email'
        ];
        foreach ($fields as $field) {
            Setting::updateOrCreate(
                ['key' => $field, 'group' => 'billing'],
                ['value' => $request->input($field)]
            );
        }
        return response()->json(['message' => 'Billing settings updated']);
    }

    // Update email settings
    public function updateEmail(Request $request)
    {
        $fields = [
            'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'from_email', 'from_name'
        ];
        foreach ($fields as $field) {
            Setting::updateOrCreate(
                ['key' => $field, 'group' => 'email'],
                ['value' => $request->input($field)]
            );
        }
        return response()->json(['message' => 'Email settings updated']);
    }

    // Update site settings
    public function updateSiteSettings(Request $request)
    {
        $fields = [
            'currency', 'show_company_info_on_invoice', 'invoice_footer_text', 'hide_vat_from_everywhere'
        ];
        
        foreach ($fields as $field) {
            Setting::updateOrCreate(
                ['key' => $field, 'group' => 'siteSettings'],
                ['value' => $request->input($field)]
            );
        }
        
        return response()->json(['message' => 'Site settings updated']);
    }

    // Update S3 settings
    public function updateS3(Request $request)
    {
        $fields = [
            's3_enabled', 'aws_access_key_id', 'aws_secret_access_key', 
            'aws_region', 'aws_bucket', 's3_url', 's3_endpoint', 's3_folder'
        ];
        
        foreach ($fields as $field) {
            Setting::updateOrCreate(
                ['key' => $field, 'group' => 's3'],
                ['value' => $request->input($field)]
            );
        }
        
        return response()->json(['message' => 'S3 settings updated']);
    }

    // Test S3 connection
    public function testS3Connection(Request $request)
    {
        try {
            $result = $this->s3Service->testConnection();
            return response()->json([
                'success' => true,
                'message' => 'S3 connection successful',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'S3 connection failed: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 