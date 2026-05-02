import nodemailer from 'nodemailer';
import { authClient } from './auth-client';

const createTransporter = () => {
    const isProd = process.env.NODE_ENV === 'production';

    if (!isProd) {

        return nodemailer.createTransport({
            host: 'smtp.resend.com',
            secure: true,
            port: 465,
            auth: {
                user: 'resend',
                pass: process.env.RESEND_API_KEY,
            },
        });
        // fuck it just run the resend on dev

        /*
        return nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,  // no SSL

            
            docker run -d \
            --restart unless-stopped \
            --name=mailpit \
            -p 8025:8025 \
            -p 1025:1025 \
            axllent/mailpit
            
        });
        */

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
