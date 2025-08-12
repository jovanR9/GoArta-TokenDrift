'use client';
import React from 'react';
import { RedocStandalone } from 'redoc';

export default function DocsPage() {
  return (
    <div style={{ height: '100vh' }}>
      <RedocStandalone
        specUrl="/openapi.json"
        options={{ nativeScrollbars: true }}
      />
    </div>
  );
}
