"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, Phone } from "lucide-react";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const faqs = [
    {
      q: "How do I pay for my completed job?",
      a: "All payments are handled through our secure online payment system in the HustleHub platform. Once the student completes the job, you can authorize payment from your account dashboard.",
    },
    {
      q: "Can I edit or cancel my job posting?",
      a: "Yes, you can edit or cancel your job posting at any time before a student worker starts. If a student is already assigned, please contact them or support to coordinate cancelations.",
    },
    {
      q: "How does the identity verification work?",
      a: "Students verify their enrollment through university email/document matches and cross-reference their phone numbers and official government IDs to verify background records.",
    },
  ];

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Email is invalid";
    }
    if (!subject.trim()) errs.subject = "Subject is required";
    if (!message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSuccess("");

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess("Your support inquiry has been sent! We will respond within 24 hours.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-on-background) flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-5 md:px-12 py-12 md:py-20 w-full">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-headline-xl md:text-5xl text-(--color-primary) font-bold mb-4">
            How Can We Help You?
          </h1>
          <p className="text-body-lg text-(--color-on-surface-variant) max-w-xl mx-auto leading-relaxed">
            Get in touch with the HustleHub support team or find answers to frequently asked questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Support Form */}
          <div className="bg-white border border-(--color-outline-variant)/30 p-8 rounded-(--radius-xl) shadow-level-3">
            <h2 className="text-headline-sm font-semibold mb-6 text-(--color-primary)">
              Send Us a Message
            </h2>

            {success && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-(--radius-md) text-body-sm font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-(--color-outline-variant)/40 rounded-(--radius-md) px-4 py-2.5 text-body-sm outline-none focus:border-(--color-primary) transition-all"
                    placeholder="Jane Doe"
                  />
                  {errors.name && <span className="text-xs text-(--color-error)">{errors.name}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-(--color-outline-variant)/40 rounded-(--radius-md) px-4 py-2.5 text-body-sm outline-none focus:border-(--color-primary) transition-all"
                    placeholder="jane@example.com"
                  />
                  {errors.email && <span className="text-xs text-(--color-error)">{errors.email}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-(--color-outline-variant)/40 rounded-(--radius-md) px-4 py-2.5 text-body-sm outline-none focus:border-(--color-primary) transition-all"
                  placeholder="Billing Inquiry, safety concern, etc."
                />
                {errors.subject && <span className="text-xs text-(--color-error)">{errors.subject}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-white border border-(--color-outline-variant)/40 rounded-(--radius-md) px-4 py-2.5 text-body-sm outline-none focus:border-(--color-primary) transition-all resize-none"
                  placeholder="Describe your issue in detail..."
                />
                {errors.message && <span className="text-xs text-(--color-error)">{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-(--color-primary) text-(--color-on-primary) py-3 rounded-(--radius-md) font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Submit Inquiry"
                )}
              </button>
            </form>
          </div>

          {/* FAQs & Contact Details */}
          <div>
            <h2 className="text-headline-sm font-semibold mb-6 text-(--color-primary)">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-6 mb-12">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-(--color-outline-variant)/20 pb-4">
                  <h4 className="font-bold text-body-md mb-2">{faq.q}</h4>
                  <p className="text-body-sm text-(--color-on-surface-variant) leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-headline-sm font-semibold mb-4 text-(--color-primary)">
              Alternative Contact Info
            </h2>
            <div className="flex flex-col gap-4 text-body-sm text-(--color-on-surface-variant)">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-(--color-primary)" />
                <span>support@hustlehub.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-(--color-primary)" />
                <span>1-800-HUSTLE-HUB</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-(--color-primary)" />
                <span>Live Chat (9 AM - 6 PM EST)</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
