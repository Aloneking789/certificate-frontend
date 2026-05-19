"use client"
import React from 'react';

export function QRCode({ value, size = 128 }: { value: string, size?: number }) {
  // Generate a QR image via a public QR API. This avoids adding a runtime dependency.
  // If you prefer an offline/local generator, we can add a QR library instead.
  const src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(value)}&size=${size}x${size}&format=png`;

  return (
    <div className="bg-white p-1 border rounded-lg shadow-sm" style={{ width: size, height: size }}>
      <img src={src} alt={`QR code for ${value}`} width={size} height={size} className="object-cover w-full h-full" />
    </div>
  );
}
