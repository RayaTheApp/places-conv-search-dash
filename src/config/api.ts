/**
 * API Configuration
 * Update these values to match your local NestJS server setup
 */

export const API_CONFIG = {
  // Base URL for your NestJS API
  BASE_URL: 'http://localhost:3002',
  
  // Default user ID for testing (update as needed)
  DEFAULT_USER_ID: '1000001805422',
  
  // Default CIC hash object (will be stringified in requests)
  DEFAULT_CIC_HASH: {
    "1804860": 0,
    "9296571": 0,
    "11298302": 0,
    "27867814": 0,
    "330516745": 2,
    "1017908760": 0,
    "1412961043": 0,
    "2927642976": 0,
    "1000000017777": 0,
    "1000000122459": 0,
    "1000000283372": 0,
    "1000000429887": 0,
    "1000001166105": 0,
    "1000001267242": 0,
    "1000001292440": 0,
    "1000001296046": 0,
    "1000001422272": 0,
    "1000001558383": 0,
    "1000002929181": 0,
    "10264309808": 0,
    "4000000007480": 0,
    "4000000008460": 0,
    "4000000008542": 0,
    "4000000008567": 0,
    "4000000008569": 0,
    "4000000008573": 0,
    "4000000008655": 0,
    "4000000009039": 0,
    "4000000010497": 0,
    "4000000010521": 0,
    "4000000010543": 0,
    "4000000010545": 0,
    "4000000010923": 0,
    "4000000011501": 0,
    "4000000013733": 0,
  },
  
  // Default username hash
  DEFAULT_USERNAME_HASH: {},
  
  // gRPC port
  GRPC_PORT: 50051,
  
  // Default user location (New York)
  USER_LOCATION: {
    latitude: 40.7128,
    longitude: -74.006,
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
};

/**
 * Update the API base URL
 */
export function setApiBaseUrl(url: string) {
  API_CONFIG.BASE_URL = url;
}

/**
 * Update the default user ID
 */
export function setDefaultUserId(userId: string) {
  API_CONFIG.DEFAULT_USER_ID = userId;
}

/**
 * Update the default CIC hash
 */
export function setDefaultCicHash(cicHash: Record<string, number>) {
  API_CONFIG.DEFAULT_CIC_HASH = cicHash;
}
