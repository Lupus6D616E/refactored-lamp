import nodemailer from 'nodemailer';
import { authClient } from './auth-client';

const createTransporter = () => {
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
        return nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,  // no SSL

            /*
            docker run -d \
            --restart unless-stopped \
            --name=mailpit \
            -p 8025:8025 \
            -p 1025:1025 \
            axllent/mailpit
            */
        });

    } else {
        return nodemailer.createTransport({
            host: 'smtp.resend.com',
            secure: true,
            port: 465,
            auth: {
                user: 'resend',
                pass: process.env.RESEND_API_KEY,
            },
        });
    }
}

export const mailer = createTransporter()
if (import.meta.main) {
console.log("you are now testing")
  await mailer.sendMail({   
    from: '"Your App" <noreply@yourdomain.com>',
    to: "test@test.com",
    subject: 'Verify your email address',
    html: `
      <p>Click the link to verify:</p>
      <a href="test">test</a>
    `,
  });
  await authClient.sendVerificationEmail({
    email: "user@email.com",
    callbackURL: "/" // The redirect URL after verification
})
console.log("did it work")

}
