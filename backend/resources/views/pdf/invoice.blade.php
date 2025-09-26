<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>PROFORMA #{{ $invoice->invoice_ref ?? $invoice->id }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 18px 18px 12px 18px;
            font-size: 12px;
            color: #222;
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
            color: #555;
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
            color: #2d2d2d;
            text-transform: uppercase;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 4px;
        }
        .products-table th {
            background: #f2f2f2;
            font-weight: bold;
            font-size: 12px;
            padding: 5px 3px;
            border: 1px solid #e0e0e0;
        }
        .products-table th.text-center {
            text-align: center;
        }
        .products-table th.text-start {
            text-align: left;
        }
        .products-table th.text-end {
            text-align: right;
        }
        .products-table td {
            border: 1px solid #e0e0e0;
            padding: 5px 3px;
            font-size: 12px;
        }
        .products-table td.text-center {
            text-align: center;
        }
        .products-table td.text-start {
            text-align: left;
        }
        .products-table td.text-end {
            text-align: right;
        }
        .products-table tr:last-child td {
            border: 1px solid #e0e0e0;
        }
        .totals-row {
            font-size: 12px;
            margin-bottom: 10px;
            margin-top: 2px;
        }
        .totals-row strong {
            font-weight: 600;
        }
        .bottom-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0;
            margin-top: 10px;
        }
        .bottom-table td {
            vertical-align: top;
            padding: 0 4px 0 0;
        }
        .payment-list {
            font-size: 12px;
            margin: 0;
            padding-left: 14px;
        }
        .payment-list li {
            margin-bottom: 2px;
        }
        .summary-table {
            width: 100%;
            margin-top: 0;
            border-spacing: 0;
        }
        .summary-table td {
            padding: 4px 3px;
            font-size: 12px;
        }
        .summary-table .label {
            text-align: right;
            color: #555;
        }
        .summary-table .value {
            text-align: right;
            font-weight: bold;
            color: #222;
        }
        .summary-table .final {
            font-size: 13px;
            border-top: 1px solid #333;
            padding-top: 5px;
            color: #1a1a1a;
        }
        .footer {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #333;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <!-- Top Bar: PERFORMANCE (left) and Invoice Meta (right) -->
    <div class="top-bar">
        <div class="left">PROFORMA</div>
        <div class="right">
            <div class="meta-row"><strong>PROFORMA:</strong> {{ $invoice->invoice_ref ?? $invoice->id }}</div>
            <div class="meta-row"><strong>Date:</strong> {{ \Carbon\Carbon::parse($invoice->created_at)->format('Y-m-d') }}</div>
            <div class="meta-row"><strong>Time:</strong> {{ \Carbon\Carbon::parse($invoice->created_at)->format('H:i') }}</div>
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
                <div class="company-name">{{ $invoice->customer->name ?? 'Walk-in' }}</div>
                <div class="company-meta">Type: {{ $invoice->customer->type ?? '-' }}</div>
                <div class="company-meta">Mobile: {{ $invoice->customer->phone ?? '-' }}</div>
                @if(!empty($invoice->customer->email))<div class="company-meta">Email: {{ $invoice->customer->email }}</div>@endif
                @if(!empty($invoice->customer->address))<div class="company-meta">Address: {{ $invoice->customer->address }}</div>@endif
            </td>
        </tr>
    </table>
    <!-- Products List -->
    <div class="section-title">Products</div>
    <table class="products-table">
        <thead>
            <tr>
                <th class="text-center">#</th>
                <th class="text-start">Product</th>
                <th class="text-center">Qty</th>
                <th class="text-end">Price</th>
                <th class="text-end">Discount</th>
                @if(($siteSettings['hide_vat_from_everywhere'] ?? '1') !== '1')
                <th class="text-end">VAT</th>
                @endif
                <th class="text-end">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @php $totalQty = 0; @endphp
            @foreach($invoice->items as $idx => $item)
            @php $totalQty += $item->qty; @endphp
            <tr>
                <td class="text-center">{{ $idx + 1 }}</td>
                <td class="text-start">{{ $item->product->name ?? '-' }}</td>
                <td class="text-center">{{ $item->qty }}</td>
                <td class="text-end">£{{ number_format($item->price, 2) }}</td>
                <td class="text-end">{{ $item->discount ? '£' . number_format($item->discount, 2) : '-' }}</td>
                @if(($siteSettings['hide_vat_from_everywhere'] ?? '1') !== '1')
                <td class="text-end">{{ $item->tax ? '£' . number_format($item->tax, 2) : '-' }}</td>
                @endif
                <td class="text-end">£{{ number_format($item->subtotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="totals-row">
        <strong>Total Items:</strong> {{ count($invoice->items) }} &nbsp; | &nbsp; <strong>Total Qty:</strong> {{ $totalQty }}
    </div>
    <!-- Bottom: Two Columns (Table) -->
    <table class="bottom-table">
        <tr>
            <td style="width:50%;vertical-align:top;">
                <div class="section-title">Payment Breakdown</div>
                @if(isset($invoice->sales_transactions) && count($invoice->sales_transactions) > 0)
                <ul class="payment-list">
                    @foreach($invoice->sales_transactions as $txn)
                    <li>
                        <strong>{{ strtoupper($txn->payment_type) }}:</strong>
                        £{{ number_format($txn->amount, 2) }}
                        @if($txn->description)
                            <span style="color:#888;">- {{ $txn->description }}</span>
                        @endif
                    </li>
                    @endforeach
                </ul>
                @else
                <div style="color:#888;">No payment info available.</div>
                @endif
            </td>
            <td style="width:50%;vertical-align:top;">
                <div class="section-title" style="text-align:right;">SUMMARY</div>
                <table class="summary-table">
                    <tr><td class="label">Subtotal:</td><td class="value">£{{ number_format($invoice->subtotal ?? 0, 2) }}</td></tr>
                    <tr><td class="label">Total Discount:</td><td class="value">£{{ number_format($invoice->total_discount ?? 0, 2) }}</td></tr>
                    @if(($siteSettings['hide_vat_from_everywhere'] ?? '1') !== '1')
                    <tr><td class="label">Total VAT:</td><td class="value">£{{ number_format($invoice->total_tax ?? 0, 2) }}</td></tr>
                    @endif
                    <tr><td class="label">Grand Total:</td><td class="value">£{{ number_format($invoice->grand_total ?? 0, 2) }}</td></tr>
                    <tr><td class="label">Round Off:</td><td class="value">{{ ($invoice->round_off ?? 0) > 0 ? '+' : '' }}£{{ number_format($invoice->round_off ?? 0, 2) }}</td></tr>
                    <tr class="final"><td class="label">Final Payable:</td><td class="value">£{{ number_format($invoice->rounded_total ?? 0, 2) }}</td></tr>
                    <tr><td class="label">Paid:</td><td class="value">£{{ number_format($invoice->paid ?? 0, 2) }}</td></tr>
                    <tr><td class="label">Due:</td><td class="value">£{{ number_format($invoice->due ?? 0, 2) }}</td></tr>
                </table>
            </td>
        </tr>
    </table>
    <div class="footer">
        {{ $siteSettings['invoice_footer_text'] ?? 'Thank you for your business!' }}
    </div>
</body>
</html> 