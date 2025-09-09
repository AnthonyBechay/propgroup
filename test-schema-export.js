// Test file to verify schema exports
const config = require('./packages/config/dist/index.js');

console.log('Testing @propgroup/config exports...\n');

// Check if schemas are exported
const schemas = [
  'authSchema',
  'signupSchema',
  'contactFormSchema',
  'investmentMatchmakerSchema',
  'investmentCalculatorSchema',
  'propertySearchSchema',
  'userProfileSchema',
  'propertySchema'
];

let allExported = true;

schemas.forEach(schema => {
  if (config[schema]) {
    console.log(`✅ ${schema} is exported`);
    
    // Check if it's a Zod schema (has _def property)
    if (config[schema]._def) {
      console.log(`   └─ Valid Zod schema with _def property`);
    } else {
      console.log(`   └─ ⚠️  WARNING: Not a valid Zod schema (missing _def)`);
      allExported = false;
    }
  } else {
    console.log(`❌ ${schema} is NOT exported`);
    allExported = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allExported) {
  console.log('✅ All schemas are properly exported!');
} else {
  console.log('❌ Some schemas are missing or invalid.');
  console.log('Please run: fix-schema-export.bat');
}

console.log('='.repeat(50));

// Test investmentMatchmakerSchema specifically
if (config.investmentMatchmakerSchema && config.investmentMatchmakerSchema._def) {
  console.log('\nTesting investmentMatchmakerSchema parsing...');
  try {
    const testData = {
      goal: 'HIGH_ROI',
      budget: 100000,
      country: 'any'
    };
    
    const result = config.investmentMatchmakerSchema.parse(testData);
    console.log('✅ Schema parsing works!');
    console.log('   Parsed data:', result);
  } catch (error) {
    console.log('❌ Schema parsing failed:', error.message);
  }
}
