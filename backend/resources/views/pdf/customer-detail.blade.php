<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customer Report - {{ $customer->name }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; margin: 18px 18px 12px 18px; font-size: 12px; color: #222; }
        .top-bar { width: 100%; display: table; margin-bottom: 10px; }
        .top-bar .left { display: table-cell; font-size: 18px; font-weight: bold; letter-spacing: 1px; vertical-align: middle; text-transform: uppercase; }
        .top-bar .right { display: table-cell; text-align: right; vertical-align: middle; font-size: 12px; }
        .top-bar .meta-row { margin-bottom: 0; }
        .company-name { font-size: 14px; font-weight: bold; margin-bottom: 2px; letter-spacing: 0.5px; }
        .company-meta { font-size: 12px; color: #555; margin-bottom: 1px; }
        .header-table { width: 100%; border-collapse: separate; border-spacing: 0 0; margin-bottom: 10px; }
        .header-table td { vertical-align: top; padding: 0 4px 0 0; }
        .header-table .company-cell { width: 50%; }
        .header-table .info-cell { width: 50%; text-align: right; }
        .section-title { font-weight: bold; font-size: 12px; margin-bottom: 6px; margin-top: 16px; letter-spacing: 0.5px; color: #2d2d2d; text-transform: uppercase; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .info-table th { background: #f2f2f2; font-weight: bold; font-size: 12px; padding: 5px 3px; border: 1px solid #e0e0e0; text-align: left; }
        .info-table td { border: 1px solid #e0e0e0; padding: 5px 3px; font-size: 12px; }
        .summary-cards { display: table; width: 100%; margin-bottom: 10px; }
        .summary-card { display: table-cell; width: 20%; padding: 8px; text-align: center; border: 1px solid #e0e0e0; background: #f9f9f9; }
        .summary-card .value { font-size: 16px; font-weight: bold; color: #333; }
        .summary-card .label { font-size: 10px; color: #666; margin-top: 2px; }
        .transactions-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
        .transactions-table th { background: #f2f2f2; font-weight: bold; font-size: 12px; padding: 5px 3px; border: 1px solid #e0e0e0; }
        .transactions-table th.text-center { text-align: center; }
        .transactions-table th.text-start { text-align: left; }
        .transactions-table th.text-end { text-align: right; }
        .transactions-table td { border: 1px solid #e0e0e0; padding: 5px 3px; font-size: 12px; }
        .transactions-table td.text-center { text-align: center; }
        .transactions-table td.text-start { text-align: left; }
        .transactions-table td.text-end { text-align: right; }
        .footer { margin-top: 24px; text-align: center; font-size: 12px; color: #333; letter-spacing: 0.5px; }
        .status-badge { padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .status-active { background: #d4edda; color: #155724; }
        .status-inactive { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <!-- Top Bar: CUSTOMER REPORT (left) and Report Meta (right) -->
    <div class="top-bar">
        <div class="left">CUSTOMER REPORT</div>
        <div class="right">
            <div class="meta-row"><strong>Generated:</strong> {{ \Carbon\Carbon::now()->format('Y-m-d H:i') }}</div>
            <div class="meta-row"><strong>Customer ID:</strong> {{ $customer->id }}</div>
        </div>
    </div>
    <hr style="border:0;border-top:1.5px solid #bbb;margin:0 0 10px 0;">
    <!-- Header: Company and Customer Info (Table) -->
    <table class="header-table">
        <tr>
            <td class="company-cell">
                @if(($siteSettings['show_company_info_on_invoice'] ?? '0') === '1')
                    <div class="company-name">{{ $company['company_name'] ?? 'Company Name' }}</div>
                    @if(!empty($company['address']))<div class="company-meta">{{ $company['address'] }}</div>@endif
                    @if(!empty($company['email']))<div class="company-meta">Email: {{ $company['email'] }}</div>@endif
                    @if(!empty($company['phone']))<div class="company-meta">Phone: {{ $company['phone'] }}</div>@endif
                @endif
            </td>
            <td class="info-cell">
                <div class="company-name">{{ $customer->name }}</div>
                <div class="company-meta">Email: {{ $customer->email ?? '-' }}</div>
                <div class="company-meta">Phone: {{ $customer->phone ?? '-' }}</div>
            </td>
        </tr>
    </table>
    <!-- Customer Information -->
    <div class="section-title">Customer Information</div>
    <table class="info-table">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td><strong>Name</strong></td><td>{{ $customer->name }}</td></tr>
        <tr><td><strong>Email</strong></td><td>{{ $customer->email ?? '-' }}</td></tr>
        <tr><td><strong>Phone</strong></td><td>{{ $customer->phone ?? '-' }}</td></tr>
        <tr><td><strong>VAT Number</strong></td><td>{{ $customer->gst_number ?? '-' }}</td></tr>
        <tr><td><strong>Address</strong></td><td>{{ $customer->address ?? '-' }}</td></tr>
        <tr>
            <td><strong>Amount to Collect from Customer</strong></td>
            <td style="font-size:15px;font-weight:bold;color:#721c24;background:#fff3cd;border:1px solid #ffeeba;border-radius:8px;padding:6px 12px;">
                £{{ number_format($amount_to_collect, 2) }}
            </td>
        </tr>
    </table>
    <!-- Wallet Summary Cards -->
    <div class="section-title">Wallet Summary</div>
    <div class="summary-cards">
        <div class="summary-card"><div class="value">{{ $wallet_summary['num_wallet_transactions'] ?? 0 }}</div><div class="label"># Transactions</div></div>
        <div class="summary-card"><div class="value">£{{ number_format($wallet_summary['total_debit'] ?? 0, 2) }}</div><div class="label">Total Debit</div></div>
        <div class="summary-card"><div class="value">£{{ number_format($wallet_summary['total_credit'] ?? 0, 2) }}</div><div class="label">Total Credit</div></div>
        <div class="summary-card"><div class="value">£{{ number_format($wallet_summary['current_balance'] ?? 0, 2) }}</div><div class="label">Current Balance</div></div>
    </div>
    <!-- All Wallet Transactions -->
    @if(isset($wallet_transactions) && count($wallet_transactions) > 0)
    <div class="section-title">All Wallet Transactions</div>
    <table class="transactions-table">
        <thead>
            <tr>
                <th class="text-center">#</th>
                <th class="text-center">Date</th>
                <th class="text-center">Type</th>
                <th class="text-end">Amount</th>
                <th class="text-start">Description</th>
                <th class="text-end">Balance</th>
            </tr>
        </thead>
        <tbody>
            @foreach($wallet_transactions as $idx => $tx)
            <tr>
                <td class="text-center">{{ $idx + 1 }}</td>
                <td class="text-center">{{ \Carbon\Carbon::parse($tx->created_at)->format('Y-m-d H:i') }}</td>
                <td class="text-center">{{ ucfirst($tx->type) }}</td>
                <td class="text-end">£{{ number_format($tx->amount, 2) }}</td>
                <td class="text-start">{{ $tx->description ?? '-' }}</td>
                <td class="text-end">{{ isset($tx->running_balance) ? '£' . number_format($tx->running_balance, 2) : '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif
    <!-- Sales Summary Cards -->
    <div class="section-title">Sales/Invoices Summary</div>
    <div class="summary-cards">
        <div class="summary-card"><div class="value">{{ $sales_summary['num_sales'] ?? 0 }}</div><div class="label"># Sales</div></div>
        <div class="summary-card"><div class="value">£{{ number_format($sales_summary['total_sales'] ?? 0, 2) }}</div><div class="label">Total Sales</div></div>
        <div class="summary-card"><div class="value">£{{ number_format($sales_summary['total_paid'] ?? 0, 2) }}</div><div class="label">Total Paid</div></div>
        <div class="summary-card"><div class="value">£{{ number_format($sales_summary['total_due'] ?? 0, 2) }}</div><div class="label">Outstanding</div></div>
    </div>
    <!-- All Sales/Invoices -->
    @if(isset($sales) && count($sales) > 0)
    <div class="section-title">All Sales/Invoices</div>
    <table class="transactions-table">
        <thead>
            <tr>
                <th class="text-center">#</th>
                <th class="text-center">Date</th>
                <th class="text-center">Invoice #</th>
                <th class="text-end">Amount</th>
                <th class="text-end">Paid</th>
                <th class="text-end">Due</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sales as $idx => $sale)
            <tr>
                <td class="text-center">{{ $idx + 1 }}</td>
                <td class="text-center">{{ \Carbon\Carbon::parse($sale->created_at)->format('Y-m-d') }}</td>
                <td class="text-center">{{ $sale->invoice_ref ?? $sale->id }}</td>
                <td class="text-end">£{{ number_format($sale->grand_total, 2) }}</td>
                <td class="text-end">£{{ number_format($sale->paid, 2) }}</td>
                <td class="text-end">£{{ number_format($sale->due, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif
    <div class="footer">
        {{ $siteSettings['invoice_footer_text'] ?? 'Customer Report Generated on ' . \Carbon\Carbon::now()->format('Y-m-d H:i:s') }}
    </div>
</body>
</html> 