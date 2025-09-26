<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Sale;
use App\Services\PdfExportService;

echo "Testing PDF Generation...\n";

try {
    // Find a sale
    $sale = Sale::with(['customer', 'items.product'])->first();
    
    if (!$sale) {
        echo "No sales found in database.\n";
        exit(1);
    }
    
    echo "Found sale ID: " . $sale->id . "\n";
    echo "Customer: " . ($sale->customer->name ?? 'Walk-in') . "\n";
    echo "Items count: " . $sale->items->count() . "\n";
    
    // Test PDF generation
    $pdfService = new PdfExportService();
    $pdf = $pdfService->export('pdf.invoice', ['invoice' => $sale], 'test-invoice.pdf');
    
    echo "PDF generated successfully!\n";
    echo "Response type: " . get_class($pdf) . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
} 