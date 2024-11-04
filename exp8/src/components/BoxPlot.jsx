// components/WhiskerPlot.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const WhiskerPlot = ({ data }) => {
    const ref = useRef();
    const [selectedVariable, setSelectedVariable] = useState("CO");

    const variables = [
        { value: "CO", label: "CO" },
        { value: "SO2", label: "SO2" },
        { value: "NO2", label: "NO2" },
        { value: "Temperature", label: "Temperature" }
    ];

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        // Create scales
        const xScale = d3.scaleBand()
            .domain([selectedVariable])
            .range([margin.left, width - margin.right])
            .padding(0.5);

        // Fixed y-axis scale from 0 to 100
        const yScale = d3.scaleLinear()
            .domain([0, 100])  // Set fixed domain
            .range([height - margin.bottom, margin.top]);

        // Calculate quartiles and whiskers
        const q1 = d3.quantile(data, 0.25, d => d[selectedVariable]);
        const median = d3.quantile(data, 0.5, d => d[selectedVariable]);
        const q3 = d3.quantile(data, 0.75, d => d[selectedVariable]);
        const interQuantileRange = q3 - q1;

        // Whiskers (capped at the fixed range)
        const lowerWhisker = Math.max(0, d3.min(data, d => d[selectedVariable]));
        const upperWhisker = Math.min(100, d3.max(data, d => d[selectedVariable]));

        // Draw the box (only for median)
        svg.append("rect")
            .attr("x", xScale(selectedVariable))
            .attr("y", yScale(q3))
            .attr("height", yScale(q1) - yScale(q3))
            .attr("width", xScale.bandwidth())
            .attr("fill", "steelblue");

        // Draw the median line
        svg.append("line")
            .attr("x1", xScale(selectedVariable))
            .attr("x2", xScale(selectedVariable) + xScale.bandwidth())
            .attr("y1", yScale(median))
            .attr("y2", yScale(median))
            .attr("stroke", "red")
            .attr("stroke-width", 2);

        // Draw the whiskers
        svg.append("line")
            .attr("x1", xScale(selectedVariable) + xScale.bandwidth() / 2)
            .attr("x2", xScale(selectedVariable) + xScale.bandwidth() / 2)
            .attr("y1", yScale(lowerWhisker))
            .attr("y2", yScale(q1))
            .attr("stroke", "black");

        svg.append("line")
            .attr("x1", xScale(selectedVariable) + xScale.bandwidth() / 2)
            .attr("x2", xScale(selectedVariable) + xScale.bandwidth() / 2)
            .attr("y1", yScale(q3))
            .attr("y2", yScale(upperWhisker))
            .attr("stroke", "black");

        // X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        // Y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));
    }, [data, selectedVariable]);

    return (
        <div>
            <label>
                Select Variable:
                <select value={selectedVariable} onChange={(e) => setSelectedVariable(e.target.value)}>
                    {variables.map(v => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                </select>
            </label>
            <svg ref={ref} width={500} height={300}></svg>
        </div>
    );
};

export default WhiskerPlot;
