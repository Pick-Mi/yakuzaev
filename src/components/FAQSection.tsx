import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

const defaultFaqs = [
  {
    question: "Why is New a better choice for customers looking for a family scooter?",
    answer: "From the ground up, Other Yakuza New is made for your family. It has all the space, safety and smarts your loved ones need on their everyday rides.",
  },
  {
    question: "What are the key safety features of this scooter?",
    answer: "Our scooters come equipped with advanced braking systems, LED lighting for better visibility, and robust build quality to ensure maximum safety for you and your family.",
  },
  {
    question: "What is the warranty coverage?",
    answer: "We offer comprehensive warranty coverage including motor, battery, and parts. Contact our support team for detailed warranty information.",
  },
  {
    question: "What payment options are available?",
    answer: "We accept multiple payment methods including credit/debit cards, UPI, and EMI options to make your purchase convenient and affordable.",
  },
  {
    question: "How can I book a test ride?",
    answer: "You can book a test ride by clicking the 'Book Now' button on any product page or by contacting your nearest showroom directly.",
  },
];

export const FAQSection = ({ faqs = defaultFaqs }: FAQSectionProps) => {
  console.log('FAQSection received faqs:', faqs);
  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  console.log('FAQSection displaying faqs:', displayFaqs);
  return (
    <section className="py-16 px-4 bg-[#f8f9f9]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Title */}
          <div>
            <h2 className="font-['Poppins'] font-semibold text-[48px] leading-tight">
              Your questions,
              <br />
              answered
            </h2>
          </div>

          {/* FAQ Accordion */}
          <div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {displayFaqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-[#e0e0e0]"
                >
                  <AccordionTrigger className="font-['Inter'] font-normal text-[18px] text-left py-6 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-['Inter'] font-normal text-[16px] text-[#666666] pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};
