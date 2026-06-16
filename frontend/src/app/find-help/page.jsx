import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Sparkles, UserCheck } from "lucide-react";

export default function FindHelpPage() {
  const steps = [
    {
      title: "1. Post Your Task",
      desc: "Describe what you need help with — gardening, house cleaning, tutoring, moving, or anything else. Set your proposed budget.",
    },
    {
      title: "2. Choose a Worker",
      desc: "Receive applications from verified local workers. View their bios, ratings, and profile checks, then select the perfect fit.",
    },
    {
      title: "3. Job Done",
      desc: "The worker completes the task to your satisfaction. Agree on payment directly with them and leave a review for the community.",
    },
  ];

  const benefits = [
    "Verified worker profiles with identity checks",
    "Affordable, community-rate pricing",
    "Support local people earning flexible income",
    "Browse ratings & reviews before you connect",
    "Last-minute availability for urgent household tasks",
  ];

  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-on-background) flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-5 md:px-12 py-12 md:py-20 w-full">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-(--color-on-secondary-container) bg-(--color-secondary-container) px-3.5 py-1.5 rounded-full">
            For Households &amp; Businesses
          </span>
          <h1 className="text-headline-xl md:text-5xl text-(--color-primary) mt-4 mb-6 leading-tight">
            Reliable, verified help for your everyday tasks
          </h1>
          <p className="text-body-lg text-(--color-on-surface-variant) leading-relaxed">
            Cross off your to-do list while supporting people in your local neighborhood. From yard cleanups to tutoring, get dependable help today.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mb-20">
          <h2 className="text-headline-lg text-center text-(--color-primary) mb-12">
            How HustleHub Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white border border-(--color-outline-variant)/30 p-8 rounded-(--radius-xl) shadow-level-1">
                <h3 className="text-headline-sm font-semibold text-(--color-primary) mb-4">
                  {step.title}
                </h3>
                <p className="text-body-sm text-(--color-on-surface-variant) leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text content */}
          <div>
            <h2 className="text-headline-lg text-(--color-primary) mb-6 leading-snug">
              Why use HustleHub to find help?
            </h2>
            <p className="text-body-md text-(--color-on-surface-variant) mb-8 leading-relaxed">
              Our platform matches you with enthusiastic, hard-working people from your local area who are eager to assist — at rates that work for both sides.
            </p>
            <ul className="flex flex-col gap-4">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-body-sm text-(--color-on-background)">
                  <CheckCircle2 className="w-5 h-5 text-(--color-secondary) shrink-0 mt-0.5" />
                  <span className="font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Graphical/Illustrative Panel */}
          <div className="bg-white/60 border border-(--color-outline-variant)/30 rounded-(--radius-xl) p-8 shadow-level-3 relative">
            <div className="absolute top-4 right-4 text-amber-400 animate-bounce">
              <Sparkles className="w-6 h-6 fill-amber-400" />
            </div>

            <h3 className="text-headline-sm font-bold mb-6 text-(--color-primary)">
              HustleHub Safety Guarantee
            </h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-(--color-primary) shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-body-md font-bold mb-1">Identity Check Passed</h4>
                  <p className="text-xs text-(--color-on-surface-variant) leading-normal">
                    We verify identity documents and cross-reference records before any worker can apply to listings.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-(--color-secondary) shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-body-md font-bold mb-1">Ratings & Reviews</h4>
                  <p className="text-xs text-(--color-on-surface-variant) leading-normal">
                    Every worker has a public rating from real clients. You always know who you&apos;re connecting with.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-(--color-secondary) to-emerald-800 text-white rounded-(--radius-xl) p-10 md:p-16 text-center shadow-level-3 relative overflow-hidden">
          <h2 className="text-headline-lg font-semibold mb-4 text-white">
            Need an extra hand?
          </h2>
          <p className="text-body-md text-emerald-100 max-w-xl mx-auto mb-8 leading-relaxed">
            Create an account, post your tasks, and connect with reliable local help in minutes.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-(--color-primary) text-(--color-on-primary) px-8 py-3.5 rounded-(--radius-md) font-bold hover:scale-105 transition-transform">
            Find Local Help
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
