import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  type: 'bot' | 'user';
  text: string;
  options?: string[];
}

interface Response {
  text: string;
  options: string[];
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: '👋 Hello! I\'m your Home Heroes assistant. How can I help you today?',
      options: [
        'How does booking work?',
        'Explain payment system',
        'How to become a provider?',
        'What is job posting?',
        'Customer journey',
        'Provider journey'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const responses: Record<string, Response> = {
    'how does booking work?': {
      text: `**📅 Booking Process:**

**For Customers:**
1. Browse available services or providers
2. Select your preferred provider
3. Choose date and time
4. Make payment (held in escrow)
5. Provider receives email notification
6. Provider accepts booking
7. Provider arrives within 4 hours
8. Confirm arrival to release payment

**For Providers:**
1. Receive email notification of booking
2. Review booking details
3. Accept or decline within timeframe
4. Head to customer location
5. Complete the job
6. Receive 85% of payment (15% platform fee)`,
      options: [
        'What if provider doesn\'t show?',
        'Explain payment system',
        'How to cancel booking?'
      ]
    },
    'explain payment system': {
      text: `**💳 Escrow Payment System:**

Our secure payment process protects everyone:

**Step 1:** Customer pays immediately after booking
**Step 2:** Money is held securely in escrow
**Step 3:** Provider confirms and accepts booking
**Step 4:** Payment held for 4 hours while provider travels
**Step 5:** Customer confirms provider arrival
**Step 6:** Payment released:
   • 85% to provider
   • 15% platform service fee

**🔒 Safety Features:**
• Auto-refund if provider doesn't arrive in 4 hours
• No scams or underpayment
• Fast and transparent
• Customer only pays for completed work`,
      options: [
        'What if provider doesn\'t show?',
        'How refunds work?',
        'Provider earnings'
      ]
    },
    'what if provider doesn\'t show?': {
      text: `**⏰ No-Show Protection:**

If provider doesn't arrive within 4 hours:
• Payment is **automatically reversed**
• Full refund to customer
• No questions asked
• Instant processing

You're completely protected! 🛡️`,
      options: [
        'How does booking work?',
        'Customer journey',
        'Contact support'
      ]
    },
    'how to become a provider?': {
      text: `**👷 Become a Provider:**

**Sign Up Process:**
1. Click "Become a Provider"
2. Create your profile
3. Add your skills & experience
4. Upload ID and documents
5. Background verification (24-48 hours)
6. Get approved
7. Start receiving job requests!

**Earnings:**
• Earn ₦5k-30k daily
• Set your own rates
• Flexible schedule
• 85% of each payment
• Insurance coverage included

Ready to start earning? 💰`,
      options: [
        'Provider journey',
        'How to get bookings?',
        'View provider benefits'
      ]
    },
    'what is job posting?': {
      text: `**📝 Job Posting System:**

**For Customers:**
Instead of browsing providers, you can:
1. Post a job with details
2. Set your budget
3. Wait for provider applications
4. Review applications
5. Choose your preferred provider
6. Book directly

**For Providers:**
1. Browse available job postings
2. Apply to jobs matching your skills
3. Submit your proposal and rate
4. Wait for customer selection
5. Get hired and start working

Perfect for custom or urgent jobs! ⚡`,
      options: [
        'How does booking work?',
        'Customer journey',
        'Provider journey'
      ]
    },
    'customer journey': {
      text: `**🏠 Complete Customer Journey:**

**Option A: Direct Booking**
1. Browse services/providers
2. Check reviews & ratings
3. Select provider
4. Choose date/time
5. Make payment (escrow)
6. Provider gets email notification
7. Provider accepts booking
8. Provider arrives (4hr window)
9. Confirm arrival
10. Job completed
11. Payment released to provider
12. Leave review ⭐

**Option B: Post a Job**
1. Click "Post a Job"
2. Describe your needs
3. Set your budget
4. Receive provider applications
5. Review proposals
6. Select best provider
7. Continue with booking process

**Protection:**
• Verified providers only
• Auto-refund if no-show
• Insurance coverage
• 24/7 support`,
      options: [
        'Explain payment system',
        'What if provider doesn\'t show?',
        'Provider journey'
      ]
    },
    'provider journey': {
      text: `**👨‍🔧 Complete Provider Journey:**

**Getting Started:**
1. Sign up as provider
2. Complete profile
3. Background verification
4. Get approved

**Receiving Jobs:**

**Method 1: Direct Bookings**
• Customer books you directly
• Email notification sent
• Review booking details
• Accept or decline
• Head to location
• Complete job
• Get paid (85%)

**Method 2: Job Applications**
• Browse job postings
• View applications page
• Apply to matching jobs
• Submit proposal
• Wait for customer selection
• If hired, proceed with job

**Earnings:**
• Same-day payment
• 85% of booking amount
• Track all applications
• Build your reputation
• Flexible schedule

**Dashboard Features:**
• View pending bookings
• See job applications status
• Track earnings
• Manage schedule
• Customer reviews`,
      options: [
        'How to get bookings?',
        'Explain payment system',
        'View provider benefits'
      ]
    },
    'provider earnings': {
      text: `**💰 Provider Earnings Breakdown:**

**Payment Split:**
• You receive: 85%
• Platform fee: 15%

**Example:**
Customer pays ₦10,000
→ You get ₦8,500
→ Platform gets ₦1,500

**When You Get Paid:**
• After customer confirms arrival
• Instant transfer to your account
• Track all earnings in dashboard

**Earning Potential:**
• ₦5,000 - ₦30,000 daily
• Set your own rates
• More jobs = more earnings
• Build reputation for higher rates`,
      options: [
        'How to become a provider?',
        'Provider journey',
        'View provider benefits'
      ]
    },
    'how refunds work?': {
      text: `**💸 Refund Policy:**

**Automatic Refunds:**
• Provider doesn't arrive in 4 hours → Full refund
• Instant processing
• No forms to fill

**Customer-Initiated:**
• Cancel before provider accepts → Full refund
• Cancel after acceptance → Check cancellation policy
• Contact support for special cases

**Provider No-Show:**
• Money never leaves escrow
• Automatic reversal
• Back in your account instantly

All refunds are fast and hassle-free! ✅`,
      options: [
        'Explain payment system',
        'How does booking work?',
        'Contact support'
      ]
    },
    'how to cancel booking?': {
      text: `**❌ Cancellation Process:**

**Before Provider Accepts:**
• Go to "My Bookings"
• Click booking
• Select "Cancel"
• Instant full refund

**After Provider Accepts:**
• Contact provider first
• Mutual cancellation possible
• May incur cancellation fee
• Or contact support

**Provider Cancellation:**
• Provider can decline before accepting
• Can cancel with valid reason
• May affect their rating

**Emergency:**
• Contact support 24/7
• We'll help resolve
• Fair resolution for both parties`,
      options: [
        'How refunds work?',
        'Contact support',
        'Customer journey'
      ]
    },
    'view provider benefits': {
      text: `**🎁 Provider Benefits:**

**Financial:**
• Earn ₦5k-30k daily
• Flexible pricing
• Fast payments
• 85% of booking amount

**Protection:**
• Insurance coverage
• Secure payment system
• Platform support

**Flexibility:**
• Set your schedule
• Choose your jobs
• Work area preferences
• Accept/decline bookings

**Growth:**
• Build reputation
• Get more bookings
• Increase rates
• Customer reviews

**Support:**
• 24/7 assistance
• Training resources
• Community access
• Marketing tools`,
      options: [
        'How to become a provider?',
        'Provider journey',
        'How to get bookings?'
      ]
    },
    'how to get bookings?': {
      text: `**📲 Getting More Bookings:**

**Build Your Profile:**
• Complete all information
• Add quality photos
• Highlight experience
• List all skills

**Get Good Reviews:**
• Excellent service = 5 stars
• Reviews attract customers
• Build your reputation

**Be Responsive:**
• Accept bookings quickly
• Reply to messages fast
• Professional communication

**Apply to Jobs:**
• Check job postings daily
• Submit competitive proposals
• Showcase your expertise

**Set Competitive Rates:**
• Research market prices
• Balance quality & affordability
• Offer fair pricing

**Stay Active:**
• Update availability
• Keep profile current
• Consistent service quality`,
      options: [
        'Provider journey',
        'View provider benefits',
        'Customer journey'
      ]
    },
    'contact support': {
      text: `**📞 Contact Support:**

Need help? We're here 24/7!

**Ways to Reach Us:**
• Email: support@homehero.com
• Phone: +234-XXX-XXXX-XXX
• Live Chat: Available in app
• Help Center: Browse FAQs

**Support Hours:**
🕐 24/7 availability
📧 Email response: Within 2 hours
📞 Phone support: Immediate

**Common Issues:**
• Booking problems
• Payment issues
• Account verification
• Technical support
• Disputes resolution

We're committed to helping you! 💚`,
      options: [
        'How does booking work?',
        'Customer journey',
        'Provider journey'
      ]
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);

    const searchQuery = inputValue.toLowerCase();
    let response: Response | null = null;

    for (const [key, value] of Object.entries(responses)) {
      if (searchQuery.includes(key.split(' ')[0]) || key.includes(searchQuery)) {
        response = value;
        break;
      }
    }

    if (!response) {
      response = {
        text: `I understand you're asking about "${inputValue}". Let me help you with that!

Here are some topics I can help with:`,
        options: [
          'How does booking work?',
          'Explain payment system',
          'Customer journey',
          'Provider journey',
          'Contact support'
        ]
      };
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', ...response }]);
    }, 500);

    setInputValue('');
  };

  const handleOptionClick = (option: string) => {
    const userMessage: Message = { type: 'user', text: option };
    setMessages(prev => [...prev, userMessage]);

    const response: Response = responses[option.toLowerCase()] || {
      text: 'Let me help you with that!',
      options: [
        'How does booking work?',
        'Explain payment system',
        'Customer journey'
      ]
    };

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', ...response }]);
    }, 500);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all duration-300 z-50 hover:scale-110 animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-[calc(100vw-2rem)] max-w-96 h-[500px] sm:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">HomeHero Assistant</h3>
                <p className="text-xs text-green-100">Online • Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-green-600' : 'bg-gray-200'}`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                      )}
                    </div>
                    <div className={`p-2.5 sm:p-3 rounded-2xl ${message.type === 'user' ? 'bg-green-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                      <div className="whitespace-pre-line text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/•/g, '•') }} />
                    </div>
                  </div>
                </div>

                {message.options && (
                  <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2 ml-9 sm:ml-10">
                    {message.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => handleOptionClick(option)}
                        className="bg-white border-2 border-green-600 text-green-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium hover:bg-green-600 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 sm:p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-full px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-xs sm:text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors active:scale-95"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Home Heroes AI
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;