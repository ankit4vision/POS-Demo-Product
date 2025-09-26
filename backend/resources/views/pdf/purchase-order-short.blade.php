<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>PURCHASE RECEIPT {{ $purchaseOrder->po_number }}</title>
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
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #333;
            border-top: 1px solid #000;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <!-- Top Bar: PURCHASE RECEIPT (left) and PO Meta (right) -->
    <div class="top-bar">
        <div class="left">PURCHASE RECEIPT</div>
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
            <td><strong>Last Updated:</strong></td>
            <td>{{ \Carbon\Carbon::parse($purchaseOrder->updated_at)->format('Y-m-d H:i') }}</td>
        </tr>
        @if($purchaseOrder->reference)
        <tr>
            <td><strong>Reference:</strong></td>
            <td>{{ $purchaseOrder->reference }}</td>
        </tr>
        @endif
        @if($purchaseOrder->notes)
        <tr>
            <td><strong>Notes:</strong></td>
            <td>{{ $purchaseOrder->notes }}</td>
        </tr>
        @endif
    </table>

    <!-- Products List -->
    <div class="section-title">Order Items</div>
    <table class="products-table">
        <thead>
            <tr>
                <th style="text-align: center; width: 10%;">#</th>
                <th style="text-align: left; width: 70%;">Product</th>
                <th style="text-align: center; width: 20%;">Qty</th>
            </tr>
        </thead>
        <tbody>
            @php $totalQty = 0; @endphp
            @foreach($purchaseOrder->items as $idx => $item)
            @php $totalQty += $item->quantity; @endphp
            <tr>
                <td style="text-align: center;">{{ $idx + 1 }}</td>
                <td style="text-align: left;">{{ $item->product->name ?? '-' }}</td>
                <td style="text-align: center;">{{ $item->quantity }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="totals-row">
        <strong>Total Items:</strong> {{ count($purchaseOrder->items) }} &nbsp; | &nbsp; <strong>Total Qty:</strong> {{ $totalQty }}
    </div>
    
    <div class="footer">
        {{ $siteSettings['invoice_footer_text'] ?? 'This receipt confirms delivery of goods as per Purchase Order #' . $purchaseOrder->po_number . '. Please retain this document for your records.' }}
    </div>
</body>
</html> 