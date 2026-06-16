import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    desc: "Sign up as someone needing help or a worker looking for flexible gig opportunities. Getting set up takes just a few minutes.",
    emoji: "✍️",
  },
  {
    number: "02",
    title: "Post a Task or Browse Gigs",
    desc: "Clients post their tasks with details and a proposed rate. Workers browse available listings that match their skills and schedule.",
    emoji: "📋",
  },
  {
    number: "03",
    title: "Connect & Agree",
    desc: "Workers apply to listings. Clients review profiles and ratings then choose the right person. Both parties agree on expectations upfront.",
    emoji: "🤝",
  },
  {
    number: "04",
    title: "Get the Job Done",
    desc: "The worker completes the task, and the two parties handle payment directly between themselves. Leave a review to help the community!",
    emoji: "✅",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-(--color-surface-container-low) border-t border-(--color-outline-variant)/20 py-20 px-5 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-(--color-secondary) bg-(--color-secondary-container) px-3.5 py-1.5 rounded-full">
            How It Works
          </span>
          <h2 className="text-headline-lg text-(--color-primary) mt-4 mb-4">
            Simple steps to get started
          </h2>
          <p className="text-body-md text-(--color-on-surface-variant) max-w-xl mx-auto leading-relaxed">
            Whether you need a helping hand or want to offer your skills — getting started on HustleHub is quick and easy.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%)] w-full h-px border-t-2 border-dashed border-(--color-outline-variant)/40 z-0 translate-x-[-50%]" />
              )}
              <div className="bg-white border border-(--color-outline-variant)/25 rounded-(--radius-xl) p-6 shadow-level-1 hover:shadow-level-3 transition-shadow h-full relative z-10">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl select-none">{step.emoji}</span>
                  <span className="text-xs font-bold text-(--color-primary) bg-blue-50 px-2 py-0.5 rounded-full tracking-wider">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="text-headline-sm font-semibold text-(--color-on-background) mb-2">
                  {step.title}
                </h3>
                <p className="text-body-sm text-(--color-on-surface-variant) leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/find-help"
            className="group flex items-center justify-between bg-gradient-to-r from-(--color-primary) to-blue-800 text-white rounded-(--radius-xl) p-8 shadow-level-3 hover:scale-[1.01] transition-transform"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">Need Help?</p>
              <h3 className="text-headline-sm font-bold mb-1">Find a Local Worker</h3>
              <p className="text-sm text-blue-100">Post your task and get connected fast.</p>
            </div>
            <ArrowRight className="w-6 h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/find-work"
            className="group flex items-center justify-between bg-gradient-to-r from-(--color-secondary) to-emerald-800 text-white rounded-(--radius-xl) p-8 shadow-level-3 hover:scale-[1.01] transition-transform"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-2">Want to Work?</p>
              <h3 className="text-headline-sm font-bold mb-1">Offer Your Skills</h3>
              <p className="text-sm text-emerald-100">Browse gigs nearby that fit your schedule.</p>
            </div>
            <ArrowRight className="w-6 h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
