// Real-time data integration for Mathura bus system
import { supabase } from '../lib/supabaseClient';

export class MathuraDataService {
  // Get all active routes with current bus positions
  static async getActiveRoutes() {
    try {
      const { data: routes, error } = await supabase
        .from('routes')
        .select(`
          *,
          waypoints(*)
        `)
        .eq('is_active', true);

      if (error) {
        console.warn('Supabase error:', error);
        return this.getMockRoutes();
      }

      return routes || this.getMockRoutes();
    } catch (error) {
      console.error('Error fetching active routes:', error);
      return this.getMockRoutes();
    }
  }

  // Get buses around a specific location (for BusesAroundMe page)
  static async getBusesNearLocation(latitude, longitude, radiusKm = 5) {
    try {
      // For now, use mock data directly since Supabase tables are causing 400 errors
      // TODO: Re-enable when database is properly set up
      console.log('Using mock data for buses (database tables not accessible)');
      return this.getMockBuses(latitude, longitude);
      
      /*
      // Get active buses from database
      const { data: buses, error } = await supabase
        .from('buses')
        .select(`
          *,
          routes(name, description),
          drivers(full_name)
        `)
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.warn('Supabase error:', error);
        return this.getMockBuses(latitude, longitude);
      }

      if (!buses || buses.length === 0) {
        console.log('No active buses found in database, using mock data');
        return this.getMockBuses(latitude, longitude);
      }

      // Filter buses within radius and transform data
      const nearbyBuses = buses
        .map(bus => {
          const distance = this.calculateDistance(
            latitude, longitude,
            bus.latitude, bus.longitude
          );
          
          return {
            id: bus.id,
            bus_number: bus.vehicle_number,
            route_name: bus.routes?.name || 'Unknown Route',
            route_id: bus.route_id,
            current_location: {
              lat: bus.latitude,
              lng: bus.longitude,
            },
            status: bus.status,
            driver_name: bus.drivers?.full_name || bus.driver_name || 'Unknown Driver',
            next_stop: 'Calculating...',
            eta_minutes: Math.floor(Math.random() * 15) + 5,
            distance_km: distance,
            occupancy: Math.floor(Math.random() * 100),
            vehicle_type: bus.vehicle_type || 'Standard Bus',
            last_updated: bus.last_updated,
          };
        })
        .filter(bus => bus.distance_km <= radiusKm)
        .sort((a, b) => a.distance_km - b.distance_km);

      return nearbyBuses;
      */
    } catch (error) {
      console.error('Error fetching nearby buses:', error);
      return this.getMockBuses(latitude, longitude);
    }
  }

  // Get bus stops around a location (for BusStopsNearMe page)
  static async getStopsNearLocation(latitude, longitude, radiusKm = 2) {
    try {
      // For now, use mock data directly since Supabase tables are causing 400 errors
      // TODO: Re-enable when database is properly set up
      console.log('Using mock data for bus stops (database tables not accessible)');
      return this.getMockStops(latitude, longitude);
      
      /*
      // Get waypoints from database
      const { data: waypoints, error } = await supabase
        .from('waypoints')
        .select(`
          *,
          routes!inner(name, description, is_active)
        `)
        .eq('routes.is_active', true);

      if (error) {
        console.warn('Supabase error:', error);
        return this.getMockStops(latitude, longitude);
      }

      if (!waypoints || waypoints.length === 0) {
        console.log('No waypoints found in database, using mock data');
        return this.getMockStops(latitude, longitude);
      }

      const nearbyStops = waypoints
        .map(stop => {
          const distance = this.calculateDistance(
            latitude, longitude,
            stop.latitude, stop.longitude
          );
          
          return {
            id: stop.id,
            name: stop.name,
            lat: stop.latitude,
            lng: stop.longitude,
            route_name: stop.routes?.name || 'Unknown Route',
            route_description: stop.routes?.description || '',
            distance_km: distance,
            sequence_order: stop.sequence_order,
            buses: [], // Will be populated with live bus data
            amenities: ['Shelter', 'Bench'],
            rating: 4.2 + Math.random() * 0.8,
          };
        })
        .filter(stop => stop.distance_km <= radiusKm)
        .sort((a, b) => a.distance_km - b.distance_km);

      return nearbyStops;
      */
    } catch (error) {
      console.error('Error fetching nearby stops:', error);
      return this.getMockStops(latitude, longitude);
    }
  }

