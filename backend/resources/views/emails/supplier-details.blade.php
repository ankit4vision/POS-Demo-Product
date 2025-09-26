<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ isset($isPasswordReset) ? 'Password Reset' : 'Supplier Information' }} - {{ $supplier->name }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
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
        .supplier-info {
            margin-bottom: 20px;
        }
        .supplier-name {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
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
        .status-active {
            color: #27ae60;
            font-weight: bold;
        }
        .status-inactive {
            color: #e74c3c;
            font-weight: bold;
        }
        .password-box {
            background-color: #f8f9fa;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .password-text {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
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
        @if(isset($isPasswordReset))
            <!-- Password Reset Content -->
            <h2>Password Reset Successful</h2>
            
            <p>Hello <strong>{{ $supplier->name }}</strong>,</p>
            
            <div class="success">
                <strong>Your password has been successfully reset!</strong>
            </div>
            
            <p>Your new password is:</p>
            
            <div class="password-box">
                <div class="password-text">{{ $newPassword }}</div>
            </div>
            
            <div class="warning">
                <strong>Important:</strong> 
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Please log in with this new password</li>
                    <li>For security, we recommend changing your password after logging in</li>
                    <li>Keep this password safe and do not share it with anyone</li>
                </ul>
            </div>
            
            <p>You can now log in to your KRIMAH LTD POS account using this new password.</p>
            
            <p>If you did not request this password reset, please contact our support team immediately.</p>
        @else
            <!-- Supplier Details Content -->
            <div class="mb-3" style="font-size:16px; color:#2c3e50;">
                This email contains the Supplier Details with Purchase Orders and Summary, Financial Summary & Transactions.
            </div>
            <div class="supplier-info">
                <div class="supplier-name">Supplier Information</div>
                
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">{{ $supplier->name }}</span>
                </div>
                
                @if($supplier->contact_person)
                <div class="info-row">
                    <span class="label">Contact Person:</span>
                    <span class="value">{{ $supplier->contact_person }}</span>
                </div>
                @endif
                
                @if($supplier->email)
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ $supplier->email }}</span>
                </div>
                @endif
                
                @if($supplier->phone)
                <div class="info-row">
                    <span class="label">Phone:</span>
                    <span class="value">{{ $supplier->phone }}</span>
                </div>
                @endif
                
                @if($supplier->address)
                <div class="info-row">
                    <span class="label">Address:</span>
                    <span class="value">{{ $supplier->address }}</span>
                </div>
                @endif
                
                <div class="info-row">
                    <span class="label">Status:</span>
                    <span class="value status-{{ $supplier->status }}">
                        {{ ucfirst($supplier->status) }}
                    </span>
                </div>
                
                <div class="info-row">
                    <span class="label">Created:</span>
                    <span class="value">{{ $supplier->created_at->format('F j, Y') }}</span>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                <p style="margin: 0; color: #7f8c8d;">
                    This email contains the supplier information from our records. 
                    Please contact us if you need any additional details or have questions.
                </p>
            </div>

            @if(!empty($attachment_note))
            <div style="margin-top: 20px; padding: 15px; background-color: #e9f7ef; border-radius: 5px; color: #1e8449;">
                <strong>{{ $attachment_note }}</strong>
            </div>
            @endif
        @endif
    </div>

    <div class="footer">
        <p>This email was generated on {{ now()->format('F j, Y \a\t g:i A') }}</p>
        <p>© {{ date('Y') }} {{ $company['company_name'] ?? 'Company Name' }}. All rights reserved.</p>
    </div>
</body>
</html> 