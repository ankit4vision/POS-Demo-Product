<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Wallet Ledger - {{ $customer->name ?? 'Customer' }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 18px 18px 12px 18px;
            font-size: 12px;
            color: #000;
        }
        .top-bar {
            width: 100%;
            display: table;
            margin-bottom: 10px;
        }
        .top-bar .left {
            display: table-cell;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
            vertical-align: middle;
            text-transform: uppercase;
        }
        .top-bar .right {
            display: table-cell;
            text-align: right;
            vertical-align: middle;
            font-size: 12px;
        }
        .top-bar .meta-row {
            margin-bottom: 0;
        }
        .company-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 2px;
            letter-spacing: 0.5px;
        }
        .company-meta {
            font-size: 12px;
            color: #333;
            margin-bottom: 1px;
        }
        .header-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
            margin-bottom: 10px;
        }
        .header-table td {
            vertical-align: top;
            padding: 0 4px 0 0;
        }
        .header-table .company-cell {
            width: 50%;
        }
        .header-table .info-cell {
            width: 50%;
            text-align: right;
        }
        .info-table {
            width: 100%;
            margin-bottom: 6px;
        }
        .info-table td {
            padding: 1px 4px 1px 0;
            font-size: 12px;
        }
        .section-title {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 6px;
            margin-top: 16px;
            letter-spacing: 0.5px;
            color: #000;
            text-transform: uppercase;
        }
        .summary-cards {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }
        .summary-card {
            display: table-cell;
            width: 25%;
            text-align: center;
            padding: 8px;
            border: 1px solid #000;
            margin-right: 4px;
        }
        .summary-card:last-child {
            margin-right: 0;
        }
        .summary-card .amount {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 2px;
        }
        .summary-card .label {
            font-size: 10px;
            color: #333;
        }
        .transactions-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .transactions-table th {
            background-color: #f0f0f0;
            border: 1px solid #000;
            padding: 6px 4px;
            font-size: 11px;
            font-weight: bold;
            text-align: center;
        }
        .transactions-table td {
            border: 1px solid #000;
            padding: 4px;
            font-size: 11px;
        }
        .text-start { text-align: left; }
        .text-center { text-align: center; }
        .text-end { text-align: right; }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #333;
            border-top: 1px solid #000;
            padding-top: 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            background-color: #f0f0f0;
            color: #000;
            border: 1px solid #000;
        }
        .balance-positive {
            color: #000;
            font-weight: bold;
        }
        .balance-negative {
            color: #000;
            font-weight: bold;
        }
        .balance-zero {
            color: #333;
        }
    </style>
</head>
<body>
    <!-- Top Bar: WALLET LEDGER (left) and Report Meta (right) -->
    <div class="top-bar">
        <div class="left">WALLET LEDGER</div>
        <div class="right">
            <div class="meta-row"><strong>Generated:</strong> {{ \Carbon\Carbon::now()->format('Y-m-d H:i') }}</div>
            <div class="meta-row"><strong>Customer:</strong> {{ $customer->name ?? 'N/A' }}</div>
            <div class="meta-row"><strong>Wallet ID:</strong> {{ $wallet->id }}</div>
        </div>
    </div>
    <hr style="border:0;border-top:1.5px solid #000;margin:0 0 10px 0;">
    
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
                <div class="company-name">{{ $customer->name ?? 'Customer Name' }}</div>
                <div class="company-meta">Email: {{ $customer->email ?? '-' }}</div>
                <div class="company-meta">Phone: {{ $customer->phone ?? '-' }}</div>
                <div class="company-meta">Address: {{ $customer->address ?? '-' }}</div>
                @if($customer->type)
                <div class="company-meta">Type: {{ ucfirst($customer->type) }}</div>
                @endif
            </td>
        </tr>
    </table>

    <!-- Summary Cards -->
    <div class="section-title">Summary</div>
    <div class="summary-cards">
        <div class="summary-card">
            <div class="amount balance-{{ $summary['current_balance'] > 0 ? 'positive' : ($summary['current_balance'] < 0 ? 'negative' : 'zero') }}">
                £{{ number_format($summary['current_balance'], 2) }}
            </div>
            <div class="label">Current Balance</div>
        </div>
        <div class="summary-card">
            <div class="amount">£{{ number_format($summary['total_credit'], 2) }}</div>
            <div class="label">Total Credit</div>
        </div>
        <div class="summary-card">
            <div class="amount">£{{ number_format($summary['total_debit'], 2) }}</div>
            <div class="label">Total Debit</div>
        </div>
        <div class="summary-card">
            <div class="amount">{{ $summary['total_transactions'] }}</div>
            <div class="label">Total Transactions</div>
        </div>
    </div>

    <!-- Transactions List -->
    <div class="section-title">Transaction History</div>
    @if($transactions->count() > 0)
    <table class="transactions-table">
        <thead>
            <tr>
                <th style="text-align: center; width: 8%;">#</th>
                <th style="text-align: center; width: 15%;">Date & Time</th>
                <th style="text-align: center; width: 10%;">Type</th>
                <th style="text-align: right; width: 15%;">Amount</th>
                <th style="text-align: left; width: 25%;">Description</th>
                <th style="text-align: center; width: 12%;">Payment Method</th>
                <th style="text-align: center; width: 10%;">Reference</th>
                <th style="text-align: right; width: 15%;">Running Balance</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $idx => $transaction)
            <tr>
                <td style="text-align: center;">{{ $idx + 1 }}</td>
                <td style="text-align: center;">{{ \Carbon\Carbon::parse($transaction->created_at)->format('Y-m-d H:i') }}</td>
                <td style="text-align: center;">
                    <span class="status-badge">
                        {{ ucfirst($transaction->type) }}
                    </span>
                </td>
                <td style="text-align: right;">£{{ number_format($transaction->amount, 2) }}</td>
                <td style="text-align: left;">{{ $transaction->description ?? '-' }}</td>
                <td style="text-align: center;">{{ ucfirst(str_replace('_', ' ', $transaction->payment_method)) ?? '-' }}</td>
                <td style="text-align: center;">{{ $transaction->reference ?? '-' }}</td>
                <td style="text-align: right;" class="balance-{{ $transaction->running_balance > 0 ? 'positive' : ($transaction->running_balance < 0 ? 'negative' : 'zero') }}">
                    £{{ number_format($transaction->running_balance, 2) }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div style="text-align: center; padding: 20px; color: #666;">
        No transactions found for this wallet.
    </div>
    @endif

    <!-- Notes Section -->
    <div class="section-title">Notes</div>
    <div style="margin-bottom: 10px; padding: 8px; border: 1px solid #000; background-color: #f9f9f9;">
        <div style="font-size: 11px; margin-bottom: 4px;"><strong>Transaction Types:</strong></div>
        <div style="font-size: 10px; margin-bottom: 2px;">• <strong>Credit (Jama):</strong> Money received from customer or added to wallet balance</div>
        <div style="font-size: 10px; margin-bottom: 2px;">• <strong>Debit (Udhar):</strong> Money given to customer, used by invoice, or deducted from wallet balance</div>
        <div style="font-size: 10px; margin-bottom: 2px;">• <strong>Positive Balance:</strong> Customer owes money to the company</div>
        <div style="font-size: 10px;">• <strong>Negative Balance:</strong> Company owes money to the customer</div>
    </div>
    
    <div class="footer">
        {{ $siteSettings['invoice_footer_text'] ?? 'This wallet ledger report was generated on ' . \Carbon\Carbon::now()->format('Y-m-d H:i:s') . '. Please retain this document for your records.' }}
    </div>
</body>
</html> 