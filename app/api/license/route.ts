// app/api/license/route.ts

import { NextResponse } from 'next/server';

const licenseInfo = `
This project was developed by Future Synch.

Website: 
Telegram: 
Telegram channel for news/updates: 
GitHub: 
`;

export async function GET(req: Request) {
  return NextResponse.json({ 
    license: licenseInfo.trim(),
    version: '1.0.0',
    lastUpdated: '2024-10-16'
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}