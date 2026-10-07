export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  source: 'GPS' | 'MANUAL';
  error?: string;
}

export const locationService = {
  getCurrentPosition: (): Promise<GeolocationResult> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        resolve({
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          timestamp: new Date().toLocaleTimeString(),
          source: 'GPS',
          error: 'Geolocation is not supported by your browser.',
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: Number(position.coords.latitude.toFixed(5)),
            longitude: Number(position.coords.longitude.toFixed(5)),
            accuracy: Math.round(position.coords.accuracy),
            timestamp: new Date().toLocaleTimeString(),
            source: 'GPS',
          });
        },
        (error) => {
          let errorMsg = 'Location permission denied.';
          if (error.code === error.TIMEOUT) {
            errorMsg = 'Location acquisition timed out.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is unavailable.';
          }
          resolve({
            latitude: 0,
            longitude: 0,
            accuracy: 0,
            timestamp: new Date().toLocaleTimeString(),
            source: 'GPS',
            error: errorMsg,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  },
};
