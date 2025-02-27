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
      secure: Boolean(process.env['MAIL_SECURE']),
      auth: {
        user: this.mailAddress,
        pass: process.env['MAIL_PASSWORD'],
      },
    });
  }

  async sendMail(to: string) {
    const subject = 'Hello, confirm your email in DocuTide service!';
    const text = process.env['MAIL_CONFIRM_URL'];

    const mailOptions = {
      from: this.mailAddress,
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
