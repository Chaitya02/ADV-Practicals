// components/JitterPlot.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const JitterPlot = ({ data }) => {
    const ref = useRef();
    const [selectedColumn, setSelectedColumn] = useState("CO");

    const columns = [
        { value: "CO", label: "CO" },
        { value: "SO2", label: "SO2" },
        { value: "NO2", label: "NO2" },
        { value: "Temperature", label: "Temperature" },
    ];

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous drawings

        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        // Create x scale based on selected column
        const x = d3.scaleBand()
            .domain([selectedColumn])
            .range([margin.left, width - margin.right])
            .padding(0.5);

        // Create y scale from 0 to 100
        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top]);

        // Add points with jitter effect
        const jitter = 5; // Amount of jitter
        const jitteredData = data.map(d => ({
            value: d[selectedColumn],
            jitteredY: d[selectedColumn] + (Math.random() * jitter - jitter / 2)
        })).filter(d => d.jitteredY >= 0 && d.jitteredY <= 100);

        svg.selectAll("circle")
            .data(jitteredData)
            .enter().append("circle")
            .attr("cx", x(selectedColumn) + x.bandwidth() / 2)
            .attr("cy", d => y(d.jitteredY))
            .attr("r", 3)
            .attr("fill", "steelblue");

        // Draw the y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y));

        // Draw the x-axis
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x));

    }, [data, selectedColumn]);

    return (
        <div>
            <label>
                Select Variable:
                <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>
                    {columns.map(col => (
                        <option key={col.value} value={col.value}>{col.label}</option>
                    ))}
                </select>
            </label>
            <svg ref={ref} width={400} height={300}></svg>
        </div>
    );
};

export default JitterPlot;
