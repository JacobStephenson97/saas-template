"use server";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailAction = async (to: string, subject: string, html: string) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [to],
    subject: subject,
    html: html,
  });

  if (error) {
    return console.error({ error });
  }
  console.log(data);
  return data;
};