import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How do I list a textbook on BookLoop?',
    answer:
      'Log into your student account and click "Sell a Book" in the top navigation or "Add New Book" in your Student Dashboard. Enter the textbook title, author, edition, academic faculty, physical condition, and specify whether you want to sell it for cash (INR), exchange it for another textbook, or accept both options.'
  },
  {
    question: 'How do textbook exchanges work without money?',
    answer:
      'When listing a book, select the "Exchange" or "Both" option and list the textbooks or topics you are seeking in return (e.g., "Seeking Silberschatz Operating Systems"). Another student can browse your listing, click "Propose Book Exchange", specify what they have to offer, and agree on a campus meeting spot to swap books directly.'
  },
  {
    question: 'Are there any platform fees or commissions on sales?',
    answer:
      'None! BookLoop is 100% free for college students. You keep 100% of the cash price agreed upon with your campus peer. Transactions happen peer-to-peer via direct UPI or cash handover on campus.'
  },
  {
    question: 'Where should we meet to inspect and hand over books?',
    answer:
      'We strongly recommend meeting in safe, public, high-footfall campus locations during daylight hours—such as the university library entrance, student center, department cafeteria, or campus quadrangle. Always inspect the book condition, binding, and pages before making any payment or handing over your exchange textbook.'
  },
  {
    question: 'What if a book condition does not match what was posted?',
    answer:
      'Because exchanges happen in person, you have the full right to examine the book before accepting. If the condition is materially worse than described (e.g. heavy water stains or missing pages), you can politely decline the transaction or renegotiate the price on the spot. You can also report misleading listings using the "Report" button on the book page.'
  },
  {
    question: 'How do I manage, edit, or remove my active listings?',
    answer:
      'Head to your Student Dashboard and click on the "My Listings" tab. You will see all textbooks you have posted with buttons to view, monitor incoming proposals, and delete listings once sold or swapped.'
  },
  {
    question: 'How do I know if the seller is a real college student?',
    answer:
      'Every listing highlights the seller\'s college or university affiliation and department. In addition, when an exchange proposal is initiated, both students can verify contact details and arrange an on-campus meeting.'
  }
];

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Student Knowledgebase</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to know about buying, selling, and swapping books on BookLoop
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-teal-700 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
