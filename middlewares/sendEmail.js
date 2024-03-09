import sgMail from '@sendgrid/mail';
import 'dotenv/config';

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendEmail(data) {
  const email = { ...data, from: 'full.stack.volodymyr.bendel@gmail.com' };
  await sgMail.send(email);
  return true;
}
