import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'info@dencitydentalcare.in',
    pass: process.env.SMTP_PASS, 
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status = 'approved' } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 });
    }

    const docRef = adminDb.collection('appointments').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const data = docSnap.data();

    // Update status to 'approved' or 'denied'
    await docRef.update({ status });

    // Third Email: To the user confirming action
    const subject = status === 'approved' ? 'Appointment Confirmed - DENCITY' : 'Appointment Update - DENCITY';
    const htmlContent = status === 'approved' 
      ? `
        <div style="font-family: sans-serif; color: #0f1717;">
          <h2 style="color: #0a5c5c;">Appointment Confirmed!</h2>
          <p>Hi ${data?.name},</p>
          <p>We are pleased to confirm your appointment for <strong>${data?.service}</strong> on <strong>${data?.date}</strong>.</p>
          <p>We look forward to seeing you. Please arrive 10 minutes early.</p>
          <br/>
          <p>Best regards,<br/>The DENCITY Team</p>
        </div>
      `
      : `
        <div style="font-family: sans-serif; color: #0f1717;">
          <h2 style="color: #0a5c5c;">Appointment Update</h2>
          <p>Hi ${data?.name},</p>
          <p>We regret to inform you that we could not approve your appointment request for <strong>${data?.service}</strong> on <strong>${data?.date}</strong>.</p>
          <p>Please contact us or book an alternative slot.</p>
          <br/>
          <p>Best regards,<br/>The DENCITY Team</p>
        </div>
      `;

    await transporter.sendMail({
      from: '"DENCITY Dental Care" <info@dencitydentalcare.in>',
      to: data?.email,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error approving appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
