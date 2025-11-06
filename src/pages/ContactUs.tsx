import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const ContactUs = () => {
  const suggestions = [
    { title: "Return an item for a refund", subtitle: "Popular article • 4 min" },
    { title: "Get help with an item that hasn't arrived", subtitle: "Popular article • 4 min" },
    { title: "Shipping your items", subtitle: "Popular article • 2 min" },
    { title: "Creating a listing", subtitle: "Popular article • 4 min" },
  ];

  const deliveryQuestions = [
    "What should I do if my order is approved but hasn't been shipped yet?",
    "Can I take the shipment after opening and checking the contents inside?",
    "How quickly can I get my order delivered?",
    "What are the standard shipping speeds and delivery charges?",
    "When will I get my to order once its status changes to 'Out for Delivery'?",
    "Why am I unable to order products like television, air - conditioner, refrigerator, washing machine, furniture, microwave, microwave, microwave, treadmill, etc. at my location?",
  ];

  const issueTypes = [
    "Help with your issues",
    "Help with your order",
    "Help with other issues",
  ];

  const helpTopics = [
    "Deliver related",
    "Login and my account",
    "Refunds related",
    "Yakuza EMI",
    "Payment",
    "Returns & Pickup related",
    "Cancellation related",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-32 max-w-7xl" style={{ backgroundColor: '#F8F9F9' }}>
        
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Left Sidebar */}
          <aside className="space-y-6 sticky top-32 self-start">
            <h1 className="text-3xl font-semibold text-foreground">Customer Service</h1>
            {/* Need Help Card */}
            <div className="bg-white p-6 shadow-sm rounded-none">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">Need more help?</h2>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Get the help you need from our automated assistant, or contact an agent
              </p>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11"
                asChild
              >
                <a href="https://wa.me/917056009099" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Contact With WhatsApp
                </a>
              </Button>
            </div>

            {/* Type of Issue & Help Topics */}
            <div className="bg-white p-6 shadow-sm rounded-none">
              {/* Type of Issue */}
              <div>
                <h3 className="text-base font-bold mb-4 text-gray-900 uppercase tracking-wide">TYPE OF ISSUE</h3>
                <div className="space-y-3">
                  {issueTypes.map((issue, index) => (
                    <button
                      key={index}
                      className="block w-full text-left text-base text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>

              {/* Horizontal Divider */}
              <hr className="my-6 border-gray-200" />

              {/* Help Topics */}
              <div>
                <h3 className="text-base font-bold mb-4 text-gray-900 uppercase tracking-wide">HELP TOPICS</h3>
                <div className="space-y-3">
                  {helpTopics.map((topic, index) => (
                    <button
                      key={index}
                      className="block w-full text-left text-base text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-10">
            {/* Suggestions */}
            <section className="bg-white p-6 shadow-sm rounded-none">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Suggestions for you</h2>
              <p className="text-sm text-gray-600 mb-6">Select an action or article to learn more</p>
              
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left hover:bg-gray-50 transition-colors p-3 rounded group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-normal text-base text-gray-900 mb-1 underline group-hover:text-blue-600">
                          {suggestion.title}
                        </h3>
                        <p className="text-sm text-gray-500">{suggestion.subtitle}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Delivery Related */}
            <section className="bg-white p-6 shadow-sm rounded-none">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Delivery related</h2>
              
              <div className="space-y-4">
                {deliveryQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="block w-full text-left text-base text-gray-700 hover:text-gray-900 hover:underline transition-colors py-1"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <button className="mt-8 text-base font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                View More
              </button>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
