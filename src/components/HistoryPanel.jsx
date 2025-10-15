import React, { useState, useMemo, useEffect } from "react";
import Filters from "./Filters";
import { getHealthStatus } from "../utils/healthStatus";

const PAGE_SIZE = 10;

const dateRanges = {
    All: null,
    Today: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return [today, new Date()];
    },
    "Last Week": () => {
        const today = new Date();
        const lastWeekStart = new Date();
        lastWeekStart.setDate(today.getDate() - 7);
        lastWeekStart.setHours(0, 0, 0, 0);
        return [lastWeekStart, today];
    },
    "Whole Month": () => {
        const today = new Date();
        const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return [startMonth, today];
    },
};

export default function HistoryPanel({
    data,
    filterStatus,
    setFilterStatus,
    filterStartDate,
    setFilterStartDate,
    filterEndDate,
    setFilterEndDate,
    sortAsc,
    setSortAsc,
}) {
    const [selectedRange, setSelectedRange] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    // Initialize default sorting to descending (newest first)
    useEffect(() => {
        setSortAsc(false);
    }, [setSortAsc]);

    // Resolve date range boundaries for filtering
    const rangeDates = useMemo(() => {
        if (selectedRange === "All") return [null, null];
        return dateRanges[selectedRange]();
    }, [selectedRange]);

    // Apply combined filters and sorting
    const filtered = useMemo(() => {
        return data
            .filter((entry) => {
                if (filterStatus !== "All" && getHealthStatus(entry.ztotal) !== filterStatus)
                    return false;

                const entryDate = new Date(entry.timestamp);

                if (rangeDates[0] && entryDate < rangeDates[0]) return false;
                if (rangeDates[1] && entryDate > rangeDates[1]) return false;

                if (filterStartDate && entryDate < new Date(filterStartDate)) return false;
                if (filterEndDate && entryDate > new Date(filterEndDate)) return false;

                return true;
            })
            .sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                return sortAsc ? dateA - dateB : dateB - dateA;
            });
    }, [data, filterStatus, filterStartDate, filterEndDate, sortAsc, rangeDates]);

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginatedData = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // Handles page change with scroll reset
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Reset current page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, filterStartDate, filterEndDate, sortAsc, selectedRange]);

    return (
        <section
            className="card history-panel"
            aria-label="Data History Panel"
            style={{
                maxWidth: 900,
                margin: "auto",
                padding: 16,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#2c3e50",
            }}
        >
            <h2 style={{ marginBottom: 16 }}>Data History (Advanced Filtering & Pagination)</h2>

            {/* Date Range Buttons */}
            <div style={{ marginBottom: 16 }}>
                {Object.keys(dateRanges).map((range) => (
                    <button
                        key={range}
                        onClick={() => setSelectedRange(range)}
                        style={{
                            marginRight: 10,
                            fontWeight: range === selectedRange ? "700" : "400",
                            backgroundColor: range === selectedRange ? "#3498db" : "#e5e7eb",
                            color: range === selectedRange ? "white" : "#374151",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: 6,
                            cursor: "pointer",
                            boxShadow:
                                range === selectedRange
                                    ? "0 2px 6px rgba(52,152,219,0.4)"
                                    : "none",
                            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                        }}
                        aria-pressed={range === selectedRange}
                    >
                        {range}
                    </button>
                ))}
            </div>

            {/* Filters Component */}
            <Filters
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterStartDate={filterStartDate}
                setFilterStartDate={setFilterStartDate}
                filterEndDate={filterEndDate}
                setFilterEndDate={setFilterEndDate}
                sortAsc={sortAsc}
                setSortAsc={setSortAsc}
            />

            {/* Table Wrapper with horizontal scroll */}
            <div
                className="history-table-wrapper"
                tabIndex={0}
                aria-describedby="history-desc"
                style={{ overflowX: "auto", marginTop: 20 }}
            >
                <table
                    className="history-table"
                    aria-label="Filtered sensor data history"
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.9rem",
                    }}
                >
                    <caption id="history-desc" style={{ padding: 8, textAlign: "left" }}>
                        Table showing sensor data entries with applied filters and pagination.
                    </caption>
                    <thead>
                        <tr style={{ backgroundColor: "#f3f4f6" }}>
                            {[
                                "Timestamp",
                                "Device ID",
                                "N",
                                "P",
                                "K",
                                "ZTotal",
                                "Health Status",
                                "RGB",
                            ].map((th) => (
                                <th
                                    key={th}
                                    style={{
                                        padding: "10px 12px",
                                        borderBottom: "2px solid #d1d5db",
                                        textAlign: "left",
                                        fontWeight: "600",
                                        color: "#374151",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {th}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    style={{ textAlign: "center", padding: 20, color: "#6b7280" }}
                                >
                                    No data matching filters.
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((entry, idx) => (
                                <tr
                                    key={idx}
                                    style={{
                                        borderBottom: "1px solid #e5e7eb",
                                        backgroundColor: idx % 2 === 0 ? "#fafafa" : "white",
                                        transition: "background-color 0.3s",
                                    }}
                                >
                                    <td style={{ padding: "10px 12px" }}>{entry.timestamp}</td>
                                    <td style={{ padding: "10px 12px" }}>{entry.deviceId}</td>
                                    <td style={{ padding: "10px 12px" }}>{entry.nitrogen}</td>
                                    <td style={{ padding: "10px 12px" }}>{entry.phosphorus}</td>
                                    <td style={{ padding: "10px 12px" }}>{entry.potassium}</td>
                                    <td style={{ padding: "10px 12px" }}>
                                        {typeof entry.ztotal === "number"
                                            ? entry.ztotal.toFixed(2)
                                            : "N/A"}
                                    </td>
                                    <td style={{ padding: "10px 12px" }}>
                                        {getHealthStatus(entry.ztotal)}
                                    </td>
                                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                                        ({entry.red}, {entry.green}, {entry.blue})
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <nav
                    aria-label="Pagination navigation"
                    style={{
                        marginTop: 24,
                        display: "flex",
                        justifyContent: "center",
                        gap: 12,
                    }}
                >
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-disabled={currentPage === 1}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: currentPage === 1 ? "#9ca3af" : "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        Previous
                    </button>
                    <span
                        aria-live="polite"
                        style={{ alignSelf: "center", color: "#4b5563", fontWeight: "600" }}
                    >
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-disabled={currentPage === totalPages}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: currentPage === totalPages ? "#9ca3af" : "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        Next
                    </button>
                </nav>
            )}
        </section>
    );
}
