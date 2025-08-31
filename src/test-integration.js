// Test file to validate Supabase integration and data flow
// Run this with: npm test or node src/test-integration.js

import { MathuraDataService } from './services/MathuraDataService.js';

async function testIntegration() {
  console.log('🚀 Starting Mathura Bus System Integration Tests...\n');

  try {
    // Test 1: Search Routes
    console.log('1️⃣ Testing Route Search...');
    const routes = await MathuraDataService.searchRoutes('Krishna');
    console.log(`✅ Found ${routes.length} routes matching "Krishna"`);
    if (routes.length > 0) {
      console.log(`   📍 First route: ${routes[0].name} (${routes[0].code})`);
    }
    console.log('');

    // Test 2: Get Active Routes
    console.log('2️⃣ Testing Active Routes...');
    const activeRoutes = await MathuraDataService.getActiveRoutes();
    console.log(`✅ Found ${activeRoutes.length} active routes with buses`);
    if (activeRoutes.length > 0) {
      const routeWithBuses = activeRoutes.find(r => r.buses && r.buses.length > 0);
      if (routeWithBuses) {
        console.log(`   🚌 Route "${routeWithBuses.name}" has ${routeWithBuses.buses.length} buses`);
      }
    }
    console.log('');

    // Test 3: Get Nearby Buses (using Mathura center coordinates)
    console.log('3️⃣ Testing Nearby Buses...');
    const mathuraLat = 27.4924;
    const mathuraLng = 77.6737;
    const nearbyBuses = await MathuraDataService.getBusesNearLocation(mathuraLat, mathuraLng, 10);
    console.log(`✅ Found ${nearbyBuses.length} buses within 10km of Mathura center`);
    if (nearbyBuses.length > 0) {
      console.log(`   🚍 First bus: ${nearbyBuses[0].bus_number} (${nearbyBuses[0].distance_km.toFixed(2)}km away)`);
    }
    console.log('');

    // Test 4: Get Nearby Stops
    console.log('4️⃣ Testing Nearby Stops...');
    const nearbyStops = await MathuraDataService.getStopsNearLocation(mathuraLat, mathuraLng, 5);
    console.log(`✅ Found ${nearbyStops.length} stops within 5km of Mathura center`);
    if (nearbyStops.length > 0) {
      console.log(`   🚏 Closest stop: ${nearbyStops[0].stop_name} (${nearbyStops[0].distance_km.toFixed(2)}km away)`);
    }
    console.log('');

    // Test 5: Get Live Trips
    console.log('5️⃣ Testing Live Trips...');
    const liveTrips = await MathuraDataService.getLiveTrips();
    console.log(`✅ Found ${liveTrips.length} active/scheduled trips`);
    if (liveTrips.length > 0) {
      console.log(`   🚌 First trip: ${liveTrips[0].bus.bus_number} on ${liveTrips[0].route.name}`);
    }
    console.log('');

    // Test 6: Get Mathura Settings
    console.log('6️⃣ Testing Mathura Settings...');
    const settings = await MathuraDataService.getMathuraSettings();
    console.log(`✅ Retrieved settings:`, Object.keys(settings));
    if (settings.mathura_temple_timings) {
      console.log(`   🕐 Temple opens at: ${settings.mathura_temple_timings.opening}`);
    }
    console.log('');

    // Test 7: Temple Circuit Status
    console.log('7️⃣ Testing Temple Circuit Status...');
    const templeStatus = await MathuraDataService.getTempleCircuitStatus();
    console.log(`✅ Temple circuit has ${templeStatus.activeBuses} active buses`);
    console.log('');

    console.log('🎉 All integration tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Routes found: ${routes.length}`);
    console.log(`   • Active routes: ${activeRoutes.length}`);
    console.log(`   • Nearby buses: ${nearbyBuses.length}`);
    console.log(`   • Nearby stops: ${nearbyStops.length}`);
    console.log(`   • Live trips: ${liveTrips.length}`);
    console.log(`   • Settings loaded: ${Object.keys(settings).length}`);

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Test driver application submission
async function testDriverApplication() {
  console.log('\n👨‍💼 Testing Driver Application Submission...');
  
  const testApplication = {
    full_name: 'Test Driver Kumar',
    phone: '+91-9876543210',
    email: 'test.driver@example.com',
    notes: 'Test application - License: UP1234567890, Experience: 5 years, Vehicle Type: bus'
  };

  try {
    const result = await MathuraDataService.submitDriverApplication(testApplication);
    if (result.success) {
      console.log('✅ Driver application submitted successfully');
      console.log(`   📝 Application ID: ${result.data.id}`);
    } else {
      console.log('❌ Driver application failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Driver application test failed:', error);
  }
}

// Test user stats (mock)
async function testUserStats() {
  console.log('\n👤 Testing User Statistics...');
  
  try {
    const stats = await MathuraDataService.getUserStats('test-user-id');
    console.log('✅ User stats retrieved:', stats);
  } catch (error) {
    console.error('❌ User stats test failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  await testIntegration();
  await testDriverApplication();
  await testUserStats();
  
  console.log('\n🏁 All tests completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Load the sample data: run sql/mathura_sample_data.sql');
  console.log('   2. Run the functions: run sql/mathura_functions.sql');
  console.log('   3. Start the development server: npm run dev');
  console.log('   4. Test the UI components with real data');
}

// Export for module usage or run directly
if (typeof window === 'undefined') {
  // Node.js environment
  runAllTests().catch(console.error);
} else {
  // Browser environment
  window.testMathuraIntegration = runAllTests;
}

export { runAllTests, testIntegration, testDriverApplication, testUserStats };
