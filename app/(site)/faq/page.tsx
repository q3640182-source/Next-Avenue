import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Next Avenue",
  description: "Find answers to common questions about buying and selling property in Pakistan with Next Avenue.",
};

const faqs = [
  {
    question: "What areas does Next Avenue cover?",
    answer: "Next Avenue primarily covers Islamabad and Rawalpindi, with a specific focus on premium sectors like F-7, F-8, D-12, and Bahria Town. We are continually expanding our coverage to include other major metropolitan areas in Pakistan.",
  },
  {
    question: "How do I list my property for sale?",
    answer: "You can list your property by filling out the 'Sell Your Property' form on our website. Once submitted, our team will review the details, verify the information, and contact you to arrange high-quality photography and marketing before publishing it.",
  },
  {
    question: "Are there any upfront fees for listing my property?",
    answer: "No, there are no upfront listing fees to put your property on Next Avenue. We operate on a success-fee model, meaning we only charge a standard agency commission when your property is successfully sold.",
  },
  {
    question: "How is the value of my property determined?",
    answer: "The value of your property is determined through a Comparative Market Analysis (CMA) conducted by our experts. We evaluate recent sales of similar properties in your sector, current market demand, and the specific condition of your home to recommend a competitive asking price.",
  },
  {
    question: "Does Next Avenue handle the legal documentation?",
    answer: "Yes, our team assists you with the entire legal documentation process. We ensure that your chain of ownership (Fard, Allotment Letter, NDC) is verified and guide both the buyer and seller through a secure, compliant transfer process.",
  },
  {
    question: "How long does it typically take to sell a house?",
    answer: "It typically takes between 30 to 90 days to sell a house in the current market, provided it is priced correctly. High-demand areas like D-12 or F-7 often see faster turnarounds, whereas overpriced properties can stagnate.",
  },
  {
    question: "Do you offer property management services for rentals?",
    answer: "Next Avenue currently focuses exclusively on buying and selling property. However, we plan to launch a dedicated 'Rent Your Property' division in the near future to handle leasing and property management.",
  },
  {
    question: "Is Capital Gains Tax (CGT) applicable on all property sales?",
    answer: "Yes, Capital Gains Tax (CGT) is applicable on the profit made from selling real estate in Pakistan, but the rate varies. The exact percentage depends on your filer status and how long you have held the property, dropping to 0% after a specified holding period (e.g., 6 years for open plots).",
  },
  {
    question: "Can overseas Pakistanis buy or sell property through Next Avenue?",
    answer: "Yes, overseas Pakistanis can easily buy and sell property through Next Avenue. We facilitate remote transactions, provide virtual property tours, and handle all local groundwork, requiring you to only issue a specific Power of Attorney for the final transfer.",
  },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-12 md:py-24 max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Clear, factual answers to help you navigate the real estate market.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
