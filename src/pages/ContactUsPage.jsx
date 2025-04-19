import React from 'react';
import Navbar from '../components/Navbar';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  MessageCircle,
  PlusCircle,
  MinusCircle
} from 'lucide-react';

const ContactUsPage = () => {
  // FAQ data
  const faqs = [
    {
      question: "What makes Sentiment Stories different from other event planning platforms?",
      answer: "Sentiment Stories distinguishes itself with our proprietary AI-powered features like the Weather-Mood Adapter and Emotional Journey Mapper. These innovative tools analyze environmental factors and design emotional touchpoints to create memorable, impactful events that leave lasting impressions on attendees."
    },
    {
      question: "How does the Weather-Mood Adapter work?",
      answer: "Our Weather-Mood Adapter uses advanced AI to analyze historical and real-time weather data for your event dates and location. It then generates mood optimization recommendations based on predicted conditions, suggesting adjustments to lighting, music, activities, and even menu items to create the perfect atmosphere regardless of weather circumstances."
    },
    {
      question: "Can I use Sentiment Stories for virtual events?",
      answer: "Absolutely! Sentiment Stories is fully equipped to handle both in-person and virtual events. Our platform offers specialized features for virtual gatherings, ensuring engaging online experiences with the same emotional impact as physical events through our AI-driven emotional journey mapping capabilities."
    },
    {
      question: "What type of support does Sentiment Stories provide?",
      answer: "We offer comprehensive support through multiple channels including email, phone, and our in-app messaging system. Our dedicated team of event specialists is available to assist with platform questions, event planning guidance, and technical support. We also provide extensive documentation and video tutorials to help you make the most of our platform."
    }
  ];

  // State for FAQ accordion
  const [openFaq, setOpenFaq] = React.useState(null);

  // Toggle FAQ accordion
  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Get in Touch</h1>
          <p className="mt-5 max-w-3xl mx-auto text-xl text-gray-500">
            We'd love to hear from you. Our team is always here to help with your event planning needs.
          </p>
        </div>
        
        {/* Contact Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Company Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                    <Globe className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Sentiment Stories</h3>
                    <p className="text-gray-600">AI-Powered Event Planning Platform</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  We transform ordinary events into extraordinary experiences through our innovative AI-driven emotional impact technology. Since 2023, we've been crafting moments that resonate with audiences on a deeper level.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Information Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <MapPin className="h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Address</h3>
                      <p className="text-gray-600">
                        123 Innovation Drive<br />
                        Suite 400<br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Phone className="h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-500 text-sm">Mon-Fri from 8am to 6pm PST</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Mail className="h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-gray-600">info@sentimentstories.com</p>
                      <p className="text-gray-500 text-sm">We respond within 24 hours</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Working Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 8am - 6pm</p>
                      <p className="text-gray-600">Saturday: 10am - 4pm</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Quick Connect Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Connect</h2>
                <p className="text-gray-700 mb-6">
                  Have questions or need assistance? Reach out through any of these convenient channels.
                </p>
                <div className="space-y-4">
                  <a 
                    href="/communicate" 
                    className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <div className="rounded-full bg-indigo-100 p-2 mr-3">
                      <MessageCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Chat with Us</h3>
                      <p className="text-gray-600 text-sm">Message our support team directly</p>
                    </div>
                  </a>
                  
                  <a 
                    href="mailto:support@sentimentstories.com" 
                    className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="rounded-full bg-purple-100 p-2 mr-3">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email Support</h3>
                      <p className="text-gray-600 text-sm">support@sentimentstories.com</p>
                    </div>
                  </a>
                  
                  <a 
                    href="tel:+18001234567" 
                    className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="rounded-full bg-blue-100 p-2 mr-3">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Call Us</h3>
                      <p className="text-gray-600 text-sm">+1 (800) 123-4567</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  className="w-full px-6 py-5 text-left focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    {openFaq === index ? (
                      <MinusCircle className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <PlusCircle className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                </button>
                
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;