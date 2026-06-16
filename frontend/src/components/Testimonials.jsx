import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aline T.",
    role: "Homeowner, Douala",
    avatar: "👩🏽",
    rating: 5,
    text: "I found a fantastic student to help me set up my home office. He was punctual, professional, and affordable. I've booked him twice more since then!",
  },
  {
    name: "Boris N.",
    role: "Student, Univ of Buea",
    avatar: "🧑🏼‍🎓",
    rating: 5,
    text: "HustleHub has been a game-changer for my finances. I earn FCFA 15,000–30,000 extra per week doing yard work and moving help around my class schedule.",
  },
  {
    name: "Mireille E.",
    role: "Parent of 3, Yaoundé",
    avatar: "👩🏻",
    rating: 5,
    text: "I love that every worker is a verified student. It feels so much safer than random apps. Our house helper Emma has become like part of the family.",
  },
  {
    name: "Jean-Paul M.",
    role: "Student, Univ of Dschang",
    avatar: "🧑🏾‍💼",
    rating: 5,
    text: "The freedom to set my own rates and choose which jobs I take is unmatched. I've made more here than any part-time retail job I've ever had.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-5 md:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full">
            Real Reviews
          </span>
          <h2 className="text-headline-lg text-(--color-primary) mt-4 mb-4">
            Loved by households & students
          </h2>
          <p className="text-body-md text-(--color-on-surface-variant) max-w-xl mx-auto leading-relaxed">
            Don&apos;t take our word for it — here&apos;s what our community says about using HustleHub.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-(--color-outline-variant)/25 rounded-(--radius-xl) p-7 shadow-level-1 hover:shadow-level-3 transition-all hover:-translate-y-1 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-(--color-surface-dim)">
                <Quote className="w-8 h-8 fill-(--color-surface-dim)" strokeWidth={0} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={0} />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-body-sm text-(--color-on-background) leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-4 border-t border-(--color-outline-variant)/20">
                <div className="w-10 h-10 rounded-full bg-(--color-surface-container) flex items-center justify-center text-xl select-none">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-body-sm font-bold text-(--color-on-background)">{t.name}</div>
                  <div className="text-xs text-(--color-on-surface-variant)">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
