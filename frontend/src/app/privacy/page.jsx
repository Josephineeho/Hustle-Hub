import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-on-background) flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-20 w-full">
        <h1 className="text-headline-xl text-(--color-primary) mb-2">Privacy Policy</h1>
        <p className="text-xs text-(--color-on-surface-variant) mb-8">Last updated: June 11, 2026</p>

        <div className="prose prose-blue flex flex-col gap-6 text-body-sm text-(--color-on-surface-variant) leading-relaxed">
          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when creating accounts, posting listings, communicating with other users, or requesting customer support. This includes names, emails, university affiliations, and billing info.
            </p>
          </section>

          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">2. How We Use Information</h2>
            <p>
              We use collected information to run, maintain, and improve the marketplace; match workers with households; verify student credentials; handle payment processing; and communicate safety warnings or marketing materials.
            </p>
          </section>

          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">3. Sharing of Information</h2>
            <p>
              We do not sell your personal data. We share details between matching parties (e.g. sharing your name and job details with the worker you hired) to coordinate work. We may share data with processing vendors (like payment processors) or legal authorities if required by law.
            </p>
          </section>

          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">4. Security</h2>
            <p>
              We implement industry-standard cryptographic techniques and access controls to secure information against unauthorized access, theft, loss, or manipulation.
            </p>
          </section>

          <section>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background) mb-3">5. Your Rights</h2>
            <p>
              You can access, modify, or request the deletion of your personal account data by logging into your profile or contacting support at any time.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
