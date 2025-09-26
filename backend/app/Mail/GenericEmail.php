<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class GenericEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $body;
    public $fromEmail;
    public $fromName;
    public $attachmentsArray = [];

    /**
     * Create a new message instance.
     */
    public function __construct($subject, $body, $fromEmail = null, $fromName = null, $attachmentsArray = [])
    {
        $this->subject = $subject;
        $this->body = $body;
        $this->fromEmail = $fromEmail;
        $this->fromName = $fromName;
        $this->attachmentsArray = $attachmentsArray;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
            from: $this->fromEmail ? new Address($this->fromEmail, $this->fromName) : null,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: $this->body,
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];
        foreach ($this->attachmentsArray as $file) {
            if (isset($file['data'], $file['name'], $file['mime'])) {
                $attachments[] = \Illuminate\Mail\Mailables\Attachment::fromData(fn() => $file['data'], $file['name'])
                    ->withMime($file['mime']);
            }
        }
        return $attachments;
    }
}
