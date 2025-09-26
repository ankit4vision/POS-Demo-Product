<?php

namespace App\Services;

use App\Models\Email;
use App\Models\Setting;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send email immediately and log the result
     */
    public function sendEmailImmediately($to, $type, $data, $relatedId = null, $relatedType = null, $attachments = [], $bodyOverride = null)
    {
        try {
            // Get email settings
            $emailSettings = $this->getEmailSettings();
            
            // Log email settings for debugging
            \Log::info('Email settings:', array_merge($emailSettings, ['smtp_pass' => '***HIDDEN***']));
            
            // Configure mail settings dynamically
            $this->configureMailSettings($emailSettings);
            
            // Prepare email content
            $subject = $this->getSubject($type, $data);
            $body = $bodyOverride ?? $this->renderTemplate($type, $data);

            // Log email details
            \Log::info('Sending email:', [
                'to' => $to,
                'subject' => $subject,
                'type' => $type,
                'from_email' => $emailSettings['from_email'],
                'from_name' => $emailSettings['from_name']
            ]);

            // Prepare attachments array
            $attachmentsArray = [];
            foreach ($attachments as $file) {
                if ($file && $file->isValid()) {
                    $attachmentsArray[] = [
                        'data' => file_get_contents($file->getRealPath()),
                        'name' => $file->getClientOriginalName(),
                        'mime' => $file->getMimeType(),
                    ];
                }
            }

            // Send email immediately
            \Mail::to($to)->send(new \App\Mail\GenericEmail(
                $subject,
                $body,
                $emailSettings['from_email'],
                $emailSettings['from_name'],
                $attachmentsArray
            ));
            
            \Log::info('Email sent successfully to: ' . $to);
            
            // Log success
            $this->logEmail($to, $emailSettings['from_email'], $type, $subject, $body, 'sent', 'Email sent successfully', $relatedId, $relatedType);
            
            return [
                'success' => true,
                'message' => 'Email sent successfully to ' . $to
            ];
            
        } catch (\Exception $e) {
            \Log::error('Email sending failed: ' . $e->getMessage());
            \Log::error('Email error details:', [
                'to' => $to,
                'type' => $type,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Log failure
            $this->logEmail($to, $emailSettings['from_email'] ?? 'system@example.com', $type, $subject ?? '', $body ?? '', 'failed', $e->getMessage(), $relatedId, $relatedType);
            
            return [
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Configure mail settings dynamically
     */
    private function configureMailSettings($emailSettings)
    {
        config([
            'mail.mailers.smtp.host' => $emailSettings['smtp_host'],
            'mail.mailers.smtp.port' => $emailSettings['smtp_port'],
            'mail.mailers.smtp.username' => $emailSettings['smtp_user'],
            'mail.mailers.smtp.password' => $emailSettings['smtp_pass'],
            'mail.mailers.smtp.encryption' => $emailSettings['smtp_port'] == '465' ? 'ssl' : 'tls',
            'mail.from.address' => $emailSettings['from_email'],
            'mail.from.name' => $emailSettings['from_name']
        ]);
    }

    /**
     * Send supplier details email
     */
    public function sendSupplierEmail($supplierId, $email, $attachments = [])
    {
        $supplier = \App\Models\Supplier::findOrFail($supplierId);
        $company = $this->getCompanySettings();
        
        $data = [
            'supplier' => $supplier,
            'company' => $company
        ];

        // Update email body to mention attachment if any
        $body = view('emails.supplier-details', $data + [
            'attachment_note' => count($attachments) ? 'Please check the attachment(s) for your details.' : null
        ])->render();

        return $this->sendEmailImmediately(
            $email,
            'supplier_details',
            $data,
            $supplierId,
            'App\\Models\\Supplier',
            $attachments,
            $body
        );
    }

    /**
     * Send wallet ledger email
     */
    public function sendWalletLedgerEmail($walletId, $email, $attachments = [])
    {
        $wallet = \App\Models\WalletAccount::with('customer')->findOrFail($walletId);
        $company = $this->getCompanySettings();
        $customer = $wallet->customer;

        // Prepare data for the email template
        $data = [
            'wallet' => $wallet,
            'customer' => $customer,
            'company' => $company,
            // Add any other data needed by your Blade template
        ];

        // Render the email body using your wallet ledger Blade template
        $body = view('emails.wallet-ledger', $data + [
            'attachment_note' => count($attachments) ? 'Please check the attachment(s) for your details.' : null
        ])->render();

        return $this->sendEmailImmediately(
            $email,
            'wallet_ledger',
            $data,
            $walletId,
            'App\\Models\\WalletAccount',
            $attachments,
            $body
        );
    }

    /**
     * Send invoice email
     */
    public function sendInvoiceEmail($invoiceId, $email, $attachments = [])
    {
        $invoice = \App\Models\Sale::with(['customer', 'items.product'])->findOrFail($invoiceId);
        $company = $this->getCompanySettings();
        $customer = $invoice->customer;

        // Prepare data for the email template
        $data = [
            'invoice' => $invoice,
            'customer' => $customer,
            'company' => $company,
            // Add any other data needed by your Blade template
        ];

        // Render the email body using your invoice Blade template
        $body = view('emails.invoice', $data + [
            'attachment_note' => count($attachments) ? 'Please check the attachment(s) for your details.' : null
        ])->render();

        return $this->sendEmailImmediately(
            $email,
            'invoice',
            $data,
            $invoiceId,
            'App\\Models\\Sale',
            $attachments,
            $body
        );
    }

    /**
     * Send purchase order email
     */
    public function sendPurchaseOrderEmail($purchaseOrderId, $email, $attachments = [])
    {
        $purchaseOrder = \App\Models\PurchaseOrder::with(['supplier', 'items.product'])->findOrFail($purchaseOrderId);
        $company = $this->getCompanySettings();
        $supplier = $purchaseOrder->supplier;

        // Prepare data for the email template
        $data = [
            'purchase_order' => $purchaseOrder,
            'supplier' => $supplier,
            'company' => $company,
            // Add any other data needed by your Blade template
        ];

        // Render the email body using your purchase order Blade template
        $body = view('emails.purchase-order', $data + [
            'attachment_note' => count($attachments) ? 'Please check the attachment(s) for your details.' : null
        ])->render();

        return $this->sendEmailImmediately(
            $email,
            'purchase_order',
            $data,
            $purchaseOrderId,
            'App\\Models\\PurchaseOrder',
            $attachments,
            $body
        );
    }

    /**
     * Send customer email
     */
    public function sendCustomerEmail($customerId, $email, $subject, $message, $attachments = [])
    {
        $customer = \App\Models\Customer::findOrFail($customerId);
        $company = $this->getCompanySettings();
        
        $data = [
            'customer' => $customer,
            'company' => $company,
            'custom_subject' => $subject,
            'custom_message' => $message
        ];

        // Use a generic customer email template
        $body = view('emails.customer-message', $data + [
            'attachment_note' => count($attachments) ? 'Please check the attachment(s) for additional information.' : null
        ])->render();

        return $this->sendEmailImmediately(
            $email,
            'customer_message',
            $data,
            $customerId,
            'App\\Models\\Customer',
            $attachments,
            $body
        );
    }

    /**
     * Send customer details email
     */
    public function sendCustomerDetailsEmail($customerId, $email, $attachments = [], $type = 'cust_detail')
    {
        $customer = \App\Models\Customer::findOrFail($customerId);
        $company = $this->getCompanySettings();
        $data = [
            'customer' => $customer,
            'company' => $company
        ];
        $body = view('emails.customer-details', $data + [
            'attachment_note' => count($attachments) ? 'Please check the attachment(s) for your details.' : null
        ])->render();
        return $this->sendEmailImmediately(
            $email,
            $type,
            $data,
            $customerId,
            'App\\Models\\Customer',
            $attachments,
            $body
        );
    }

    /**
     * Get email settings from database
     */
    public function getEmailSettings()
    {
        $settings = Setting::where('group', 'email')->pluck('value', 'key')->toArray();
        
        return [
            'smtp_host' => $settings['smtp_host'] ?? 'smtp.gmail.com',
            'smtp_port' => $settings['smtp_port'] ?? '587',
            'smtp_user' => $settings['smtp_user'] ?? '',
            'smtp_pass' => $settings['smtp_pass'] ?? '',
            'from_email' => $settings['from_email'] ?? 'noreply@example.com',
            'from_name' => $settings['from_name'] ?? 'Company Name'
        ];
    }

    /**
     * Get company settings from database
     */
    private function getCompanySettings()
    {
        return Setting::where('group', 'billing')->pluck('value', 'key')->toArray();
    }

    /**
     * Get email subject based on type
     */
    private function getSubject($type, $data)
    {
        switch ($type) {
            case 'supplier_details':
                return 'Supplier Information - ' . ($data['supplier']->name ?? 'Supplier');
            case 'invoice':
                return 'Invoice Details - ' . ($data['invoice']->invoice_ref ?? 'INV-' . str_pad($data['invoice']->id, 4, '0', STR_PAD_LEFT));
            case 'wallet_ledger':
                // If called from customer details, use a different subject
                if (isset($data['customer']) && isset($data['company']) && !isset($data['wallet'])) {
                    return 'Customer Details - ' . ($data['customer']->name ?? 'Customer');
                }
                return 'Wallet Ledger Statement - ' . ($data['customer']->name ?? 'Customer');
            case 'purchase_order':
                return 'Purchase Order Details - ' . ($data['purchase_order']->po_number ?? 'PO-' . str_pad($data['purchase_order']->id, 6, '0', STR_PAD_LEFT));
            case 'password_reset':
                return 'Password Reset - KRIMAH LTD POS';
            default:
                return 'Email from ' . ($data['company']['company_name'] ?? 'Company');
        }
    }

    /**
     * Render email template
     */
    private function renderTemplate($type, $data)
    {
        $template = 'emails.' . str_replace('_', '-', $type);
        
        try {
            return view($template, $data)->render();
        } catch (\Exception $e) {
            Log::error('Template rendering failed: ' . $e->getMessage());
            return $this->getFallbackTemplate($type, $data);
        }
    }

    /**
     * Get fallback template if main template fails
     */
    private function getFallbackTemplate($type, $data)
    {
        $company = $data['company'] ?? [];
        
        return "
        <html>
        <body>
            <h2>Email from " . ($company['company_name'] ?? 'Company') . "</h2>
            <p>This is an automated email.</p>
            <p>Type: " . ucfirst(str_replace('_', ' ', $type)) . "</p>
            <hr>
            <p><small>Generated on " . now()->format('Y-m-d H:i:s') . "</small></p>
        </body>
        </html>";
    }

    /**
     * Log email in database
     */
    private function logEmail($to, $from, $type, $subject, $body, $status, $response, $relatedId = null, $relatedType = null)
    {
        Email::create([
            'to_email' => $to,
            'from_email' => $from,
            'type' => $type,
            'subject' => $subject,
            'body' => $body,
            'send_status' => $status,
            'response_message' => $response,
            'related_id' => $relatedId,
            'related_type' => $relatedType,
            'sent_at' => now()
        ]);
    }
} 