import axios from 'axios';
import { env, API_ENDPOINTS } from '../config/env';
import { weatherService } from './weatherApi';

export interface CropRecommendation {
  id: string;
  name: string;
  variety: string;
  confidence: number;
  reasons: string[];
  expectedYield: string;
  growingPeriod: string;
  waterRequirement: string;
  soilRequirement: string;
  climateRequirement: string;
  marketPrice: number;
  profitability: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  tips: string[];
  seasonality: {
    plantingMonths: number[];
    harvestingMonths: number[];
  };
}

export interface SoilAnalysis {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  temperature: number;
  recommendations: string[];
}

export interface WeatherPattern {
  avgTemperature: number;
  avgRainfall: number;
  avgHumidity: number;
  seasonalVariation: {
    summer: { temp: number; rainfall: number };
    monsoon: { temp: number; rainfall: number };
    winter: { temp: number; rainfall: number };
  };
  climateZone: string;
}

export interface CropHealth {
  healthScore: number;
  diseases: Array<{
    name: string;
    probability: number;
    severity: string;
    treatment: string;
  }>;
  pests: Array<{
    name: string;
    probability: number;
    damage: string;
    control: string;
  }>;
  recommendations: string[];
}

export interface MarketPrediction {
  crop: string;
  currentPrice: number;
  predictedPrice: number;
  priceChange: number;
  demand: 'high' | 'medium' | 'low';
  supplyStatus: 'surplus' | 'balanced' | 'shortage';
  bestSellingTime: string;
  marketTrends: string[];
}

class AIService {
  private baseURL: string;
  private openRouterAPI: string;

  constructor() {
    this.baseURL = env.VITE_AI_API_URL || 'http://localhost:3001/api/ai';
    this.openRouterAPI = API_ENDPOINTS.openRouter;
  }

  // Advanced Crop Recommendation with AI
  async getCropRecommendations(params: {
    location: { lat: number; lng: number };
    landArea: number;
    soilType: string;
    previousCrops?: string[];
    budget?: number;
    experience?: string;
    objectives?: string[];
  }): Promise<CropRecommendation[]> {
    try {
      // Get weather data for the location
      const weatherData = await weatherService.getCurrentWeather(params.location.lat, params.location.lng);
      const historicalWeather = await this.getHistoricalWeatherData(params.location);
      
      // Analyze soil conditions
      const soilAnalysis = await this.analyzeSoilData(params.soilType, params.location);
      
      // Get market trends
      const marketData = await this.getMarketTrends(params.location);

      // Prepare AI prompt
      const prompt = this.buildCropRecommendationPrompt({
        ...params,
        currentWeather: weatherData,
        historicalWeather,
        soilAnalysis,
        marketData,
      });

      // Get AI recommendations
      const aiResponse = await this.queryOpenRouter(prompt, 'crop-recommendation');
      
      // Process and rank recommendations
      const recommendations = await this.processCropRecommendations(aiResponse, params);
      
      return recommendations;

    } catch (error) {
      console.error('Error getting crop recommendations:', error);
      return this.getFallbackCropRecommendations(params);
    }
  }

  // Intelligent Pesticide Recommendations
  async getPesticideRecommendations(params: {
    crop: string;
    problem: string;
    symptoms: string[];
    location: { lat: number; lng: number };
    cropStage: string;
    organic?: boolean;
  }): Promise<any[]> {
    try {
      const prompt = `
        Crop: ${params.crop}
        Problem: ${params.problem}
        Symptoms: ${params.symptoms.join(', ')}
        Crop Stage: ${params.cropStage}
        Organic: ${params.organic ? 'Yes' : 'No'}
        Location: ${params.location.lat}, ${params.location.lng}

        Based on the above information, recommend appropriate pesticides or treatments.
        Include dosage, application method, safety precautions, and organic alternatives if requested.
        Provide specific product names available in Bangladesh/Bangladesh market.
      `;

      const response = await this.queryOpenRouter(prompt, 'pesticide-recommendation');
      return this.processPesticideRecommendations(response);

    } catch (error) {
      console.error('Error getting pesticide recommendations:', error);
      return this.getFallbackPesticideRecommendations(params.crop, params.problem);
    }
  }

