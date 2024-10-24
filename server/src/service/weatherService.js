import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
// TODO: Define a class for the Weather object
class Weather {
    constructor(date, temp, windSpeed, humidity, icon) {
        this.date = date;
        this.temp = temp;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
        this.icon = icon;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
        this.apiKey = process.env.API_KEY || '';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(city) {
        try {
            const query = this.buildGeocodeQuery(city);
            const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
                params: {
                    q: query,
                    limit: 1,
                    appid: this.apiKey,
                },
            });
            if (response.data.length === 0) {
                throw new Error('City not found');
            }
            const { latitiude, longitude } = response.data[0];
            return { latitiude, longitude };
        }
        catch (error) {
            console.error('Error fetching location data:', error);
            throw error;
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        return {
            latitiude: locationData.latitiude,
            longitude: locationData.longitude
        };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery(city) {
        return `q=${city}&limit=1&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `lat=${coordinates.latitiude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=imperial`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData(city) {
        const locationData = await this.fetchLocationData(city);
        return this.destructureLocationData(locationData);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        try {
            const query = this.buildWeatherQuery(coordinates);
            const response = await axios.get(`${this.baseURL}/weather?${query}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        return new Weather(new Date(response.dt * 1000).toLocaleDateString(), response.main.temp, response.wind.speed, response.main.humidity, response.weather[0].icon);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(weatherData) {
        return weatherData.slice(0, 5).map((day) => {
            return new Weather(new Date(day.dt * 1000).toLocaleDateString(), day.temp.day, day.wind_speed, day.humidity, day.weather[0].icon);
        });
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
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
        }
        catch (error) {
            console.error('Error getting weather data for city:', error);
            throw error;
        }
    }
}
export default new WeatherService();
