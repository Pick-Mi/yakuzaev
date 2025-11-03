import { Link } from "react-router-dom";
import { ChevronRight, MessageCircle } from "lucide-react";
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
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-32">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Customer Service</h1>
        
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          {/* Left Sidebar */}
          <aside className="space-y-6">
            {/* Need Help Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-3 text-foreground">Need more help?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Get the help you need from our automated assistant, or contact an agent
              </p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact via WhatsApp
              </Button>
            </div>

            {/* Type of Issue */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-foreground">TYPE OF ISSUE</h3>
              <div className="space-y-3">
                {issueTypes.map((issue, index) => (
                  <button
                    key={index}
                    className="block w-full text-left text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>

            {/* Help Topics */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-foreground">HELP TOPICS</h3>
              <div className="space-y-3">
                {helpTopics.map((topic, index) => (
                  <button
                    key={index}
                    className="block w-full text-left text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Suggestions */}
            <section>
              <h2 className="text-xl font-semibold mb-2 text-foreground">Suggestions for you</h2>
              <p className="text-sm text-muted-foreground mb-4">Select an action or article to learn more</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="bg-card border border-border rounded-lg p-4 text-left hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground mb-1 underline group-hover:text-primary">
                          {suggestion.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{suggestion.subtitle}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Delivery Related */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery related</h2>
              
              <div className="space-y-3">
                {deliveryQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="block w-full text-left text-sm text-foreground hover:text-primary hover:underline transition-colors py-2"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <button className="mt-6 text-sm font-semibold text-foreground hover:text-primary">
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
