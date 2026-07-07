import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['approved', 'denied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const docRef = adminDb.collection('appointments').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const data = docSnap.data();
    
    // 1. Update status in Firestore
    await docRef.update({ status });

    // 2. Send follow-up Email to the Patient
    const subject = status === 'approved' 
      ? 'Appointment Confirmed - DENCITY' 
      : 'Appointment Update - DENCITY';
      
    const content = status === 'approved'
      ? `<p>We are pleased to confirm your appointment for <strong>${data?.service}</strong> on <strong>${data?.date}</strong>.</p><p>We look forward to seeing you. Please arrive 10 minutes early.</p>`
      : `<p>Unfortunately, we are unable to accommodate your appointment request for <strong>${data?.service}</strong> on <strong>${data?.date}</strong> at this time.</p><p>Please reply to this email or call our clinic to find another suitable time.</p>`;

    await resend.emails.send({
      from: 'DENCITY Clinic <noreply@yourdomain.com>', // Replace with your verified domain
      to: data?.email,
      subject,
      html: `
        <div style="font-family: sans-serif; color: #0f1717;">
          <h2 style="color: #0a5c5c;">${status === 'approved' ? 'Appointment Confirmed!' : 'Appointment Update'}</h2>
          <p>Hi ${data?.name},</p>
          ${content}
          <br/>
          <p>Best regards,<br/>The DENCITY Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
