import axios from 'axios';
import { env, API_ENDPOINTS } from '../config/env';

const WEATHER_API_KEY = env.openWeatherApiKey;
const WEATHER_BASE_URL = API_ENDPOINTS.weather;

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  feelsLike: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex?: number;
}

export interface ForecastData {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  precipitation: number;
}

class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = WEATHER_API_KEY;
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        feelsLike: Math.round(data.main.feels_like),
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      return {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        feelsLike: Math.round(data.main.feels_like),
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
      };
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getForecast(city: string, days: number = 5): Promise<ForecastData[]> {
    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (every 3 hours)
        }
      });

      const forecasts: ForecastData[] = [];
      const dailyData: { [key: string]: any[] } = {};

      // Group forecasts by date
      response.data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      // Process each day
      Object.entries(dailyData).forEach(([date, dayForecasts]) => {
        const temps = dayForecasts.map(f => f.main.temp);
        const humidities = dayForecasts.map(f => f.main.humidity);
        const windSpeeds = dayForecasts.map(f => f.wind.speed);
        
        // Get the most common weather condition for the day
        const weatherCounts: { [key: string]: number } = {};
        dayForecasts.forEach(f => {
          const desc = f.weather[0].description;
          weatherCounts[desc] = (weatherCounts[desc] || 0) + 1;
        });
        const mostCommonWeather = Object.keys(weatherCounts).reduce((a, b) => 
          weatherCounts[a] > weatherCounts[b] ? a : b
        );

        const dayForecast = dayForecasts.find(f => f.weather[0].description === mostCommonWeather);

        forecasts.push({
          date: new Date(date).toISOString().split('T')[0],
          temperature: {
            min: Math.round(Math.min(...temps)),
            max: Math.round(Math.max(...temps))
          },
          humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
          description: mostCommonWeather,
          icon: dayForecast?.weather[0].icon || '01d',
          windSpeed: windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length,
          precipitation: Math.max(...dayForecasts.map(f => f.rain?.['3h'] || 0))
        });
      });

      return forecasts.slice(0, days);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  async getAgriculturalWeatherInsights(city: string): Promise<{
    farmingConditions: string;
    recommendations: string[];
    alerts: string[];
  }> {
    try {
      const weather = await this.getCurrentWeather(city);
      const forecast = await this.getForecast(city, 3);

      const insights = {
        farmingConditions: this.assessFarmingConditions(weather),
        recommendations: this.generateRecommendations(weather, forecast),
        alerts: this.generateAlerts(weather, forecast)
      };

      return insights;
    } catch (error) {
      console.error('Error generating agricultural insights:', error);
      throw new Error('Failed to generate weather insights');
    }
  }

  private assessFarmingConditions(weather: WeatherData): string {
    if (weather.temperature > 35) return 'Very Hot - Take precautions';
    if (weather.temperature > 25 && weather.humidity > 60) return 'Warm and Humid - Good for tropical crops';
    if (weather.temperature > 20 && weather.humidity < 70) return 'Ideal farming conditions';
    if (weather.temperature < 10) return 'Cold - Protect sensitive crops';
    return 'Moderate conditions - Monitor crops closely';
  }

  private generateRecommendations(weather: WeatherData, forecast: ForecastData[]): string[] {
    const recommendations: string[] = [];

    if (weather.humidity > 80) {
      recommendations.push('High humidity detected - ensure good ventilation in storage');
    }
    if (weather.temperature > 30) {
      recommendations.push('High temperature - increase watering frequency');
    }
    if (weather.windSpeed > 10) {
      recommendations.push('Strong winds - secure greenhouse structures');
    }
    
    const rainyDays = forecast.filter(f => f.precipitation > 0).length;
    if (rainyDays > 1) {
      recommendations.push('Rain expected - plan harvesting activities accordingly');
    }

    return recommendations;
  }

  private generateAlerts(weather: WeatherData, forecast: ForecastData[]): string[] {
    const alerts: string[] = [];

    if (weather.temperature > 40) {
      alerts.push('HEAT ALERT: Extremely high temperature - protect crops and workers');
    }
    if (weather.temperature < 2) {
      alerts.push('FROST ALERT: Risk of frost damage - protect sensitive plants');
    }
    
    const heavyRain = forecast.some(f => f.precipitation > 20);
    if (heavyRain) {
      alerts.push('HEAVY RAIN ALERT: Risk of flooding - ensure proper drainage');
    }

    return alerts;
  }
}

export const weatherService = new WeatherService();
export default weatherService;