import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = 'AIzaSyBl_9DUsk1gnDEMU4CnFCO5yEycpUj6IQ4';

    const { message, budget, city, propertyType, context } = await req.json();
    
    console.log('Received chat request:', { message, budget, city, propertyType });

    const systemPrompt = `You are PropertyBuddy, an expert Indian real estate assistant dedicated to helping users navigate the Indian property market. Your role is to guide users through their property journey with expertise and warmth.

Core Responsibilities:
- Help users find their perfect property based on their budget, location preferences, and requirements
- Answer questions about property listings, pricing, localities, and amenities
- Provide guidance on buying, selling, or renting properties in India
- Explain real estate processes, documentation, and legal requirements
- Offer market insights for major Indian cities (Mumbai, Delhi NCR, Bangalore, Pune, Chennai, Hyderabad, etc.)
- Suggest suitable properties based on user preferences
- Help users understand different property types (1BHK, 2BHK, 3BHK, Villa, Plot, Commercial, etc.)

Key Guidelines:
- Always use Indian Rupees (₹) and Indian numbering system (Lakhs, Crores)
- Consider Indian-specific factors: Vastu, parking, power backup, water supply, society amenities
- Be conversational, friendly, and patient
- Ask clarifying questions to better understand user needs
- Provide practical, actionable advice
- Help users make informed decisions by explaining pros and cons
- Guide users on next steps (viewing properties, documentation, legal checks, etc.)
- Address concerns about locality, connectivity, schools, hospitals nearby

Current User Context:
${context ? `Budget: ${budget ? '₹' + budget.toLocaleString('en-IN') : 'Not specified'}
Preferred City: ${city || 'Not specified'}
Property Type: ${propertyType || 'Not specified'}
Conversation History: ${context}` : 'This is a new conversation'}

Remember: You're not just answering questions - you're guiding users through one of their most important life decisions. Be helpful, thorough, and supportive.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `User message: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      
      // Provide helpful fallback response
      let fallbackResponse = "Hello! I'm PropertyBuddy, your Indian real estate assistant. 🏠\n\nI can help you with:\n- Finding properties based on your budget and location\n- Understanding property prices and market trends\n- Guidance on buying, selling, or renting\n- Property documentation and legal processes\n- Locality insights and amenities\n\nHow can I assist you with your property search today?";
      
      if (response.status === 429) {
        fallbackResponse = "I'm experiencing high demand right now. Let me help you with basic guidance:\n\nWhat are you looking for?\n1. Properties to buy\n2. Properties to rent\n3. Selling your property\n4. Property market information\n\nPlease tell me your requirements and I'll do my best to assist!";
      }
      
      return new Response(JSON.stringify({ 
        response: fallbackResponse,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data, null, 2));
    
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm here to help you with your property search! Could you tell me more about what you're looking for?";

    console.log('Bot response generated successfully');

    return new Response(JSON.stringify({ 
      response: botResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      response: "I'm PropertyBuddy, your real estate assistant! I'm here to help you find the perfect property in India. What are you looking for today - a home to buy, rent, or would you like to sell a property?"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});