import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private mailAddress: string;

  constructor() {
    this.mailAddress = process.env['MAIL_ADDRESS'];
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: process.env['MAIL_SECURE'] === 'true',
      auth: {
        user: this.mailAddress,
        pass: process.env['MAIL_PASSWORD'],
      },
    });
  }

  async sendMail(to: string) {
    const subject = 'Hello, confirm your email in DocuTide service!';
    const text = `Please confirm your email by clicking the following link: ${process.env['MAIL_CONFIRM_URL']}`;
    const html = `
      <div style="text-align: center;">
        <img src="cid:logo" alt="Logo" style="width: 50%; height: auto;" />
        <p>Please confirm your email by clicking the following link:</p>
        <a href="${process.env['MAIL_CONFIRM_URL']}">Confirm Email</a>
      </div>
    `;

    const mailOptions = {
      from: this.mailAddress,
      to,
      subject,
      text,
      html,
      attachments: [
        {
          filename: 'mail-logo.png',
          path: 'assets/mail-logo.png',
          cid: 'logo',
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  }
}
