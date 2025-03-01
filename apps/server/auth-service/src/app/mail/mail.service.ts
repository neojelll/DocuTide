import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import {
  CreateMailTransporterError,
  SendMailError,
} from '../../errors/mail.errors';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private mailAddress: string;

  constructor() {
    try {
      console.log('Start create mail transporter');
      this.mailAddress = process.env['MAIL_ADDRESS'];
      this.transporter = createTransport({
        host: process.env['MAIL_HOST'],
        port: Number(process.env['MAIL_PORT']),
        secure: process.env['MAIL_SECURE'] === 'true',
        auth: {
          user: this.mailAddress,
          pass: process.env['MAIL_PASSWORD'],
        },
      });
      console.log('Successfully created mail transporter');
    } catch (error) {
      console.log(`Error when create mail transporter: ${error.message}`);
      throw new CreateMailTransporterError(
        `Error when create mail transporter: ${error.message}`,
      );
    }
  }

  async sendMail(to: string, confirmEmailToken: string) {
    console.log('Start send mail');
    const subject = 'Email Confirmation Required for Your DocuTide Account';
    const html = `
      <div style="text-align: center; font-family: Roboto, Arial, sans-serif; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <img src="cid:logo" alt="Logo" style="width: 100%; height: auto; max-width: 600px; margin-bottom: 20px;" />
        <h2 style="color: #000000;">Email Address Confirmation Required</h2>
        <p style="color: #000000; font-size: 16px;">
          Dear Valued User<br>
          Thank you for choosing DocuTide. We are excited to have you! To ensure the security of your account and to complete your registration process, we kindly ask you to confirm your email address. This step is crucial for protecting your personal information and ensuring that you receive important updates and notifications from us.
        </p>
        <a href="${
          process.env['MAIL_CONFIRM_URL'] + confirmEmailToken
        }" style="display: inline-block; background-color: #0A3F6A; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; margin-top: 20px; margin-bottom: 20px;">
          Confirm Your Email Address
        </a>
        <p style="color: #000000; font-size: 16px;">
          Please click the button above to confirm your email address and activate your account. Once confirmed, you will gain access to all the features and benefits that DocuTide has to offer, including personalized content, exclusive offers, and timely updates.
        </p>
        <p style="color: #000000; font-size: 14px; margin-top: 20px;">
          If you did not initiate this registration, please disregard this email. Your security is our top priority, and we encourage you to reach out to our support team if you have any questions or concerns regarding your account or this email.
        </p>
        <p style="color: #000000; font-size: 14px;">
          Thank you for your attention to this matter. We look forward to serving you and hope you enjoy your experience with DocuTide.<br>
          Best regards,
          The DocuTide Team
        </p>
      </div>
    `;

    try {
      const mailOptions = {
        from: this.mailAddress,
        to,
        subject,
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
      console.log('Successfully send mail');
    } catch (error) {
      console.error(`Error when send mail: ${error.message}`);
      throw new SendMailError(`Error when send mail: ${error.message}`);
    }
  }
}