  // Get live trip information
  static async getLiveTrips() {
    try {
      const { data: trips, error } = await supabase
        .from('trips')
        .select(`
          *,
          driver:drivers!inner(full_name, phone, rating),
          bus:buses!inner(bus_number, vehicle_type),
          route:routes!inner(name, code, waypoints)
        `)
        .in('status', ['in_progress', 'scheduled'])
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      return trips;
    } catch (error) {
      console.error('Error fetching live trips:', error);
      return [];
    }
  }

  // Search functionality
  static async searchRoutes(query) {
    try {
      const { data: routes, error } = await supabase
        .from('routes')
        .select('*')
        .or(`name.ilike.%${query}%, code.ilike.%${query}%, start_location.ilike.%${query}%, end_location.ilike.%${query}%`)
        .eq('active', true)
        .limit(10);

      if (error) throw error;
      return routes;
    } catch (error) {
      console.error('Error searching routes:', error);
      return [];
    }
  }

  // Get driver dashboard data
  static async getDriverDashboard(driverId) {
    try {
      const [driverInfo, todayTrips, assignedBus] = await Promise.all([
        supabase.from('drivers').select('*').eq('id', driverId).single(),
        supabase.from('trips')
          .select(`
            *,
            route:routes(name, code),
            bus:buses(bus_number, vehicle_type)
          `)
          .eq('driver_id', driverId)
          .gte('start_time', new Date().toDateString())
          .order('start_time', { ascending: true }),
        supabase.from('buses').select('*').eq('assigned_driver_id', driverId).single()
      ]);

      return {
        driver: driverInfo.data,
        todayTrips: todayTrips.data || [],
        assignedBus: assignedBus.data,
        error: driverInfo.error || todayTrips.error || assignedBus.error
      };
    } catch (error) {
      console.error('Error fetching driver dashboard:', error);
      return { driver: null, todayTrips: [], assignedBus: null, error };
    }
  }