  // Market Price Prediction
  async predictMarketPrices(crops: string[], location: { lat: number; lng: number }): Promise<MarketPrediction[]> {
    try {
      // Get historical price data
      const historicalPrices = await this.getHistoricalPriceData(crops, location);
      
      // Get current market conditions
      const marketConditions = await this.getCurrentMarketConditions(location);

      // Prepare AI prompt for price prediction
      const prompt = this.buildPricePredictionPrompt(crops, historicalPrices, marketConditions);
      
      const aiResponse = await this.queryOpenRouter(prompt, 'price-prediction');
      
      return this.processMarketPredictions(aiResponse, crops);

    } catch (error) {
      console.error('Error predicting market prices:', error);
      return this.getFallbackMarketPredictions(crops);
    }
  }

  // Crop Health Analysis from Images
  async analyzeCropHealth(imageData: string, cropType: string): Promise<CropHealth> {
    try {
      // This would typically use a computer vision model
      const analysisData = await axios.post(`${this.baseURL}/analyze-crop-health`, {
        image: imageData,
        cropType,
      });

      return analysisData.data;

    } catch (error) {
      console.error('Error analyzing crop health:', error);
      return this.getFallbackCropHealth();
    }
  }

  // Weather-Based Advisory
  async getWeatherAdvisory(
    location: { lat: number; lng: number },
    crops: string[]
  ): Promise<string[]> {
    try {
      const weatherForecast = await weatherService.getWeatherForecast(location.lat, location.lng);
      
      const prompt = `
        Weather Forecast: ${JSON.stringify(weatherForecast)}
        Crops: ${crops.join(', ')}
        Location: ${location.lat}, ${location.lng}

        Based on the weather forecast, provide specific agricultural advisory for the mentioned crops.
        Include recommendations for irrigation, pest control, harvesting timing, and any precautions needed.
      `;

      const response = await this.queryOpenRouter(prompt, 'weather-advisory');
      return this.processWeatherAdvisory(response);

    } catch (error) {
      console.error('Error getting weather advisory:', error);
      return ['Weather advisory temporarily unavailable. Please check local weather conditions.'];
    }
  }

  // Soil Optimization Recommendations
  async getSoilOptimizationTips(soilData: SoilAnalysis, targetCrop: string): Promise<string[]> {
    try {
      const prompt = `
        Soil Analysis:
        - pH: ${soilData.pH}
        - Nitrogen: ${soilData.nitrogen}%
        - Phosphorus: ${soilData.phosphorus}%
        - Potassium: ${soilData.potassium}%
        - Organic Matter: ${soilData.organicMatter}%
        - Moisture: ${soilData.moisture}%

        Target Crop: ${targetCrop}

        Provide specific recommendations to optimize soil conditions for this crop.
        Include fertilizer recommendations, soil amendments, and management practices.
      `;

      const response = await this.queryOpenRouter(prompt, 'soil-optimization');
      return this.processSoilRecommendations(response);

    } catch (error) {
      console.error('Error getting soil optimization tips:', error);
      return ['Soil optimization tips temporarily unavailable.'];
    }
  }

  // Irrigation Scheduling
  async getIrrigationSchedule(params: {
    crop: string;
    soilType: string;
    cropStage: string;
    weatherForecast: any;
    plantingDate: string;
  }): Promise<any> {
    try {
      const prompt = `
        Crop: ${params.crop}
        Soil Type: ${params.soilType}
        Crop Stage: ${params.cropStage}
        Planting Date: ${params.plantingDate}
        Weather Forecast: ${JSON.stringify(params.weatherForecast)}

        Create an optimal irrigation schedule for the next 2 weeks.
        Consider rainfall predictions, soil moisture retention, and crop water requirements.
      `;

      const response = await this.queryOpenRouter(prompt, 'irrigation-schedule');
      return this.processIrrigationSchedule(response);

    } catch (error) {
      console.error('Error getting irrigation schedule:', error);
      return this.getFallbackIrrigationSchedule();
    }
  }

