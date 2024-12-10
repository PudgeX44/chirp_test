export interface WeatherAPIResponse {
  coord: {
    lon: number;
    lat: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
}

export interface WardrobeItem {
  type: string;
  temperatureRange: string;
  formality: string;
}

export interface ActionDataResponse {
  weather: WeatherAPIResponse;
  recommendedOutfits: WardrobeItem[];
}
