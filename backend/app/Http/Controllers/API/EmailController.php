<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmailController extends Controller
{
    protected $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Send supplier details email
     */
    public function sendSupplierEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'supplier_id' => 'required|exists:suppliers,id',
            'email' => 'required|email',
            'attachments.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx|max:10240', // 10MB per file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $attachments = $request->file('attachments', []);
            $result = $this->emailService->sendSupplierEmail(
                $request->supplier_id,
                $request->email,
                $attachments
            );

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get email history
     */
    public function getEmailHistory(Request $request)
    {
        $query = \App\Models\Email::orderBy('sent_at', 'desc');

        // Filter by type
        if ($request->has('type') && $request->type !== '') {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('send_status', $request->status);
        }

        // Filter by related record
        if ($request->has('related_type') && $request->has('related_id')) {
            $query->where('related_type', $request->related_type)
                  ->where('related_id', $request->related_id);
        }

        // Search functionality
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('to_email', 'like', "%{$search}%")
                  ->orWhere('from_email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('body', 'like', "%{$search}%");
            });
        }

        // Date range filter
        if ($request->has('date_from') && $request->date_from !== '') {
            $query->whereDate('sent_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to !== '') {
            $query->whereDate('sent_at', '<=', $request->date_to);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'sent_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        // Validate sort fields
        $allowedSortFields = ['sent_at', 'created_at', 'to_email', 'subject', 'type', 'send_status'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'sent_at';
        }
        
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $emails = $query->paginate($perPage);

        // For summary stats, use a clone of the query without pagination
        $summaryQuery = clone $query;
        $allMatching = $summaryQuery->get();
        $totalSent = $allMatching->where('send_status', 'sent')->count();
        $totalFailed = $allMatching->where('send_status', 'failed')->count();

        $response = $emails->toArray();
        $response['total_sent'] = $totalSent;
        $response['total_failed'] = $totalFailed;

        return response()->json($response);
    }

    /**
     * Delete email record
     */
    public function deleteEmail($id)
    {
        try {
            $email = \App\Models\Email::findOrFail($id);
            $email->delete();

            return response()->json([
                'success' => true,
                'message' => 'Email record deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting email record: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resend failed email
     */
    public function resendEmail($id)
    {
        try {
            $email = \App\Models\Email::findOrFail($id);
            
            if ($email->send_status !== 'failed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only failed emails can be resent'
                ], 400);
            }

            // Attempt to resend the email
            $result = $this->emailService->sendEmailImmediately(
                $email->to_email,
                $email->type,
                [], // We don't have the original data, so we'll send a simple message
                $email->related_id,
                $email->related_type
            );

            if ($result['success']) {
                // Update the original record
                $email->update([
                    'send_status' => 'sent',
                    'response_message' => 'Email resent successfully',
                    'sent_at' => now()
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Email resent successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to resend email: ' . $result['message']
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error resending email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send wallet ledger email
     */
    public function sendWalletLedgerEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'wallet_id' => 'required|exists:wallet_accounts,id',
            'email' => 'required|email',
            'attachments.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx|max:10240', // 10MB per file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $attachments = $request->file('attachments', []);
            $result = $this->emailService->sendWalletLedgerEmail(
                $request->wallet_id,
                $request->email,
                $attachments
            );

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send invoice email
     */
    public function sendInvoiceEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'invoice_id' => 'required|exists:sales,id',
            'email' => 'required|email',
            'attachments.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx|max:10240', // 10MB per file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $attachments = $request->file('attachments', []);
            $result = $this->emailService->sendInvoiceEmail(
                $request->invoice_id,
                $request->email,
                $attachments
            );

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send purchase order email
     */
    public function sendPurchaseOrderEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'email' => 'required|email',
            'attachments.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx|max:10240', // 10MB per file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $attachments = $request->file('attachments', []);
            $result = $this->emailService->sendPurchaseOrderEmail(
                $request->purchase_order_id,
                $request->email,
                $attachments
            );

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send customer email
     */
    public function sendCustomerEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,id',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'attachments.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx|max:10240', // 10MB per file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $attachments = $request->file('attachments', []);
            $result = $this->emailService->sendCustomerEmail(
                $request->customer_id,
                $request->email,
                $request->subject,
                $request->message,
                $attachments
            );

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send customer details email (with PDF attachment)
     */
    public function sendCustomerDetailsEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,id',
            'email' => 'required|email',
            'attachments.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx|max:10240', // 10MB per file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $attachments = $request->file('attachments', []);
            // Generate the customer details PDF
            $customer = \App\Models\Customer::findOrFail($request->customer_id);
            $pdfResponse = app(\App\Http\Controllers\API\CustomerController::class)->exportPdf($customer->id);
            $pdfContent = $pdfResponse->getContent();
            $pdfName = 'CustomerReport-' . $customer->id . '.pdf';
            // Add PDF to attachments
            $tmpPdfPath = tempnam(sys_get_temp_dir(), 'custpdf_');
            file_put_contents($tmpPdfPath, $pdfContent);
            $pdfFile = new \Illuminate\Http\UploadedFile($tmpPdfPath, $pdfName, 'application/pdf', null, true);
            $attachments[] = $pdfFile;
            // Send email
            $result = $this->emailService->sendCustomerDetailsEmail(
                $request->customer_id,
                $request->email,
                $attachments,
                'wallet_ledger'
            );
            // Clean up temp file
            @unlink($tmpPdfPath);
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending email: ' . $e->getMessage()
            ], 500);
        }
    }
}
