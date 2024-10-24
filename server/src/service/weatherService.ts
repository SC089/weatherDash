import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitiude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor (
    public date: string,
    public temp: number,
    public windSpeed: number,
    public humidity: number,
    public icon: string

  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;

  constructor () {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || ''; 
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(city: string): Promise<Coordinates> {
    try {
      const query = this.buildGeocodeQuery(city);
      const response = await axios.get(`https://api.openweathermap.og/geo/1.0/direct`, {
        params: {
          q: query,
          limit: 1,
          appid: this.apiKey,
        },
      });

      if (response.data.length === 0) {
        throw new Error ('City not found');
      }

      const { latitiude, longitude } = response.data[0];
      return { latitiude, longitude };
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      latitiude: locationData.latitiude,
      longitude: locationData.longitude
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `q=${city}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `lat=${coordinates.latitiude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const query = this.buildWeatherQuery(coordinates);
      const response = await axios.get(`${this.baseURL}/weather?${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(
      new Date(response.dt * 1000).toLocaleDateString(),
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    return weatherData.slice(0, 5).map((day: any) => {
      return new Weather(
        new Date(day.dt * 1000).toLocaleDateString(),
        day.temp.day,
        day.wind_speed,
        day.humidity,
        day.weather[0].icon
      );
    });
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const currentWeatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(currentWeatherData);
      const forecastResponse = await axios.get(`${this.baseURL}/onecall`, {
        params: {
          latitude: coordinates.latitiude,
          longitude: coordinates.longitude,
          exclude: 'minutely, hourly',
          appid: this.apiKey,
          units: 'imperial',
        },
      });

      const forecast = this.buildForecastArray(forecastResponse.data.daily);

      return { currentWeather, forecast };
    } catch (error) {
      console.error('Error getting weather data for city:', error);
      throw error;
    }
  }
}

export default new WeatherService();
