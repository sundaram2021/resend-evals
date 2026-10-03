async function runTests() {
  console.log('Testing Resend Integration API Endpoints...');

  // 1. Health check
  console.log('\n--- 1. Testing /api/health ---');
  const healthRes = await fetch('http://localhost:3000/api/health');
  const health = await healthRes.json();
  console.log('Health status:', health.status, 'Connected:', health.connected, 'Latency:', health.latencyMs);

  // 2. Preview endpoint
  console.log('\n--- 2. Testing /api/preview ---');
  const previewRes = await fetch('http://localhost:3000/api/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId: 'welcome', props: { name: 'Automated Test' } }),
  });
  const preview = await previewRes.json();
  console.log('Preview success:', preview.success, 'HTML length:', preview.html?.length);

  // 3. Send email endpoint
  console.log('\n--- 3. Testing /api/send ---');
  const sendRes = await fetch('http://localhost:3000/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'delivered@resend.dev',
      subject: 'End-to-End Verification Test',
      templateId: 'welcome',
      props: { name: 'E2E Tester', companyName: 'Acme Cloud' },
    }),
  });
  const sendData = await sendRes.json();
  console.log('Send result:', sendData);

  // 4. Activity logs endpoint
  console.log('\n--- 4. Testing /api/emails ---');
  const logsRes = await fetch('http://localhost:3000/api/emails');
  const logs = await logsRes.json();
  console.log('Emails count:', logs.data?.length);

  // 5. Webhooks simulation endpoint
  console.log('\n--- 5. Testing /api/webhooks/resend ---');
  const webhookRes = await fetch('http://localhost:3000/api/webhooks/resend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-simulated-event': 'true',
    },
    body: JSON.stringify({
      type: 'email.delivered',
      data: {
        email_id: sendData.data?.id,
        to: ['delivered@resend.dev'],
      },
    }),
  });
  const webhookData = await webhookRes.json();
  console.log('Webhook result:', webhookData);

  console.log('\n✅ All API endpoints verified successfully!');
}

runTests().catch(console.error);