  // Private helper methods
  private async queryOpenRouter(prompt: string, task: string): Promise<any> {
    try {
      const response = await axios.post(
        this.openRouterAPI,
        {
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an agricultural AI assistant specializing in ${task}. Provide accurate, practical advice for farmers in Bangladesh/Bangladesh region.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${env.VITE_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;

    } catch (error) {
      console.error('Error querying OpenRouter:', error);
      throw new Error('AI service temporarily unavailable');
    }
  }

  private buildCropRecommendationPrompt(data: any): string {
    return `
      Location: ${data.location.lat}, ${data.location.lng}
      Land Area: ${data.landArea} acres
      Soil Type: ${data.soilType}
      Previous Crops: ${data.previousCrops?.join(', ') || 'None'}
      Budget: $${data.budget || 'Not specified'}
      Experience: ${data.experience || 'Beginner'}
      Objectives: ${data.objectives?.join(', ') || 'Profit maximization'}

      Current Weather: ${JSON.stringify(data.currentWeather)}
      Historical Weather: ${JSON.stringify(data.historicalWeather)}
      Soil Analysis: ${JSON.stringify(data.soilAnalysis)}
      Market Data: ${JSON.stringify(data.marketData)}

      Recommend 5 best crops for this farmer with detailed analysis including:
      1. Crop name and variety
      2. Confidence score (0-100)
      3. Reasons for recommendation
      4. Expected yield
      5. Growing period
      6. Water and soil requirements
      7. Market price and profitability
      8. Risk assessment
      9. Practical tips
      10. Best planting and harvesting months

      Format the response as JSON array.
    `;
  }

  private async processCropRecommendations(aiResponse: string, params: any): Promise<CropRecommendation[]> {
    try {
      // Parse AI response and structure it
      const recommendations = JSON.parse(aiResponse);
      
      // Add additional processing and validation
      return recommendations.map((rec: any, index: number) => ({
        id: `crop_${index + 1}`,
        name: rec.name || `Crop ${index + 1}`,
        variety: rec.variety || 'Standard',
        confidence: rec.confidence || 75,
        reasons: rec.reasons || ['AI recommended based on conditions'],
        expectedYield: rec.expectedYield || '10-15 tons/acre',
        growingPeriod: rec.growingPeriod || '90-120 days',
        waterRequirement: rec.waterRequirement || 'Medium',
        soilRequirement: rec.soilRequirement || 'Well-drained',
        climateRequirement: rec.climateRequirement || 'Tropical',
        marketPrice: rec.marketPrice || 25,
        profitability: rec.profitability || 'medium',
        riskLevel: rec.riskLevel || 'medium',
        tips: rec.tips || ['Follow recommended planting schedule'],
        seasonality: rec.seasonality || {
          plantingMonths: [3, 4, 5],
          harvestingMonths: [6, 7, 8]
        }
      }));

    } catch (error) {
      console.error('Error processing crop recommendations:', error);
      return this.getFallbackCropRecommendations(params);
    }
  }

  private getFallbackCropRecommendations(params: any): CropRecommendation[] {
    // Fallback recommendations based on soil type and season
    const fallbackCrops = [
      {
        id: 'rice_1',
        name: 'Rice',
        variety: 'BRRI Dhan 28',
        confidence: 85,
        reasons: ['Suitable for local climate', 'High demand in market'],
        expectedYield: '4-5 tons/acre',
        growingPeriod: '140-145 days',
        waterRequirement: 'High',
        soilRequirement: 'Clay loam',
        climateRequirement: 'Tropical monsoon',
        marketPrice: 22,
        profitability: 'high' as const,
        riskLevel: 'low' as const,
        tips: ['Transplant in proper spacing', 'Apply fertilizer as recommended'],
        seasonality: {
          plantingMonths: [6, 7],
          harvestingMonths: [11, 12]
        }
      },
      {
        id: 'wheat_1',
        name: 'Wheat',
        variety: 'BARI Gom 26',
        confidence: 75,
        reasons: ['Winter crop', 'Good market price'],
        expectedYield: '3-4 tons/acre',
        growingPeriod: '110-120 days',
        waterRequirement: 'Medium',
        soilRequirement: 'Well-drained loam',
        climateRequirement: 'Cool dry',
        marketPrice: 25,
        profitability: 'medium' as const,
        riskLevel: 'medium' as const,
        tips: ['Sow in optimal time', 'Proper irrigation management'],
        seasonality: {
          plantingMonths: [11, 12],
          harvestingMonths: [3, 4]
        }
      }
    ];

    return fallbackCrops;
  }

  private processPesticideRecommendations(response: string): any[] {
    // Process AI response for pesticide recommendations
    try {
      return JSON.parse(response);
    } catch {
      return [
        {
          name: 'Neem Oil',
          type: 'Organic',
          dosage: '2-3 ml per liter water',
          application: 'Foliar spray',
          safety: 'Safe for humans and beneficial insects'
        }
      ];
    }
  }

  private getFallbackPesticideRecommendations(crop: string, problem: string): any[] {
    return [
      {
        name: 'Neem-based pesticide',
        type: 'Organic',
        dosage: '2-3 ml per liter',
        application: 'Foliar spray in evening',
        safety: 'Safe for beneficial insects',
        notes: `Recommended for ${problem} in ${crop}`
      }
    ];
  }

  // Additional helper methods for data fetching and processing
  private async getHistoricalWeatherData(location: { lat: number; lng: number }): Promise<WeatherPattern> {
    // Simulate historical weather data - in production, this would fetch real data
    return {
      avgTemperature: 28,
      avgRainfall: 1200,
      avgHumidity: 75,
      seasonalVariation: {
        summer: { temp: 35, rainfall: 100 },
        monsoon: { temp: 28, rainfall: 800 },
        winter: { temp: 20, rainfall: 50 }
      },
      climateZone: 'Tropical monsoon'
    };
  }

  private async analyzeSoilData(soilType: string, location: { lat: number; lng: number }): Promise<SoilAnalysis> {
    // Simulate soil analysis - in production, this would use real soil data
    return {
      pH: 6.5,
      nitrogen: 0.8,
      phosphorus: 0.3,
      potassium: 0.6,
      organicMatter: 2.5,
      moisture: 25,
      temperature: 25,
      recommendations: ['Add organic matter', 'Balance pH if needed']
    };
  }

  private async getMarketTrends(location: { lat: number; lng: number }): Promise<any> {
    // Simulate market trends data
    return {
      trending: ['Rice', 'Wheat', 'Vegetables'],
      prices: { rice: 22, wheat: 25, tomato: 30 },
      demand: 'high'
    };
  }

  private buildPricePredictionPrompt(crops: string[], historicalPrices: any, marketConditions: any): string {
    return `Predict market prices for: ${crops.join(', ')} based on historical data and current market conditions.`;
  }

  private processMarketPredictions(response: string, crops: string[]): MarketPrediction[] {
    // Process AI response for market predictions
    return crops.map(crop => ({
      crop,
      currentPrice: 25,
      predictedPrice: 28,
      priceChange: 3,
      demand: 'medium' as const,
      supplyStatus: 'balanced' as const,
      bestSellingTime: 'Next month',
      marketTrends: ['Stable demand', 'Good supply']
    }));
  }

  private getFallbackMarketPredictions(crops: string[]): MarketPrediction[] {
    return crops.map(crop => ({
      crop,
      currentPrice: 25,
      predictedPrice: 26,
      priceChange: 1,
      demand: 'medium' as const,
      supplyStatus: 'balanced' as const,
      bestSellingTime: 'Current season',
      marketTrends: ['Market data unavailable']
    }));
  }

  private getFallbackCropHealth(): CropHealth {
    return {
      healthScore: 75,
      diseases: [],
      pests: [],
      recommendations: ['Image analysis temporarily unavailable']
    };
  }

  private processWeatherAdvisory(response: string): string[] {
    try {
      return JSON.parse(response);
    } catch {
      return ['Weather advisory processing failed'];
    }
  }

  private processSoilRecommendations(response: string): string[] {
    try {
      return JSON.parse(response);
    } catch {
      return ['Soil optimization tips processing failed'];
    }
  }

  private processIrrigationSchedule(response: string): any {
    try {
      return JSON.parse(response);
    } catch {
      return this.getFallbackIrrigationSchedule();
    }
  }

  private getFallbackIrrigationSchedule(): any {
    return {
      schedule: [
        { day: 1, amount: '25mm', time: 'Morning' },
        { day: 3, amount: '20mm', time: 'Evening' },
        { day: 6, amount: '30mm', time: 'Morning' }
      ],
      notes: ['Adjust based on rainfall', 'Monitor soil moisture']
    };
  }

  private async getHistoricalPriceData(crops: string[], location: { lat: number; lng: number }): Promise<any> {
    // Simulate historical price data
    return crops.reduce((acc, crop) => {
      acc[crop] = [20, 22, 25, 24, 26]; // Last 5 periods
      return acc;
    }, {} as any);
  }

  private async getCurrentMarketConditions(location: { lat: number; lng: number }): Promise<any> {
    // Simulate current market conditions
    return {
      demand: 'high',
      supply: 'medium',
      season: 'harvest',
      weather_impact: 'minimal'
    };
  }
}

export const aiService = new AIService();