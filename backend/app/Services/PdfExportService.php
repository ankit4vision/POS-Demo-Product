<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;

class PdfExportService
{
    /**
     * Render a Blade view as PDF and return as a download response.
     *
     * @param string $view The Blade view path (e.g. 'pdf.invoice')
     * @param array $data Data to pass to the view
     * @param string $filename The filename for download
     * @return \Illuminate\Http\Response
     */
    public function export($view, $data, $filename = 'export.pdf')
    {
        $pdf = Pdf::loadView($view, $data);
        return $pdf->download($filename);
    }

    /**
     * Render a Blade view as PDF and return as a stream (for browser preview).
     */
    public function stream($view, $data, $filename = 'export.pdf')
    {
        $pdf = Pdf::loadView($view, $data);
        return $pdf->stream($filename);
    }

    /**
     * Render a Blade view as PDF and return raw PDF data (for email attachment).
     *
     * @param string $view The Blade view path (e.g. 'pdf.invoice')
     * @param array $data Data to pass to the view
     * @return string Raw PDF binary data
     */
    public function raw($view, $data)
    {
        $pdf = Pdf::loadView($view, $data);
        return $pdf->output();
    }
} 