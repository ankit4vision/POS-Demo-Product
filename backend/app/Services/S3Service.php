<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Aws\S3\S3Client;
use Aws\Exception\AwsException;

class S3Service
{
    protected $s3Client;
    protected $bucket;
    protected $region;
    protected $isEnabled;
    protected $folder;

    public function __construct()
    {
        $this->loadSettings();
    }

    /**
     * Load S3 settings from database
     */
    protected function loadSettings()
    {
        $settings = Setting::where('group', 's3')
            ->pluck('value', 'key')
            ->toArray();

        $this->isEnabled = $settings['s3_enabled'] ?? '0';
        $this->bucket = $settings['aws_bucket'] ?? '';
        $this->region = $settings['aws_region'] ?? 'us-east-1';
        $this->folder = $settings['s3_folder'] ?? '';

        if ($this->isEnabled && $this->bucket) {
            $this->initializeS3Client($settings);
        }
    }

    /**
     * Initialize S3 client with database settings
     */
    protected function initializeS3Client($settings)
    {
        $config = [
            'version' => 'latest',
            'region' => $settings['aws_region'] ?? 'us-east-1',
            'credentials' => [
                'key' => $settings['aws_access_key_id'] ?? '',
                'secret' => $settings['aws_secret_access_key'] ?? '',
            ],
        ];

        // Add custom endpoint if provided
        if (!empty($settings['s3_endpoint'])) {
            $config['endpoint'] = $settings['s3_endpoint'];
        }

        // Add custom URL if provided
        if (!empty($settings['s3_url'])) {
            $config['endpoint'] = $settings['s3_url'];
        }

        try {
            $this->s3Client = new S3Client($config);
        } catch (\Exception $e) {
            Log::error('Failed to initialize S3 client: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Test S3 connection
     */
    public function testConnection()
    {
        if (!$this->isEnabled) {
            throw new \Exception('S3 is not enabled');
        }

        if (!$this->s3Client) {
            throw new \Exception('S3 client not initialized');
        }

        try {
            // Test bucket access
            $result = $this->s3Client->headBucket([
                'Bucket' => $this->bucket
            ]);

            return [
                'bucket' => $this->bucket,
                'region' => $this->region,
                'status' => 'connected',
                'message' => 'Successfully connected to S3 bucket'
            ];
        } catch (AwsException $e) {
            Log::error('S3 connection test failed: ' . $e->getMessage());
            throw new \Exception('S3 connection failed: ' . $e->getMessage());
        }
    }

    /**
     * Upload file to S3
     */
    public function uploadFile($file, $path = null, $visibility = 'private')
    {
        if (!$this->isEnabled) {
            throw new \Exception('S3 is not enabled');
        }

        if (!$this->s3Client) {
            throw new \Exception('S3 client not initialized');
        }

        try {
            $fileName = $path ?: $this->generateFileName($file);
            
            $uploadParams = [
                'Bucket' => $this->bucket,
                'Key' => $fileName,
                'SourceFile' => $file->getRealPath(),
                'ContentType' => $file->getMimeType(),
            ];

            // Only set ACL if visibility is public and bucket allows it
            if ($visibility === 'public') {
                $uploadParams['ACL'] = 'public-read';
            }

            $result = $this->s3Client->putObject($uploadParams);

            return [
                'success' => true,
                'url' => $result['ObjectURL'],
                'path' => $fileName,
                'bucket' => $this->bucket
            ];
        } catch (AwsException $e) {
            Log::error('S3 upload failed: ' . $e->getMessage());
            throw new \Exception('Failed to upload file to S3: ' . $e->getMessage());
        }
    }

    /**
     * Delete file from S3
     */
    public function deleteFile($path)
    {
        if (!$this->isEnabled) {
            throw new \Exception('S3 is not enabled');
        }

        if (!$this->s3Client) {
            throw new \Exception('S3 client not initialized');
        }

        try {
            $result = $this->s3Client->deleteObject([
                'Bucket' => $this->bucket,
                'Key' => $path
            ]);

            return [
                'success' => true,
                'message' => 'File deleted successfully'
            ];
        } catch (AwsException $e) {
            Log::error('S3 delete failed: ' . $e->getMessage());
            throw new \Exception('Failed to delete file from S3: ' . $e->getMessage());
        }
    }

    /**
     * Get file URL from S3
     */
    public function getFileUrl($path)
    {
        if (!$this->isEnabled || !$this->s3Client) {
            return null;
        }

        try {
            return $this->s3Client->getObjectUrl($this->bucket, $path);
        } catch (\Exception $e) {
            Log::error('Failed to get S3 file URL: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Check if S3 is enabled
     */
    public function isEnabled()
    {
        return $this->isEnabled === '1';
    }

    /**
     * Generate unique filename
     */
    protected function generateFileName($file)
    {
        $extension = $file->getClientOriginalExtension();
        $timestamp = time();
        $random = uniqid();
        
        $fileName = "products/{$timestamp}_{$random}.{$extension}";
        
        // Add folder prefix if specified
        if (!empty($this->folder)) {
            $fileName = trim($this->folder, '/') . '/' . $fileName;
        }
        
        return $fileName;
    }

    /**
     * Reload settings (useful after settings update)
     */
    public function reloadSettings()
    {
        $this->loadSettings();
    }
} 