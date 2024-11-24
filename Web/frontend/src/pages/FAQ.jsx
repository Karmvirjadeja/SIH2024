import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Header from '../components/Header';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What services does your ship company offer?',
      answer:
        'We offer a variety of services including ship management, logistics, marine consultancy, shipbuilding, repairs, and chartering services.',
    },
    {
      question: 'How can I book a service?',
      answer:
        'You can book a service through our website by navigating to the specific service page and following the instructions provided. Alternatively, you can contact our support team directly for assistance.',
    },
    {
      question: 'What safety measures do you have in place?',
      answer:
        'Safety is our top priority. We adhere to international safety standards, conduct regular safety drills, and ensure all our vessels are equipped with the latest safety technology.',
    },
    {
      question: 'Do you offer customized solutions?',
      answer:
        'Yes, we provide tailored solutions to meet the specific needs of our clients. Please contact us to discuss your requirements.',
    },
    {
      question: 'How can I track my shipment?',
      answer:
        'You can track your shipment through our online tracking system. Simply enter your tracking number on the tracking page to get real-time updates.',
    },
  ];

  return (
    <>
    <Header/>
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-700 mb-6">
            Find answers to some of the most common questions about our services.
          </p>
        </div>
        <div className="flex flex-col items-center">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6 mb-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h2 className="text-xl font-medium text-gray-800">{faq.question}</h2>
                {openIndex === index ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-blue-600" />
                )}
              </div>
              {openIndex === index && (
                <p className="mt-4 text-gray-700">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default FAQ;
