import { TrendingUp, Users, Briefcase, DollarSign } from "lucide-react";

const stats = [
  {
    label: "Verified Workers",
    value: "10,000+",
    icon: <Users className="w-5 h-5" strokeWidth={2} />,
    color: "text-(--color-primary)",
    bg: "bg-blue-50",
  },
  {
    label: "Tasks Completed",
    value: "45,000+",
    icon: <Briefcase className="w-5 h-5" strokeWidth={2} />,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    label: "Avg. Hourly Rate",
    value: "FCFA 2,500",
    icon: <DollarSign className="w-5 h-5" strokeWidth={2} />,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  {
    label: "5-Star Reviews",
    value: "98%",
    icon: <TrendingUp className="w-5 h-5" strokeWidth={2} />,
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
];

export default function SocialProof() {
  return (
    <section className="border-y border-(--color-outline-variant)/20 bg-(--color-surface-container-low) py-10 px-5">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center gap-2"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-1`}>
              {stat.icon}
            </div>
            <div className={`text-2xl font-bold tracking-tight ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-(--color-on-surface-variant) uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
