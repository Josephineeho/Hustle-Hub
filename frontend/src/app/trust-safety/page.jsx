import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Lock, ShieldAlert, Users } from "lucide-react";

export default function TrustSafetyPage() {
  const pillars = [
    {
      title: "Identity & College Verification",
      desc: "Every worker on our platform is verified through official identity documentation and background checks to ensure you can connect with confidence.",
      icon: <Users className="w-6 h-6 text-(--color-primary)" />,
    },
    {
      title: "Secure Cashless Payments",
      desc: "HustleHub does not process payments. All compensation is agreed and settled directly between clients and workers. This keeps things transparent and flexible for both parties.",
      icon: <Lock className="w-6 h-6 text-emerald-700" />,
    },
    {
      title: "Real Reviews & Ratings",
      desc: "After every completed task, both the client and worker rate each other and write reviews. This public accountability keeps HustleHub respectful, professional, and high-quality.",
      icon: <CheckCircle2 className="w-6 h-6 text-indigo-700" />,
    },
    {
      title: "Dedicated Emergency Support",
      desc: "Our community support agents are ready to assist you. If there's any dispute, cancelation, or safety concern, we respond promptly to resolve issues fairly.",
      icon: <ShieldAlert className="w-6 h-6 text-red-700" />,
    },
  ];

  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-on-background) flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-5 md:px-12 py-12 md:py-20 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-headline-xl md:text-5xl text-(--color-primary) font-bold mb-4">
            Trust & Safety is Our Priority
          </h1>
          <p className="text-body-lg text-(--color-on-surface-variant) max-w-2xl mx-auto leading-relaxed">
            HustleHub is built on community trust, security, and safety. Here are the tools and safeguards we use to keep every transaction safe.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="flex flex-col gap-10 mb-16">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="bg-white border border-(--color-outline-variant)/30 p-8 rounded-(--radius-xl) flex flex-col sm:flex-row gap-6 items-start shadow-level-1">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-headline-sm font-semibold mb-2 text-(--color-on-background)">
                  {pillar.title}
                </h3>
                <p className="text-body-sm text-(--color-on-surface-variant) leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Guidelines Box */}
        <div className="bg-blue-50 border border-blue-200/50 rounded-(--radius-xl) p-8 text-left">
          <h2 className="text-headline-sm font-bold text-(--color-primary) mb-4">
            Safety Tips for Users
          </h2>
          <ul className="list-disc pl-5 space-y-3 text-body-sm text-(--color-on-surface-variant) leading-relaxed">
            <li>Keep communications and payments within the HustleHub platform.</li>
            <li>Double check reviews and profile checks before confirming job applications.</li>
            <li>For physical labor, outline work expectations, tools, and safety gear beforehand.</li>
            <li>If you ever feel unsafe or encounter suspicious behavior, report the user immediately.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
