import React from 'react';
import { FloatingWhatsApp } from '../src/components/FloatingWhatsApp';

function TestApp() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <h1>TailwindCSS FloatingWhatsApp Test</h1>
      <FloatingWhatsApp 
        phoneNumber="1234567890"
        accountName="Test Account"
        chatMessage="Hello! This is a test message with TailwindCSS styling."
        statusMessage="Online now"
      />
    </div>
  );
}

export default TestApp;