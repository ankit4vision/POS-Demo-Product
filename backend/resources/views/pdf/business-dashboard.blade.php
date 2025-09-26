<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Business Financial Dashboard Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #2c3e50;
        }
        .header .subtitle {
            margin: 5px 0;
            font-size: 14px;
            color: #7f8c8d;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #2c3e50;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
        }
        .summary-grid {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }
        .summary-item {
            display: table-cell;
            width: 25%;
            padding: 10px;
            text-align: center;
            border: 1px solid #ecf0f1;
            background-color: #f8f9fa;
        }
        .summary-item .label {
            font-weight: bold;
            font-size: 11px;
            color: #7f8c8d;
            margin-bottom: 5px;
        }
        .summary-item .value {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
        }
        .summary-item .amount {
            font-size: 18px;
            font-weight: bold;
            color: #27ae60;
        }
        .summary-item .amount.negative {
            color: #e74c3c;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 10px;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            color: #2c3e50;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .page-break {
            page-break-before: always;
        }
        .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #7f8c8d;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Business Financial Dashboard Report</h1>
        <div class="subtitle">Period: {{ $dateFrom ?? 'All Time' }} to {{ $dateTo ?? 'All Time' }}</div>
        <div class="subtitle">Generated: {{ $generatedAt }}</div>
    </div>

    <!-- Sales Overview -->
    <div class="section">
        <h2>Sales Overview</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="label">Total Sales (+VAT)</div>
                <div class="amount">£{{ number_format($data['sales']['total_sales'] ?? 0, 2) }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Total Paid</div>
                <div class="amount">£{{ number_format($data['sales']['total_paid'] ?? 0, 2) }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Total Wallet Ledger (Outstanding)</div>
                <div class="amount {{ (($data['wallet_ledger'] ?? [])->filter(function($row) { return ($row->party_type === 'customer' || $row->party_type === 'retailer') && $row->current_balance < 0; })->sum('current_balance') ?? 0) > 0 ? 'negative' : '' }}">
                    £{{ number_format(($data['wallet_ledger'] ?? [])->filter(function($row) { return ($row->party_type === 'customer' || $row->party_type === 'retailer') && $row->current_balance < 0; })->sum('current_balance') ?? 0, 2) }}
                </div>
            </div>
            <div class="summary-item">
                <div class="label">Total Outstanding</div>
                <div class="amount {{ ($data['sales']['total_outstanding'] ?? 0) > 0 ? 'negative' : '' }}">
                    £{{ number_format($data['sales']['total_outstanding'] ?? 0, 2) }}
                </div>
            </div>
        </div>
    </div>

    <!-- Purchases Overview -->
    <div class="section">
        <h2>Purchases Overview</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="label">Total Purchases</div>
                <div class="amount">£{{ number_format($data['purchases']['total_purchases'] ?? 0, 2) }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Total Paid</div>
                <div class="amount">£{{ number_format($data['purchases']['total_paid'] ?? 0, 2) }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Total Outstanding</div>
                <div class="amount {{ ($data['purchases']['total_outstanding'] ?? 0) > 0 ? 'negative' : '' }}">
                    £{{ number_format($data['purchases']['total_outstanding'] ?? 0, 2) }}
                </div>
            </div>
        </div>
    </div>

    <!-- Expenses Overview -->
    <div class="section">
        <h2>Expenses Overview</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="label">Total Expenses</div>
                <div class="amount">£{{ number_format($data['expenses']['total_expenses'] ?? 0, 2) }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Expense Categories</div>
                <div class="value">{{ count($data['expense_breakdown']) }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Total Entries</div>
                <div class="value">{{ count($data['all_expenses']) }}</div>
            </div>
        </div>
    </div>

    <!-- Cash Flow Summary -->
    <div class="section">
        <h2>Cash Flow Summary</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="label">Total Inflow</div>
                <div class="amount">£{{ number_format($data['cash_flow']['inflow'] ?? 0, 2) }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Total Outflow</div>
                <div class="amount">£{{ number_format($data['cash_flow']['outflow'] ?? 0, 2) }}</div>
            </div>
            <div class="summary-item">
                <div class="label">Net Cash</div>
                <div class="amount {{ ($data['cash_flow']['net_cash'] ?? 0) < 0 ? 'negative' : '' }}">
                    £{{ number_format($data['cash_flow']['net_cash'] ?? 0, 2) }}
                </div>
            </div>
        </div>
    </div>

    <!-- All Expenses Table -->
    @if(count($data['all_expenses']) > 0)
    <div class="section">
        <h2>All Expenses ({{ count($data['all_expenses']) }} entries)</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th class="text-right">Amount (£)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['all_expenses'] as $expense)
                <tr>
                    <td>{{ $expense->date }}</td>
                    <td>{{ $expense->category }}</td>
                    <td>{{ $expense->description ?: '-' }}</td>
                    <td class="text-right">{{ number_format($expense->amount, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Outstanding Wallet Balances -->
    @if(count($data['wallet_ledger']) > 0)
    <div class="section">
        <h2>Outstanding Wallet Balances</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Contact</th>
                    <th class="text-right">Balance (£)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['wallet_ledger'] as $wallet)
                    @if(($wallet->party_type === 'customer' || $wallet->party_type === 'retailer') && $wallet->current_balance < 0)
                    <tr>
                        <td>{{ $wallet->name }}</td>
                        <td>{{ ucfirst($wallet->party_type) }}</td>
                        <td>{{ $wallet->phone ?: '-' }}</td>
                        <td class="text-right negative">{{ number_format($wallet->current_balance, 2) }}</td>
                    </tr>
                    @endif
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Supplier Outstanding -->
    @if(count($data['supplier_outstanding']) > 0)
    <div class="section">
        <h2>Supplier Outstanding</h2>
        <table>
            <thead>
                <tr>
                    <th>Supplier</th>
                    <th class="text-right">Outstanding (£)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['supplier_outstanding'] as $supplier)
                <tr>
                    <td>{{ $supplier['supplier'] }}</td>
                    <td class="text-right">{{ number_format($supplier['outstanding'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">
        <p>This report was generated automatically by the Krimah POS System.</p>
        <p>For any questions, please contact your system administrator.</p>
    </div>
</body>
</html>
