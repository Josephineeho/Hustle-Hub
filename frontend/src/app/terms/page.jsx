import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-on-background) flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-20 w-full">
        <h1 className="text-headline-xl text-(--color-primary) mb-2">Terms of Service</h1>
        <p className="text-xs text-(--color-on-surface-variant) mb-8">Last updated: June 11, 2026</p>

        <div className="prose prose-blue flex flex-col gap-6 text-body-sm text-(--color-on-surface-variant) leading-relaxed">
          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using HustleHub, you agree to be bound by these Terms of Service and all terms incorporated by reference. If you do not agree, you may not access or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">2. Description of Service</h2>
            <p>
              HustleHub operates an online marketplace platform connecting clients needing assistance with task work to local workers seeking flexible gig opportunities. HustleHub is not an employer, does not process payments, and is not responsible for worker performance or task results.
            </p>
          </section>

          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">3. Verification & Safety</h2>
            <p>
              While we verify identities and enrollment credentials, users are encouraged to exercise caution and complete their own assessments before hiring or working. Users agree to abide by our safety guidelines at all times.
            </p>
          </section>

          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">4. Payments & Billing</h2>
            <p>
              Clients and workers agree on compensation directly between themselves. HustleHub does not process or hold any payments. Users are responsible for arranging their own payment methods and terms.
            </p>
          </section>

          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">5. User Conduct</h2>
            <p>
              All interactions on the platform must remain respectful, professional, and free from discrimination, harassment, or unsafe practices. We reserve the right to suspend or terminate accounts in violation of these rules.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
