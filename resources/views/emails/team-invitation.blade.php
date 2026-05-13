<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Team Invitation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #F5F3FF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 16px; }
        .wrapper { max-width: 560px; margin: 0 auto; }

        /* Card */
        .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(124,58,237,0.10); }

        /* Header */
        .header { background: linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%); padding: 40px 40px 32px; text-align: center; }
        .logo-ring { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .logo-text { font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .header h1 { color: #fff; font-size: 22px; font-weight: 700; margin-top: 12px; line-height: 1.3; }
        .header p { color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 6px; }

        /* Body */
        .body { padding: 36px 40px; }
        .greeting { font-size: 16px; color: #1E1B4B; font-weight: 600; margin-bottom: 12px; }
        .text { font-size: 14px; color: #4B5563; line-height: 1.7; margin-bottom: 24px; }

        /* Role badge */
        .role-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: capitalize; letter-spacing: 0.03em; }
        .role-manager  { background: #EDE9FE; color: #7C3AED; }
        .role-employee { background: #EFF6FF; color: #2563EB; }
        .role-client   { background: #F0FDF4; color: #16A34A; }

        /* Credentials box */
        .creds { background: #F5F3FF; border: 1px solid #EDE9FE; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
        .creds-title { font-size: 12px; font-weight: 700; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px; }
        .cred-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
        .cred-row:last-child { margin-bottom: 0; }
        .cred-label { font-size: 12px; color: #6B7280; width: 90px; flex-shrink: 0; padding-top: 2px; }
        .cred-value { font-size: 14px; color: #1E1B4B; font-weight: 600; word-break: break-all; }
        .cred-value.password { font-family: 'Courier New', Courier, monospace; background: #fff; border: 1px solid #DDD6FE; border-radius: 6px; padding: 4px 10px; font-size: 15px; letter-spacing: 1px; }

        /* CTA Button */
        .btn-wrap { text-align: center; margin: 28px 0 8px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%); color: #fff !important; text-decoration: none; padding: 14px 40px; border-radius: 10px; font-size: 15px; font-weight: 700; letter-spacing: 0.02em; }

        /* Warning */
        .warning { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 14px 18px; margin-top: 24px; font-size: 13px; color: #92400E; line-height: 1.6; }
        .warning strong { color: #B45309; }

        /* Footer */
        .footer { background: #F9FAFB; border-top: 1px solid #EDE9FE; padding: 20px 40px; text-align: center; font-size: 12px; color: #9CA3AF; line-height: 1.6; }
        .footer a { color: #7C3AED; text-decoration: none; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="card">

        <!-- Header -->
        <div class="header">
            <div>
                <div class="logo-text">{{ config('app.name') }}</div>
            </div>
            <h1>You've been invited to join a workspace!</h1>
            <p>Your account is ready — log in to get started.</p>
        </div>

        <!-- Body -->
        <div class="body">
            <p class="greeting">Hi {{ $member->name }},</p>
            <p class="text">
                <strong>{{ $owner->name }}</strong> has added you to their workspace on <strong>{{ config('app.name') }}</strong>
                as a <span class="role-badge role-{{ $role }}">{{ $role }}</span>.
                Your account has been created and you can log in right away using the credentials below.
            </p>

            <!-- Credentials -->
            <div class="creds">
                <div class="creds-title">🔐 Your Login Credentials</div>
                <div class="cred-row">
                    <span class="cred-label">Login URL</span>
                    <span class="cred-value"><a href="{{ config('app.url') }}/login" style="color:#7C3AED;">{{ config('app.url') }}/login</a></span>
                </div>
                <div class="cred-row">
                    <span class="cred-label">Email</span>
                    <span class="cred-value">{{ $member->email }}</span>
                </div>
                <div class="cred-row">
                    <span class="cred-label">Password</span>
                    <span class="cred-value password">{{ $tempPassword }}</span>
                </div>
            </div>

            <!-- CTA -->
            <div class="btn-wrap">
                <a href="{{ config('app.url') }}/login" class="btn">Log In to Your Account →</a>
            </div>

            <!-- Warning -->
            <div class="warning">
                <strong>Important:</strong> Please change your password after your first login. Keep these credentials private — do not share this email with anyone.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>You received this email because <strong>{{ $owner->name }}</strong> added you to their {{ config('app.name') }} workspace.</p>
            <p style="margin-top:6px;">If this was a mistake, you can safely ignore this email.</p>
            <p style="margin-top:12px;">© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>

    </div>
</div>
</body>
</html>
