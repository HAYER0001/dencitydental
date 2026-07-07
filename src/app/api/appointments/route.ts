import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@dencitydentalcare.in',
    pass: process.env.SMTP_PASS, 
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, date, service } = body;

    if (!name || !email || !date || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Firestore with pending status
    const docRef = await adminDb.collection('appointments').add({
      name,
      email,
      phone: phone || '',
      date,
      service,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // Email 1: To the patient confirming receipt
    await transporter.sendMail({
      from: '"DENCITY Dental Care" <info@dencitydentalcare.in>',
      to: email,
      subject: 'Appointment Request Under Review - DENCITY',
      html: `
        <div style="font-family: sans-serif; color: #0f1717;">
          <h2 style="color: #0a5c5c;">Appointment Request Received</h2>
          <p>Hi ${name},</p>
          <p>Thank you for choosing DENCITY Dental Care. We have received your appointment request for <strong>${service}</strong> on <strong>${date}</strong>.</p>
          <p>Your request is currently under review by our team. We will confirm your appointment shortly.</p>
          <br/>
          <p>Best regards,<br/>The DENCITY Team</p>
        </div>
      `,
    });

    // Email 2: To the clinic alerting them of the new booking
    await transporter.sendMail({
      from: '"DENCITY System" <info@dencitydentalcare.in>',
      to: 'Dencity11@gmail.com',
      subject: 'New Appointment Request Needs Approval',
      html: `
        <div style="font-family: sans-serif; color: #0f1717;">
          <h2 style="color: #0a5c5c;">New Pending Booking</h2>
          <p><strong>Patient:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Requested Date:</strong> ${date}</p>
          <p>Please review and approve or deny this request via the admin panel.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
