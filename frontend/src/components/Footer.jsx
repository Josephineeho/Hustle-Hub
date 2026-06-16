import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

const links = {
  Platform: [
    { label: "Find Help", href: "/find-help" },
    { label: "Find Work", href: "/find-work" },
    { label: "Sign Up", href: "/signup" },
    { label: "Log In", href: "/login" },
  ],
  Company: [
    { label: "Trust & Safety", href: "/trust-safety" },
    { label: "Support", href: "/support" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-(--color-inverse-surface) text-(--color-inverse-on-surface) py-16 px-5 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="text-2xl font-bold font-[family-name:--font-headline] text-white hover:opacity-90 transition-opacity">
              HustleHub
            </Link>
            <p className="text-sm text-(--color-inverse-on-surface)/70 mt-3 mb-6 leading-relaxed max-w-xs">
              Connecting people who need help with trusted local workers. Safe, affordable, and community-driven.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-(--color-primary) text-white text-sm font-semibold px-5 py-2.5 rounded-(--radius-md) hover:opacity-90 hover:scale-[1.02] transition-all"
            >
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-(--color-inverse-on-surface)/50 mb-5">
                {category}
              </h3>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-(--color-inverse-on-surface)/80 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-(--color-inverse-on-surface)/50">
          <div className="flex items-center gap-1.5">
            <BadgeCheck className="w-3.5 h-3.5 text-(--color-secondary-fixed-dim)" strokeWidth={2} />
            <span>10,000+ verified local workers</span>
          </div>
          <span>© {new Date().getFullYear()} HustleHub Marketplace. Empowering local communities.</span>
        </div>
      </div>
    </footer>
  );
}
