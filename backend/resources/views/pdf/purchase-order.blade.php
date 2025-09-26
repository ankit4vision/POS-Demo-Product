<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Purchase Order #{{ $purchaseOrder->po_number }}</title>
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
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .products-table th {
            background-color: #f0f0f0;
            border: 1px solid #000;
            padding: 6px 4px;
            font-size: 11px;
            font-weight: bold;
            text-align: center;
        }
        .products-table td {
            border: 1px solid #000;
            padding: 4px;
            font-size: 11px;
        }
        .text-start { text-align: left; }
        .text-center { text-align: center; }
        .text-end { text-align: right; }
        .totals-row {
            font-size: 11px;
            margin-bottom: 10px;
            color: #333;
        }
        .bottom-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
        }
        .bottom-table td {
            vertical-align: top;
            padding: 0 4px 0 0;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .summary-table td {
            padding: 2px 4px;
            font-size: 11px;
            border-bottom: 1px solid #000;
        }
        .summary-table .label {
            font-weight: bold;
            width: 60%;
        }
        .summary-table .value {
            text-align: right;
            width: 40%;
        }
        .summary-table .final {
            border-top: 2px solid #000;
            font-weight: bold;
            font-size: 12px;
        }
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
        .transactions-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .transactions-table th {
            background-color: #f0f0f0;
            border: 1px solid #000;
            padding: 4px;
            font-size: 10px;
            font-weight: bold;
            text-align: center;
        }
        .transactions-table td {
            border: 1px solid #000;
            padding: 3px;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <!-- Top Bar: PURCHASE ORDER (left) and PO Meta (right) -->
    <div class="top-bar">
        <div class="left">PURCHASE ORDER</div>
        <div class="right">
            <div class="meta-row"><strong>PO Number:</strong> {{ $purchaseOrder->po_number }}</div>
            <div class="meta-row"><strong>Order Date:</strong> {{ \Carbon\Carbon::parse($purchaseOrder->order_date)->format('Y-m-d') }}</div>
            <div class="meta-row"><strong>Expected Delivery:</strong> {{ \Carbon\Carbon::parse($purchaseOrder->expected_delivery_date)->format('Y-m-d') }}</div>
        </div>
    </div>
    <hr style="border:0;border-top:1.5px solid #000;margin:0 0 10px 0;">
    
    <!-- Header: Company and Supplier Info (Table) -->
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
                <div class="company-name">{{ $purchaseOrder->supplier->name ?? 'Supplier Name' }}</div>
                <div class="company-meta">Email: {{ $purchaseOrder->supplier->email ?? '-' }}</div>
                <div class="company-meta">Phone: {{ $purchaseOrder->supplier->phone ?? '-' }}</div>
                <div class="company-meta">Address: {{ $purchaseOrder->supplier->address ?? '-' }}</div>
            </td>
        </tr>
    </table>

    <!-- Order Information -->
    <div class="section-title">Order Information</div>
    <table class="info-table">
        <tr>
            <td><strong>Payment Status:</strong></td>
            <td>{{ ucfirst($purchaseOrder->paid_status) }}</td>
            <td><strong>Created By:</strong></td>
            <td>{{ $purchaseOrder->creator->name ?? 'System' }}</td>
        </tr>
        <tr>
            <td><strong>Last Updated:</strong></td>
            <td>{{ \Carbon\Carbon::parse($purchaseOrder->updated_at)->format('Y-m-d H:i') }}</td>
        </tr>
        @if($purchaseOrder->reference)
        <tr>
            <td><strong>Reference:</strong></td>
            <td colspan="3">{{ $purchaseOrder->reference }}</td>
        </tr>
        @endif
        @if($purchaseOrder->notes)
        <tr>
            <td><strong>Notes:</strong></td>
            <td colspan="3">{{ $purchaseOrder->notes }}</td>
        </tr>
        @endif
    </table>

    <!-- Products List -->
    <div class="section-title">Order Items</div>
    <table class="products-table">
        <thead>
            <tr>
                <th style="text-align: center; width: 5%;">#</th>
                <th style="text-align: left; width: 45%;">Product + Description</th>
                <th style="text-align: center; width: 15%;">Qty</th>
                <th style="text-align: right; width: 17.5%;">Unit Price</th>
                <th style="text-align: right; width: 17.5%;">Total</th>
            </tr>
        </thead>
        <tbody>
            @php $totalQty = 0; @endphp
            @foreach($purchaseOrder->items as $idx => $item)
            @php $totalQty += $item->quantity; @endphp
            <tr>
                <td style="text-align: center;">{{ $idx + 1 }}</td>
                <td style="text-align: left;">
                    <strong>{{ $item->product->name ?? '-' }}</strong><br>
                    <small>{{ $item->product->description ?? 'No description available' }}</small>
                </td>
                <td style="text-align: center;">{{ $item->quantity }}</td>
                <td style="text-align: right;">£{{ number_format($item->unit_price, 2) }}</td>
                <td style="text-align: right;">£{{ number_format($item->total_amount, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="totals-row">
        <strong>Total Items:</strong> {{ count($purchaseOrder->items) }} &nbsp; | &nbsp; <strong>Total Qty:</strong> {{ $totalQty }}
    </div>

    <!-- Payment Transactions -->
    @if($purchaseOrder->transactions && $purchaseOrder->transactions->count() > 0)
    <div class="section-title">Payment Transactions</div>
    <table class="transactions-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Reference</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($purchaseOrder->transactions as $transaction)
            <tr>
                <td class="text-center">{{ \Carbon\Carbon::parse($transaction->payment_date)->format('Y-m-d') }}</td>
                <td class="text-end">£{{ number_format($transaction->amount, 2) }}</td>
                <td class="text-center">{{ ucfirst(str_replace('_', ' ', $transaction->payment_method)) }}</td>
                <td class="text-center">
                    <span class="status-badge">
                        {{ ucfirst($transaction->status) }}
                    </span>
                </td>
                <td class="text-center">{{ $transaction->reference_number ?? '-' }}</td>
                <td class="text-start">{{ $transaction->notes ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- Bottom: Financial Summary Only -->
    <table class="bottom-table">
        <tr>
            <td style="width:100%;vertical-align:top;">
                <div class="section-title" style="text-align:right;">FINANCIAL SUMMARY</div>
                <table class="summary-table">
                    <tr><td class="label">Subtotal:</td><td class="value">£{{ number_format($purchaseOrder->subtotal ?? 0, 2) }}</td></tr>
                    <tr class="final"><td class="label">Total Amount:</td><td class="value">£{{ number_format($purchaseOrder->total_amount ?? 0, 2) }}</td></tr>
                    <tr><td class="label">Paid Amount:</td><td class="value">£{{ number_format($purchaseOrder->paid_amount ?? 0, 2) }}</td></tr>
                    <tr><td class="label">Remaining Amount:</td><td class="value">£{{ number_format(($purchaseOrder->total_amount ?? 0) - ($purchaseOrder->paid_amount ?? 0), 2) }}</td></tr>
                </table>
            </td>
        </tr>
    </table>
    
    <div class="footer">
        {{ $siteSettings['invoice_footer_text'] ?? 'Thank you for your business!' }}
    </div>
</body>
</html> 