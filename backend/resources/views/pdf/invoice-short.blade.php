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
        .totals-row {
            font-size: 12px;
            margin-bottom: 10px;
            margin-top: 2px;
        }
        .totals-row strong {
            font-weight: 600;
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
    <!-- Top Bar: INVOICE (left) and Invoice Meta (right) -->
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
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="totals-row">
        <strong>Total Items:</strong> {{ count($invoice->items) }} &nbsp; | &nbsp; <strong>Total Qty:</strong> {{ $totalQty }}
    </div>
    <div class="footer">
        {{ $siteSettings['invoice_footer_text'] ?? 'Thank you for your business!' }}
    </div>
</body>
</html> 