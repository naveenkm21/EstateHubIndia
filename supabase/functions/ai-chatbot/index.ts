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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment.",
          response: "I'm experiencing high demand right now. Please try again in a moment!"
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Payment required. Please add credits to your workspace.",
          response: "Service temporarily unavailable. Please contact support."
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received:', JSON.stringify(data, null, 2));
    
    const botResponse = data.choices?.[0]?.message?.content || 
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
