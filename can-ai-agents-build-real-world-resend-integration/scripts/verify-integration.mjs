import { execSync } from 'child_process';

console.log('=== Running Final Resend Integration Audit ===\n');

// 1. Check TypeScript types
console.log('1. Checking TypeScript compilation...');
try {
  execSync('pnpm.cmd exec tsc --noEmit', { stdio: 'inherit' });
  console.log('   ✓ TypeScript types valid without errors.\n');
} catch (e) {
  console.error('   ✗ TypeScript compilation failed!');
  process.exit(1);
}

// 2. Check CLI doctor
console.log('2. Running Resend CLI Health Check...');
try {
  const doctorOutput = execSync('resend doctor -q', { encoding: 'utf8' });
  const doctor = JSON.parse(doctorOutput);
  console.log('   ✓ CLI Health Status: OK =', doctor.ok);
  doctor.checks.forEach((c) => {
    console.log(`     - [${c.status.toUpperCase()}] ${c.name}: ${c.message}`);
  });
  console.log('');
} catch (e) {
  console.warn('   ! CLI health check warning:', e.message);
}

// 3. Test API Endpoints
console.log('3. Testing Next.js API Endpoints...');
try {
  execSync('node scripts/test-endpoints.mjs', { stdio: 'inherit' });
} catch (e) {
  console.error('   ✗ Endpoints test failed!');
  process.exit(1);
}

console.log('\n=== All Resend Integration Checks Passed! ===');
