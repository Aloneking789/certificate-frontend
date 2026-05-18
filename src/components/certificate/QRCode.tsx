"use client"
import React from 'react';

export function QRCode({ value, size = 128 }: { value: string, size?: number }) {
  // Mocking a QR code with a stylized SVG pattern for UI purposes
  // In a real app, use qrcode.react
  return (
    <div className="bg-white p-2 border rounded-lg shadow-sm" style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path d="M3 3H9V9H3V3ZM3 15H9V21H3V15ZM15 3H21V9H15V3ZM15 15H21V21H15V15ZM5 5V7H7V5H5ZM5 17V19H7V17H5ZM17 5V7H19V5H17ZM17 17V19H19V17H17ZM11 3H13V5H11V3ZM11 7H13V9H11V7ZM11 11H13V13H11V11ZM11 15H13V17H11V15ZM11 19H13V21H11V19ZM15 11H17V13H15V11ZM19 11H21V13H19V11ZM3 11H5V13H3V11ZM7 11H9V13H7V11ZM15 11V13H17V11H15ZM19 11V13H21V11H19Z" fill="currentColor" />
      </svg>
    </div>
  );
}