  // Submit driver application
  static async submitDriverApplication(applicationData) {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert([{
          ...applicationData,
          status: 'pending',
          created_at: new Date().toISOString(),
          total_distance_km: 0,
          total_trips: 0,
          rating: 0
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting driver application:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user statistics (for profile)
  static async getUserStats(userId) {
    try {
      // This would need a user_trips table or similar tracking
      const mockStats = {
        totalTrips: 45,
        totalDistance: 287.5,
        favoriteRoute: 'Krishna Temple Circuit',
        carbonSaved: 12.3,
        moneySaved: 450.50
      };
      return mockStats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  // Real-time bus location updates
  static subscribeToBusUpdates(callback) {
    return supabase
      .channel('bus-updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'buses',
          filter: 'active=eq.true'
        }, 
        callback
      )
      .subscribe();
  }

  // Helper function to calculate distance between two points
  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static toRad(value) {
    return value * Math.PI / 180;
  }

  // Get admin settings for Mathura operations
  static async getMathuraSettings() {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .in('setting_key', [
          'mathura_temple_timings',
          'mathura_festival_calendar', 
          'mathura_peak_hours',
          'emergency_contacts_mathura'
        ]);

      if (error) throw error;
      
      const settings = {};
      data.forEach(setting => {
        settings[setting.setting_key] = JSON.parse(setting.setting_value);
      });
      
      return settings;
    } catch (error) {
      console.error('Error fetching Mathura settings:', error);
      return {};
    }
  }

  // Temple circuit specific helpers
  static async getTempleCircuitStatus() {
    try {
      const { data: trips, error } = await supabase
        .from('trips')
        .select(`
          *,
          bus:buses!inner(bus_number, current_location),
          route:routes!inner(name, code, waypoints)
        `)
        .eq('routes.code', 'KTC001')
        .eq('status', 'in_progress');

      if (error) throw error;

      return {
        activeBuses: trips.length,
        trips: trips.map(trip => ({
          busNumber: trip.bus.bus_number,
          currentLocation: trip.bus.current_location,
          nextStop: this.getNextStop(trip.route.waypoints, trip.bus.current_location),
          passengerCount: trip.passenger_count || 0
        }))
      };
    } catch (error) {
      console.error('Error fetching temple circuit status:', error);
      return { activeBuses: 0, trips: [] };
    }
  }

  static getNextStop(waypoints, currentLocation) {
    // Logic to determine next stop based on current location
    // This would need more sophisticated calculation in real implementation
    if (waypoints && waypoints.length > 0) {
      return waypoints[0].name; // Simplified
    }
    return 'Unknown';
  }

  // Mock data methods for fallback
  static getMockRoutes() {
    return [
      {
        id: '1',
        name: 'Krishna Janmabhoomi Circuit',
        description: 'Sacred temples tour route',
        is_active: true,
        waypoints: [
          { id: '1', name: 'Krishna Janmabhoomi', latitude: 27.5124, longitude: 77.6737 },
          { id: '2', name: 'Dwarkadhish Temple', latitude: 27.5056, longitude: 77.6823 },
        ]
      },
      {
        id: '2', 
        name: 'Vrindavan Express',
        description: 'Direct route to Vrindavan',
        is_active: true,
        waypoints: [
          { id: '3', name: 'Mathura Junction', latitude: 27.4924, longitude: 77.6737 },
          { id: '4', name: 'ISKCON Vrindavan', latitude: 27.5906, longitude: 77.7064 },
        ]
      }
    ];
  }

  static getMockBuses(latitude, longitude) {
    return [
      {
        id: '1',
        bus_number: 'MH-20',
        route_name: 'Krishna Janmabhoomi Circuit',
        current_location: { lat: latitude + 0.001, lng: longitude + 0.001 },
        status: 'active',
        next_stop: 'Krishna Janmabhoomi',
        eta_minutes: 8,
        distance_km: 0.5,
        occupancy: 65,
        vehicle_type: 'Standard Bus',
        last_updated: new Date().toISOString(),
      },
      {
        id: '2',
        bus_number: 'MH-21',
        route_name: 'Vrindavan Express',
        current_location: { lat: latitude - 0.002, lng: longitude + 0.003 },
        status: 'active',
        next_stop: 'ISKCON Vrindavan',
        eta_minutes: 12,
        distance_km: 1.2,
        occupancy: 42,
        vehicle_type: 'AC Bus',
        last_updated: new Date().toISOString(),
      }
    ];
  }

  static getMockStops(latitude, longitude) {
    return [
      {
        id: '1',
        name: 'Krishna Janmabhoomi',
        lat: latitude + 0.001,
        lng: longitude + 0.001,
        route_name: 'Krishna Janmabhoomi Circuit',
        distance_km: 0.3,
        buses: ['MH-20', 'MH-22'],
        amenities: ['Shelter', 'Bench', 'Water'],
        rating: 4.5,
      },
      {
        id: '2',
        name: 'Dwarkadhish Temple',
        lat: latitude - 0.002,
        lng: longitude + 0.002,
        route_name: 'Krishna Janmabhoomi Circuit', 
        distance_km: 0.8,
        buses: ['MH-21'],
        amenities: ['Shelter', 'Bench'],
        rating: 4.3,
      },
      {
        id: '3',
        name: 'Mathura Junction',
        lat: latitude + 0.003,
        lng: longitude - 0.001,
        route_name: 'Vrindavan Express',
        distance_km: 1.1,
        buses: ['MH-23'],
        amenities: ['Shelter', 'Bench', 'Food'],
        rating: 4.0,
      }
    ];
  }
}

// Export individual functions for easier imports
export const {
  getActiveRoutes,
  getBusesNearLocation,
  getStopsNearLocation,
  getLiveTrips,
  searchRoutes,
  getDriverDashboard,
  submitDriverApplication,
  getUserStats,
  subscribeToBusUpdates,
  getMathuraSettings,
  getTempleCircuitStatus
} = MathuraDataService;
