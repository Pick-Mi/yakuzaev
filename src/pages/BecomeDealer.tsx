import { useState } from "react";
import Header from "@/components/Header";
import DealerHero from "@/components/DealerHero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, MapPin } from "lucide-react";
import dealerMeetingImage from "@/assets/dealer-meeting.jpg";

const BecomeDealer = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    experience: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send this to your database
      console.log("Dealer application:", formData);
      
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });

      // Reset form
      setFormData({
        businessName: "",
        contactPerson: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        experience: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section 
          className="relative w-full min-h-screen h-[829px] bg-black overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/placeholder.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute left-10 top-[520px] w-[601px] max-w-[90%] flex flex-col gap-6 items-start">
            <h1 className="font-sans font-normal text-[52px] leading-[73px] text-white m-0">
              Become a <span className="text-orange-300">Dealer</span>
            </h1>
            <p className="text-xl text-white/90 mb-4">
              Partner with India's fastest-growing EV brand and drive the future of electric mobility
            </p>
            
            <div className="flex gap-6 items-center flex-wrap">
              <button 
                onClick={() => {
                  const formSection = document.querySelector('form');
                  formSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex justify-center items-center gap-[10px] bg-white text-black hover:bg-gray-100 px-[35px] h-[50px] text-[14px] font-medium font-sans rounded-none transition-colors"
              >
                Apply Now
              </button>
              <a href="/products">
                <button className="bg-white/15 text-white hover:bg-white hover:text-black px-12 h-[50px] text-[14px] font-medium font-sans rounded-none transition-colors">
                  View Products
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-[70px] px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">High Profit Margins</h3>
                <p className="text-muted-foreground">
                  Competitive dealer pricing with attractive profit margins on all models
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Marketing Support</h3>
                <p className="text-muted-foreground">
                  Comprehensive marketing materials and promotional support
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Training & Support</h3>
                <p className="text-muted-foreground">
                  Complete training on products, sales, and after-sales service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Official Dealer Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-16">Official dealer today!</h2>
            
            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16 bg-white p-8 rounded-lg">
              {/* Left - Image */}
              <div className="relative">
                <img 
                  src={dealerMeetingImage} 
                  alt="Business meeting for dealer partnership" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Right - Content */}
              <div className="flex flex-col justify-center">
                <p className="text-muted-foreground mb-4">With YakuzaEV</p>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Be part of the electric revolution.
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Partner with us - apply to become an official dealer today. Become a Direct Dealer and drive the future of electric mobility.
                </p>
                <div>
                  <Button 
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-12 h-12 text-base font-medium rounded-none"
                  >
                    Request
                  </Button>
                </div>
              </div>
            </div>

            {/* Benefit Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Card 1 - Higher Margins */}
              <div className="bg-white p-8 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                </div>
                <h4 className="text-2xl font-bold mb-4">
                  Dealers enjoy higher margins with lower OEM commissions.
                </h4>
                <p className="text-muted-foreground">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>

              {/* Card 2 - Location */}
              <div className="bg-white p-8 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
                </div>
                <h4 className="text-2xl font-bold mb-4">
                  Get it today. Find your place to start a powerful partnership
                </h4>
                <p className="text-muted-foreground">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BecomeDealer;
