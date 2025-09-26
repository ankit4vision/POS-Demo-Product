<html>
<head>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #333; padding: 2px 6px; text-align: left; vertical-align: top; line-height: 1.25; }
        th { background: #f2f2f2; }
        h2 { margin-bottom: 0; }
        .company-info { margin-bottom: 8px; }
        .company-info div { line-height: 1.3; }
        .product-info-pre { white-space: normal; font-size: 11px; line-height: 1.25; padding-top: 0; padding-bottom: 0; }
        .product-info-pre b { margin: 0; padding: 0; }
        .stock-red { color: #d32f2f; font-weight: bold; }
        .stock-orange { color: #f9a825; font-weight: bold; }
    </style>
</head>
<body>
    @if(($siteSettings['show_company_info_on_invoice'] ?? '0') === '1')
    <div class="company-info">
        <h2>{{ $company['company_name'] ?? ($company['name'] ?? 'Company') }}</h2>
        @if(!empty($company['address']))<div>{{ $company['address'] }}</div>@endif
        @if(!empty($company['phone']))<div>Phone: {{ $company['phone'] }}</div>@endif
        @if(!empty($company['email']))<div>Email: {{ $company['email'] }}</div>@endif
    </div>
    @endif
    <div><strong>Product List 
        @if($withPrice ?? false)(Price Type: {{ $priceType }})@endif
        @if(($stockFilter ?? 'all') === 'available')(Available Stock Only)@endif
    </strong></div>
    <table>
        <thead>
            <tr>
                @foreach($columns as $col)
                    <th>{{ $col }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($rows as $row)
                <tr>
                    @foreach($columns as $col)
                        @if($col === 'Product Info')
                            @php
                                $lines = explode("\n", $row[$col] ?? '');
                                $firstLine = array_shift($lines);
                            @endphp
                            <td class="product-info-pre">
                                @if($firstLine && trim($firstLine) !== '')
                                    @php
                                        $parts = explode(' | ', $firstLine, 2);
                                    @endphp
                                    {{ $parts[0] }}@if(isset($parts[1]) && trim($parts[1]) !== '') | {{ $parts[1] }}@endif
                                @endif
                                @foreach($lines as $line)
                                    @if(trim($line) !== '')
                                        <div style="margin:0;padding:0;line-height:1;">{{ $line }}</div>
                                    @endif
                                @endforeach
                            </td>
                        @elseif($col === 'Stock')
                            @php $stockVal = $row[$col] ?? ''; @endphp
                            @if($stockVal === 'Out of Stock')
                                <td class="stock-red">{{ $stockVal }}</td>
                            @elseif($stockVal === 'Low Stock')
                                <td class="stock-orange">{{ $stockVal }}</td>
                            @else
                                <td>{{ $stockVal }}</td>
                            @endif
                        @else
                            <td>{{ $row[$col] ?? '' }}</td>
                        @endif
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>
    <div style="margin-top: 20px; text-align: center; font-size: 11px; color: #333; border-top: 1px solid #333; padding-top: 10px;">
        {{ $siteSettings['invoice_footer_text'] ?? 'Product List Generated on ' . \Carbon\Carbon::now()->format('Y-m-d H:i:s') }}
    </div>
</body>
</html> 