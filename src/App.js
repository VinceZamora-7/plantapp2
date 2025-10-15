import React, { useEffect, useState } from "react";
import { fetchSensorData } from "./utils/api";
import LatestSensorPanel from "./components/LatestSensorPanel";
import NPKPanel from "./components/NPKPanel";
import HistoryPanel from "./components/HistoryPanel";

// Compact Device Info panel with minimal padding and smaller font
function DeviceInfo({ device }) {
  if (!device) return null;
  const {
    deviceId = "N/A",
    firmwareVersion = "1.0.0",
    uptime = 0,
  } = device;

  const formatUptime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <section
      className="card device-info"
      aria-label="Device Information"
      style={{
        maxWidth: 900,
        margin: "24px auto",
        padding: "12px 16px",
        fontSize: "0.9rem",
        color: "#334155",
        backgroundColor: "#f9fafb",
      }}
    >
      <h2 style={{ marginBottom: 12, color: "#2563eb", fontSize: "1.2rem" }}>
        Device Information
      </h2>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 150px" }}>
          <strong>Device ID:</strong>
          <p>{deviceId}</p>
        </div>
        <div style={{ flex: "1 1 150px" }}>
          <strong>Firmware Version:</strong>
          <p>{firmwareVersion}</p>
        </div>
        <div style={{ flex: "1 1 150px" }}>
          <strong>Uptime:</strong>
          <p>{formatUptime(uptime)}</p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [data, setData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const sensorData = await fetchSensorData();
      if (Array.isArray(sensorData)) {
        setData(sensorData);
        setLatestData(sensorData.length > 0 ? sensorData[sensorData.length - 1] : null);
        setError(null);
      } else {
        setData([]);
        setLatestData(null);
      }
    } catch (err) {
      setError(err.message);
      setData([]);
      setLatestData(null);
    }
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(loadData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (error)
    return (
      <div style={{ color: "red", margin: "2rem auto", textAlign: "center", fontWeight: "bold" }}>
        Error: {error}
      </div>
    );
  if (!latestData)
    return (
      <div style={{ margin: "2rem auto", textAlign: "center", fontWeight: "bold" }}>
        Loading latest sensor data...
      </div>
    );

  return (
    <>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "1rem 0",
          textAlign: "center",
          fontWeight: "700",
          fontSize: "1.5rem",
          boxShadow: "0 2px 8px rgb(37 99 235 / 0.6)",
          top: 0,
          zIndex: 100,
        }}
      >
        Sensor Dashboard
      </header>

      {/* Modern Navigation */}
      <nav
        style={{
          maxWidth: 900,
          margin: "1rem auto",
          display: "flex",
          justifyContent: "center",
          gap: 24,
          padding: "0.5rem 1rem",
          backgroundColor: "#f3f4f6",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgb(0 0 0 / 0.1)",
          fontWeight: "600",
          fontSize: "1rem",
          userSelect: "none",
        }}
        aria-label="Primary navigation"
      >
        {[
          { label: "Device Info", href: "#device-info" },
          { label: "Latest Sensor", href: "#latest-sensor" },
          { label: "NPK Panel", href: "#npk-panel" },
          { label: "History", href: "#history-panel" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              color: "#2563eb",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 6,
              transition: "background-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.backgroundColor = "#dbeafe")}
            onBlur={(e) => (e.target.style.backgroundColor = "transparent")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#dbeafe")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Main Content */}
      <main
        style={{
          maxWidth: 900,
          margin: "auto",
          padding: 24,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#2c3e50",
          scrollBehavior: "smooth",
        }}
      >


        <section id="latest-sensor" style={{ marginTop: 24 }}>
          <LatestSensorPanel data={latestData} />
        </section>

        <section id="npk-panel" style={{ marginTop: 24 }}>
          <NPKPanel data={latestData} />
        </section>

        <section id="history-panel" style={{ marginTop: 24 }}>
          <HistoryPanel
            data={data}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterStartDate={filterStartDate}
            setFilterStartDate={setFilterStartDate}
            filterEndDate={filterEndDate}
            setFilterEndDate={setFilterEndDate}
            sortAsc={sortAsc}
            setSortAsc={setSortAsc}
          />
        </section>
        <section id="device-info">
          <DeviceInfo device={latestData} />
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: 48,
          padding: "1rem 0",
          textAlign: "center",
          backgroundColor: "#f3f4f6",
          color: "#475569",
          fontSize: "0.9rem",
          fontWeight: "500",
          boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.3)",
          userSelect: "none",
        }}
      >
        &copy; {new Date().getFullYear()} Sensor Dashboard. All rights reserved.
      </footer>
    </>
  );
}
