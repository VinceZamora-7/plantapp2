import React from "react";

export default function Filters({ filterStatus, setFilterStatus, filterStartDate, setFilterStartDate, filterEndDate, setFilterEndDate, sortAsc, setSortAsc }) {
    return (
        <div className="filters">
            <label>
                Health Status:{" "}
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option>All</option>
                    <option>Excellent Health</option>
                    <option>Good Health</option>
                    <option>Moderate Health</option>
                    <option>Bad Health</option>
                    <option>Unknown</option>
                </select>
            </label>

            <label>
                Start Date:{" "}
                <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
            </label>

            <label>
                End Date:{" "}
                <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
            </label>

            <button onClick={() => setSortAsc(!sortAsc)}>
                Sort Date: {sortAsc ? "Ascending" : "Descending"}
            </button>
        </div>
    );
}
