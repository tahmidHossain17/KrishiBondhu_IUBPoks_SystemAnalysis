import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { aiService, AIMessage } from '../../services/aiApi';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Lightbulb,
  Loader2,
  Minimize2,
  Maximize2,
  RefreshCw
} from 'lucide-react';

interface AIChatWidgetProps {
  context?: string;
  placeholder?: string;
  className?: string;
  minimized?: boolean;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  context = '',
  placeholder = 'Ask me anything about farming, crops, or agriculture...',
  className = '',
  minimized = false
}) => {
  const [messages, setMessages] = useState<(AIMessage & { id: number; timestamp: Date })[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your agricultural AI assistant. I can help you with farming advice, crop recommendations, market insights, and weather-related guidance. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(minimized);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.getChatResponse(userMessage.content, context);
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Chat cleared! How can I help you with your agricultural needs?',
        timestamp: new Date()
      }
    ]);
  };

  const quickQuestions = [
    'What crops are best for monsoon season?',
    'How can I improve soil fertility?',
    'What are current market prices?',
    'Best practices for organic farming?'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  if (isMinimized) {
    return (
      <Card className={`border-gray-200 bg-white ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-blue-600" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-600">Ready to help</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="border-gray-300 text-gray-700"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-gray-200 bg-white ${className}`}>
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="mr-2 h-5 w-5 text-blue-600" />
            AI Agricultural Assistant
            <div className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="border-gray-300 text-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="border-gray-300 text-gray-700"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                onClick={() => handleQuickQuestion(question)}
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                {question}
              </Badge>
            ))}
          </div>

          {/* Messages Container */}
          <div className="h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-green-600'
                  }`}>
                    {message.role === 'user' ? 
                      <User className="h-4 w-4 text-white" /> : 
                      <Bot className="h-4 w-4 text-white" />
                    }
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-2 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 px-3"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Context indicator */}
          {context && (
            <div className="text-xs text-gray-500 flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              Context: {context}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatWidget;