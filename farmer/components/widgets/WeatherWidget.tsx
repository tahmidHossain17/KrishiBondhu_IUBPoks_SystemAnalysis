import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { weatherService, WeatherData, ForecastData } from '../../services/weatherApi';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  AlertTriangle,
  RefreshCw,
  MapPin
} from 'lucide-react';

interface WeatherWidgetProps {
  location?: string;
  showForecast?: boolean;
  showAlerts?: boolean;
  className?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  location = 'Dhaka, IN',
  showForecast = false,
  showAlerts = true,
  className = ''
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const weather = await weatherService.getCurrentWeather(location);
      setWeatherData(weather);

      if (showForecast) {
        const forecastData = await weatherService.getForecast(location, 3);
        setForecast(forecastData);
      }

      if (showAlerts) {
        const weatherInsights = await weatherService.getAgriculturalWeatherInsights(location);
        setInsights(weatherInsights);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) return <CloudRain className="h-6 w-6" />;
    if (desc.includes('cloud')) return <Cloud className="h-6 w-6" />;
    if (desc.includes('clear') || desc.includes('sun')) return <Sun className="h-6 w-6" />;
    return <Cloud className="h-6 w-6" />;
  };

  const getConditionColor = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('ideal')) return 'text-green-400';
    if (cond.includes('good')) return 'text-blue-400';
    if (cond.includes('hot') || cond.includes('cold')) return 'text-orange-400';
    if (cond.includes('precautions')) return 'text-red-400';
    return 'text-yellow-400';
  };

  if (loading) {
    return (
      <Card className={`border-slate-800 bg-slate-900 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
            <span className="ml-2 text-slate-300">Loading weather data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return (
      <Card className={`border-slate-800 bg-slate-900 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error || 'No weather data available'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchWeatherData}
              className="border-slate-700 text-slate-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Weather Card */}
      <Card className={`border-slate-800 bg-slate-900 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Thermometer className="mr-2 h-5 w-5 text-blue-400" />
              Weather Conditions
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchWeatherData}
              className="border-slate-700 text-slate-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Weather */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(weatherData.description)}
                  <div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      {weatherData.location}
                    </div>
                    <p className="text-3xl font-bold text-white">{weatherData.temperature}°C</p>
                    <p className="text-sm text-slate-400 capitalize">{weatherData.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Feels like</p>
                <p className="text-xl font-semibold text-white">{weatherData.feelsLike}°C</p>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Droplets className="h-4 w-4 text-blue-400 mr-1" />
                  <span className="text-sm text-slate-400">Humidity</span>
                </div>
                <p className="text-lg font-bold text-white">{weatherData.humidity}%</p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Wind className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-sm text-slate-400">Wind Speed</span>
                </div>
                <p className="text-lg font-bold text-white">{weatherData.windSpeed} m/s</p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Gauge className="h-4 w-4 text-purple-400 mr-1" />
                  <span className="text-sm text-slate-400">Pressure</span>
                </div>
                <p className="text-lg font-bold text-white">{weatherData.pressure} hPa</p>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <Eye className="h-4 w-4 text-cyan-400 mr-1" />
                  <span className="text-sm text-slate-400">Visibility</span>
                </div>
                <p className="text-lg font-bold text-white">{weatherData.visibility} km</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast */}
      {showForecast && forecast.length > 0 && (
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">3-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="bg-slate-800/50 p-3 rounded-lg text-center">
                  <p className="text-sm text-slate-400 mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.description)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      {day.temperature.max}° / {day.temperature.min}°
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{day.description}</p>
                    <div className="flex items-center justify-center text-xs text-blue-400">
                      <Droplets className="h-3 w-3 mr-1" />
                      {day.humidity}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agricultural Insights */}
      {showAlerts && insights && (
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">Agricultural Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Farming Conditions */}
            <div>
              <h4 className="font-medium text-slate-300 mb-2">Current Conditions</h4>
              <Badge className={`${getConditionColor(insights.farmingConditions)} bg-transparent border-current`}>
                {insights.farmingConditions}
              </Badge>
            </div>

            {/* Recommendations */}
            {insights.recommendations && insights.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-300 mb-2">Recommendations</h4>
                <div className="space-y-2">
                  {insights.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 mr-3 flex-shrink-0"></div>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts */}
            {insights.alerts && insights.alerts.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-300 mb-2">Weather Alerts</h4>
                <div className="space-y-2">
                  {insights.alerts.map((alert: string, index: number) => (
                    <div key={index} className="flex items-start p-2 bg-red-900/20 border border-red-400/20 rounded text-sm text-red-400">
                      <AlertTriangle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherWidget;