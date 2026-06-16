import { useState } from "react";

const categories = ["Cleaning", "Moving", "Delivery", "Assembly", "Tech Support", "Other"];

export default function PostJob() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    desc: "",
    location: "",
    budget: "",
    date: ""
  });

  const set = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Step validation
  const nextStep1 = () => {
    if (form.title && form.category && form.desc) {
      setStep(2);
    } else {
      alert("Please fill title, category, and description");
    }
  };

  const nextStep2 = () => {
    if (form.location && form.budget && form.date) {
      setStep(3);
    } else {
      alert("Please complete location, budget, and date");
    }
  };

  // Submit job
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        ...form,
        budget: Number(form.budget)
      };

      // Replace this URL with your backend
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Job Posted Successfully 🎉");

        // reset form
        setForm({
          title: "",
          category: "",
          desc: "",
          location: "",
          budget: "",
          date: ""
        });

        setStep(1);
      } else {
        alert("Failed to post job");
      }
    } catch (error) {
      console.error(error);
      alert("Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={styles.iconBox}>🧰</span>
            <span style={styles.title}>Post a Job</span>
          </div>

          <p style={styles.subtitle}>Tell us what you need help with</p>

          {/* STEP BAR */}
          <div style={styles.stepBar}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                onClick={() => s < step && setStep(s)}
                style={{
                  ...styles.step,
                  background: s <= step ? "#22c55e" : "#1e4070",
                  cursor: s < step ? "pointer" : "default"
                }}
              />
            ))}
          </div>
        </div>

        {/* BODY */}
        <div style={styles.body}>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <label style={styles.label}>Job Title</label>
              <input
                style={styles.input}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />

              <label style={styles.label}>Category</label>
              <div style={styles.categoryWrap}>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("category", c)}
                    style={{
                      ...styles.category,
                      background: form.category === c ? "#0f2d52" : "#fff",
                      color: form.category === c ? "#fff" : "#374151"
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, height: 90 }}
                value={form.desc}
                onChange={(e) => set("desc", e.target.value)}
              />

              <button style={styles.button} onClick={nextStep1}>
                Continue →
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <label style={styles.label}>Location</label>
              <input
                style={styles.input}
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />

              <label style={styles.label}>Budget</label>
              <input
                type="number"
                style={styles.input}
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
              />

              <label style={styles.label}>Date</label>
              <input
                type="date"
                style={styles.input}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={{ ...styles.button, background: "#f3f4f6", color: "#000" }}
                  onClick={() => setStep(1)}
                >
                  Back
                </button>

                <button style={styles.button} onClick={nextStep2}>
                  Continue →
                </button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div style={styles.summary}>
                <h3>{form.title}</h3>
                <p><b>Category:</b> {form.category}</p>
                <p>{form.desc || "No description"}</p>
                <p>📍 {form.location}</p>
                <p>💵 FCFA {form.budget || "0"}</p>
                <p>📅 {form.date}</p>
              </div>

              <button
                style={{ ...styles.button, background: "#22c55e" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Job"}
              </button>

              <button
                style={{ ...styles.button, background: "#f3f4f6", color: "#000" }}
                onClick={() => setStep(2)}
              >
                Back
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f4f8",
    fontFamily: "Georgia, serif",
    padding: 20
  },
  card: {
    width: "100%",
    maxWidth: 450,
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)"
  },
  header: {
    background: "#0f2d52",
    padding: 20,
    color: "#fff"
  },
  iconBox: {
    background: "#22c55e",
    padding: 6,
    borderRadius: 6
  },
  title: {
    fontWeight: "bold",
    fontSize: 18
  },
  subtitle: {
    fontSize: 12,
    color: "#93c5fd"
  },
  stepBar: {
    display: "flex",
    gap: 6,
    marginTop: 10
  },
  step: {
    flex: 1,
    height: 4,
    borderRadius: 5
  },
  body: {
    padding: 20
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 12,
    display: "block"
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14
  },
  button: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    border: "none",
    borderRadius: 8,
    background: "#0f2d52",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  },
  categoryWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6
  },
  category: {
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid #ccc",
    cursor: "pointer"
  },
  summary: {
    background: "#f8fafc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  }
};