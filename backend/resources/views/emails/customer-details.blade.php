<html>
<body style="font-family: Arial, sans-serif; color: #222; font-size: 15px;">
    <h2 style="margin-bottom: 8px;">Customer Details Report</h2>
    <p>Hello,</p>
    <p>Please find attached the detailed report for customer <b>{{ $customer->name }}</b>.</p>
    @if(!empty($attachment_note))
        <p style="color: #555; font-size: 13px;">{{ $attachment_note }}</p>
    @endif
    <hr style="margin: 18px 0; border: none; border-top: 1px solid #eee;">
    <div style="font-size: 13px; color: #666;">
        <b>{{ $company['company_name'] ?? 'Company' }}</b><br>
        @if(!empty($company['address'])){{ $company['address'] }}<br>@endif
        @if(!empty($company['email']))Email: {{ $company['email'] }}<br>@endif
        @if(!empty($company['phone']))Phone: {{ $company['phone'] }}<br>@endif
    </div>
    <div style="font-size: 12px; color: #aaa; margin-top: 12px;">Generated on {{ date('Y-m-d H:i') }}</div>
</body>
</html> 