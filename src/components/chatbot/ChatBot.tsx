import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  userBudget?: number;
  userCity?: string;
  userPropertyType?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ userBudget, userCity, userPropertyType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when chatbot opens
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'bot',
        content: `Namaste! I'm PropertyBuddy, your personal real estate assistant for India. 🏠

I'm here to help you with:
✨ Finding your dream property
💰 Understanding market prices and trends
📍 Exploring different localities
📋 Guidance on documentation and processes
🔍 Property recommendations based on your needs

Whether you're buying, selling, or renting, I'm here to guide you every step of the way!

What brings you here today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const context = messages.map(m => `${m.type}: ${m.content}`).join('\n');
      
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: {
          message: inputValue,
          budget: userBudget,
          city: userCity,
          propertyType: userPropertyType,
          context: context
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
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
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-16 w-16 rounded-full bg-gradient-primary hover:shadow-elegant transition-all duration-500 hover:scale-110 shadow-lg animate-fade-in group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <MessageCircle className="h-7 w-7 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
        </Button>
      ) : (
        <Card className="w-[400px] h-[600px] flex flex-col shadow-elegant backdrop-blur-xl bg-background/95 border-2 border-border/50 rounded-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="relative flex items-center justify-between p-5 bg-gradient-primary/10 backdrop-blur-md border-b border-border/50">
            <div className="absolute inset-0 bg-gradient-primary opacity-10" />
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg animate-pulse">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">PropertyBuddy</span>
                <p className="text-xs text-muted-foreground">AI Real Estate Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="relative z-10 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 rounded-full h-9 w-9 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-5 bg-gradient-to-b from-background/50 to-background">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 ${
                      message.type === 'user' 
                        ? 'bg-gradient-primary text-primary-foreground' 
                        : 'bg-secondary/80 text-secondary-foreground backdrop-blur-sm'
                    }`}>
                      {message.type === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    <div className={`rounded-2xl p-4 shadow-md backdrop-blur-sm transition-all hover:shadow-lg ${
                      message.type === 'user' 
                        ? 'bg-gradient-primary text-primary-foreground' 
                        : 'bg-card/80 text-card-foreground border border-border/50'
                    }`}>
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      <span className="text-xs opacity-60 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/80 text-secondary-foreground shadow-md backdrop-blur-sm">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="rounded-2xl p-4 bg-card/80 text-card-foreground shadow-md backdrop-blur-sm border border-border/50">
                      <div className="flex space-x-2">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-5 border-t border-border/50 bg-background/80 backdrop-blur-md">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about properties..."
                disabled={isLoading}
                className="flex-1 rounded-xl bg-card/50 border-border/50 focus-visible:ring-primary transition-all duration-300 hover:bg-card/80"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="rounded-xl bg-gradient-primary hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 px-5"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;
