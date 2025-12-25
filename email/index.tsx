import * as React from 'react';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <div>
      <h2>Hello {username},</h2>
      <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '20px 0' }}>{otp}</h1>
      <p>If you did not request this code, please ignore this email.</p>
    </div>
  );
}
