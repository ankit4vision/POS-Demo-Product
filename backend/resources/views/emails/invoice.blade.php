<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $customer->name ?? 'Customer' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        .company-meta {
            font-size: 14px;
            color: #7f8c8d;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #e9ecef;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .info-row {
            margin-bottom: 10px;
        }
        .label {
            font-weight: bold;
            color: #34495e;
            display: inline-block;
            width: 120px;
        }
        .value {
            color: #2c3e50;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">{{ $company['company_name'] ?? 'Company Name' }}</div>
        <div class="company-meta">
            @if(!empty($company['address'])){{ $company['address'] }}@endif
        </div>
        @if(!empty($company['phone']))
        <div class="company-meta">Phone: {{ $company['phone'] }}</div>
        @endif
        @if(!empty($company['email']))
        <div class="company-meta">Email: {{ $company['email'] }}</div>
        @endif
    </div>

    <div class="content">
        <div class="mb-3" style="font-size:16px; color:#2c3e50;">
            Dear {{ $customer->name ?? 'Customer' }},
        </div>
        <div class="mb-3" style="font-size:15px; color:#2c3e50;">
            Please find attached your invoice {{ $invoice->invoice_ref ?? $invoice->id }} as a PDF.<br>
            If you have any questions, feel free to contact us.
        </div>
        <div class="section-title">Invoice Information</div>
        <div class="info-row"><span class="label">Invoice #:</span> <span class="value">{{ $invoice->invoice_ref ?? $invoice->id }}</span></div>
        <div class="info-row"><span class="label">Date:</span> <span class="value">{{ $invoice->created_at ? \Carbon\Carbon::parse($invoice->created_at)->format('d M Y') : '-' }}</span></div>
        
        <div class="section-title" style="margin-top:24px;">Customer Information</div>
        <div class="info-row"><span class="label">Name:</span> <span class="value">{{ $customer->name ?? '-' }}</span></div>
        <div class="info-row"><span class="label">Email:</span> <span class="value">{{ $customer->email ?? '-' }}</span></div>
        <div class="info-row"><span class="label">Phone:</span> <span class="value">{{ $customer->phone ?? '-' }}</span></div>
        <div class="info-row"><span class="label">Address:</span> <span class="value">{{ $customer->address ?? '-' }}</span></div>
        @if(!empty($attachment_note))
            <div class="info-row" style="margin-top:15px;"><strong>{{ $attachment_note }}</strong></div>
        @endif
    </div>

    <div class="footer">
        <p>This email was generated on {{ now()->format('F j, Y \a\t g:i A') }}</p>
        <p>© {{ date('Y') }} {{ $company['company_name'] ?? 'Company Name' }}. All rights reserved.</p>
    </div>
</body>
</html> 