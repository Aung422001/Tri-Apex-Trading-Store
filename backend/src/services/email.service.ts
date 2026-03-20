import { env } from '../config/env'

interface EmailOptions {
    to: string
    subject: string
    html: string
}

/** Send an email using Gmail SMTP or console fallback */
export async function sendEmail(options: EmailOptions): Promise<void> {
    if (env.SMTP_HOST && env.SMTP_USER) {
        try {
            const nodemailer = await import('nodemailer')
            const transporter = nodemailer.createTransport({
                host: env.SMTP_HOST,
                port: env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: env.SMTP_USER,
                    pass: (env.SMTP_PASS || '').replace(/\s/g, ''), // Remove spaces from App Password
                },
            })
            await transporter.sendMail({
                from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`,
                ...options,
            })
            console.log(`📧 Email sent to: ${options.to}`)
            return
        } catch (err) {
            console.error('Email send error:', err)
        }
    }

    // Fallback: log to console
    console.log('📧 Email (dev mode — configure SMTP_HOST/SMTP_USER in .env):')
    console.log(`  To: ${options.to}`)
    console.log(`  Subject: ${options.subject}`)
    console.log(`  Body: ${options.html.substring(0, 200)}...`)
}

/** Send order confirmation email */
export async function sendOrderConfirmation(email: string, orderNumber: string, total: number) {
    await sendEmail({
        to: email,
        subject: `Order Confirmed — ${orderNumber}`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1E3A5F;color:white;padding:24px;text-align:center">
          <h1 style="margin:0">Triapex Trading Group</h1>
        </div>
        <div style="padding:24px">
          <h2 style="color:#1E3A5F">Order Confirmed ✅</h2>
          <p>Thank you for your order! Your order <strong>${orderNumber}</strong> has been confirmed.</p>
          <p style="font-size:20px;color:#F97316"><strong>Total: MYR ${total.toFixed(2)}</strong></p>
          <p>We'll email you again when your order ships.</p>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#666">
          © ${new Date().getFullYear()} Triapex Trading Group
        </div>
      </div>`,
    })
}

/** Send welcome email */
export async function sendWelcomeEmail(email: string, name: string) {
    await sendEmail({
        to: email,
        subject: 'Welcome to Triapex Trading Group! 🖨️',
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1E3A5F;color:white;padding:24px;text-align:center">
          <h1 style="margin:0">Welcome to Triapex!</h1>
        </div>
        <div style="padding:24px">
          <h2>Hi ${name} 👋</h2>
          <p>Welcome to Triapex Trading Group, your trusted source for professional 3D printers.</p>
          <a href="${env.APP_URL}/products" 
             style="display:inline-block;background:#F97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
            Start Shopping →
          </a>
        </div>
      </div>`,
    })
}

/** Send password reset email */
export async function sendPasswordResetEmail(email: string, resetUrl: string, name: string) {
    await sendEmail({
        to: email,
        subject: 'Reset Your Password — Triapex',
        html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1E3A5F;color:white;padding:24px;text-align:center">
          <h1 style="margin:0">Triapex Trading Group</h1>
        </div>
        <div style="padding:24px">
          <h2 style="color:#1E3A5F">Hi ${name},</h2>
          <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
          <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetUrl}" 
               style="display:inline-block;background:#F97316;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
              Reset Password
            </a>
          </div>
          <p style="font-size:14px;color:#666">Or copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color:#1E3A5F;word-break:break-all">${resetUrl}</a></p>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#666">
          © ${new Date().getFullYear()} Triapex Trading Group
        </div>
      </div>`,
    })
}
