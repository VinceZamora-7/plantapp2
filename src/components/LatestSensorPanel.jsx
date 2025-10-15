import React, { useEffect, useState } from "react";
import { getHealthStatus } from "../utils/healthStatus";

const pulseAnimation = `
  @keyframes pulseGlow {
    0% {
      box-shadow: 0 0 8px rgba(52, 152, 219, 0.6);
    }
    50% {
      box-shadow: 0 0 20px rgba(52, 152, 219, 1);
    }
    100% {
      box-shadow: 0 0 8px rgba(52, 152, 219, 0.6);
    }
  }
`;

export default function LatestSensorPanel({ data }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!data) return null;

    const ztotalMax = 4;
    const ztotalPercent = Math.min((data.ztotal / ztotalMax) * 100, 100);
    const normalizeRGB = (value) => `${(value / 255) * 100}%`;

    return (
        <>
            <style>{pulseAnimation}</style>
            <section
                className="card sensor-panel"
                aria-label="Latest Sensor Data Panel"
                style={{
                    maxWidth: 400,
                    margin: "auto",
                    padding: 20,
                    borderRadius: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    background: "#fff",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.7s ease, transform 0.7s ease",
                    textAlign: "center",
                    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
                }}
            >
                <h2 style={{ marginBottom: 32, color: "#2980b9" }}>
                    ZTotal Value (Main Indicator)
                </h2>

                {/* ZTotal Large Bar */}
                <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={ztotalMax}
                    aria-valuenow={data.ztotal}
                    style={{
                        position: "relative",
                        backgroundColor: "#e0e7ff",
                        borderRadius: 20,
                        height: 50,
                        marginBottom: 24,
                        overflow: "hidden",
                        animation: "pulseGlow 3s infinite",
                    }}
                >
                    <div
                        style={{
                            width: `${ztotalPercent}%`,
                            height: "100%",
                            backgroundColor: "#3b82f6",
                            borderRadius: 20,
                            transition: "width 1s ease-in-out",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "900",
                            fontSize: "2.5rem",
                            color: "#fff",
                            textShadow: "0 0 8px rgba(0,0,0,0.5)",
                            userSelect: "none",
                        }}
                    >
                        {typeof data.ztotal === "number"
                            ? data.ztotal.toFixed(2)
                            : "N/A"}
                    </div>
                </div>

                <p
                    style={{
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        marginBottom: 40,
                        color: "#2563eb",
                    }}
                    aria-live="polite"
                >
                    Health Status: {getHealthStatus(data.ztotal)}
                </p>

                <h3 style={{ marginBottom: 16, color: "#1e293b" }}>
                    RGB Color Values
                </h3>

                {/* RGB Bars */}
                <div style={{ maxWidth: 320, margin: "auto" }}>
                    {["Red", "Green", "Blue"].map((color, idx) => {
                        const val = idx === 0 ? data.red : idx === 1 ? data.green : data.blue;
                        return (
                            <div key={color} style={{ marginBottom: 14 }}>
                                <label
                                    htmlFor={color}
                                    style={{
                                        fontWeight: "700",
                                        display: "block",
                                        marginBottom: 6,
                                        color: "#334155",
                                    }}
                                >
                                    {color}
                                </label>
                                <div
                                    id={color}
                                    aria-valuenow={val}
                                    aria-valuemin={0}
                                    aria-valuemax={255}
                                    role="progressbar"
                                    style={{
                                        height: 18,
                                        width: "100%",
                                        backgroundColor: "#e2e8f0",
                                        borderRadius: 12,
                                        overflow: "hidden",
                                        boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.1)",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: normalizeRGB(val),
                                            height: "100%",
                                            backgroundColor: color.toLowerCase(),
                                            borderRadius: 12,
                                            transition: "width 1s ease-in-out",
                                        }}
                                        aria-label={`${color} intensity: ${val} out of 255`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
