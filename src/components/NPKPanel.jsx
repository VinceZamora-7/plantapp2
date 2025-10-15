import React from "react";

const nutrientColors = {
    Nitrogen: "#27ae60",  // green
    Phosphorus: "#f39c12", // orange
    Potassium: "#c0392b",  // red
};

// Helper to normalize nutrient levels (example max values, adjust per your scale)
const normalizeValue = (value, max = 100) =>
    `${Math.min((value / max) * 100, 100)}%`;

// Optional: qualitative interpretation based on nutrient ranges
const nutrientLevel = (name, val) => {
    if (val < 15) return "Low";
    if (val < 30) return "Medium";
    return "High";
};

export default function NPKPanel({ data }) {
    if (!data) return null;

    return (
        <section
            className="card npk-panel"
            aria-label="NPK Values Panel"
            style={{
                maxWidth: 400,
                margin: "auto",
                padding: 20,
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
                fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
            }}
        >
            <h2 style={{ marginBottom: 24, color: "#2c3e50" }}>
                Nitrogen - Phosphorus - Potassium (NPK)
            </h2>

            {["Nitrogen", "Phosphorus", "Potassium"].map((nutrient) => {
                const val = data[nutrient.toLowerCase()] ?? 0;
                const color = nutrientColors[nutrient];
                return (
                    <div key={nutrient} style={{ marginBottom: 18 }}>
                        <label
                            htmlFor={nutrient}
                            style={{ fontWeight: "700", marginBottom: 6, display: "block", color: "#34495e" }}
                        >
                            {nutrient} ({nutrient[0]}):
                            <span style={{ float: "right", fontWeight: "600" }}>{val}</span>
                        </label>
                        <div
                            id={nutrient}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={val}
                            role="progressbar"
                            style={{
                                height: 16,
                                backgroundColor: "#ecf0f1",
                                borderRadius: 10,
                                overflow: "hidden",
                                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div
                                style={{
                                    width: normalizeValue(val),
                                    height: "100%",
                                    backgroundColor: color,
                                    borderRadius: 10,
                                    transition: "width 0.8s ease",
                                    boxShadow: `0 0 10px ${color}`,
                                }}
                                aria-label={`${nutrient} level is ${nutrientLevel(nutrient, val)}`}
                            />
                        </div>
                        <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>
                            {nutrient} level: {nutrientLevel(nutrient, val)}
                        </small>
                    </div>
                );
            })}
        </section>
    );
}
