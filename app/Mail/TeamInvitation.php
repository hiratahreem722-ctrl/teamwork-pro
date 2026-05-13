<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TeamInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User   $member,
        public User   $owner,
        public string $tempPassword,
        public string $role,          // 'manager' | 'employee' | 'client'
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "You're invited to join {$this->owner->name}'s workspace on " . config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.team-invitation',
        );
    }
}
