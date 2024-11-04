// components/RegressionPlot.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const RegressionPlot = ({ data }) => {
    const ref = useRef();
    const [xColumn, setXColumn] = useState("CO");
    const [yColumn, setYColumn] = useState("PM10");

    const columns = [
        { value: "CO", label: "CO" },
        { value: "NO2", label: "NO2" },
        { value: "SO2", label: "SO2" },
        { value: "PM10", label: "PM10" },
        { value: "PM25", label: "PM2.5" }
    ];

    useEffect(() => {
        // Shuffle and select 100 random data points
        const randomData = d3.shuffle(data).slice(0, 100);

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };

        const xScale = d3.scaleLinear()
            .domain(d3.extent(randomData, d => d[xColumn]))
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(randomData, d => d[yColumn]))
            .range([height - margin.bottom, margin.top]);

        svg.selectAll("circle")
            .data(randomData)
            .enter().append("circle")
            .attr("cx", d => xScale(d[xColumn]))
            .attr("cy", d => yScale(d[yColumn]))
            .attr("r", 3)
            .attr("fill", "steelblue");

        const xMean = d3.mean(randomData, d => d[xColumn]);
        const yMean = d3.mean(randomData, d => d[yColumn]);
        const slope = d3.sum(randomData, d => (d[xColumn] - xMean) * (d[yColumn] - yMean))
            / d3.sum(randomData, d => Math.pow(d[xColumn] - xMean, 2));
        const intercept = yMean - slope * xMean;

        const xMin = d3.min(randomData, d => d[xColumn]);
        const xMax = d3.max(randomData, d => d[xColumn]);

        svg.append("line")
            .attr("x1", xScale(xMin))
            .attr("y1", yScale(intercept + slope * xMin))
            .attr("x2", xScale(xMax))
            .attr("y2", yScale(intercept + slope * xMax))
            .attr("stroke", "red")
            .attr("stroke-width", 2);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));
    }, [data, xColumn, yColumn]);

    return (
        <div>
            <label>
                X-Axis:
                <select value={xColumn} onChange={(e) => setXColumn(e.target.value)}>
                    {columns.map(col => <option key={col.value} value={col.value}>{col.label}</option>)}
                </select>
            </label>
            <label>
                Y-Axis:
                <select value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
                    {columns.map(col => <option key={col.value} value={col.value}>{col.label}</option>)}
                </select>
            </label>
            <svg ref={ref} width={400} height={300}></svg>
        </div>
    );
};

export default RegressionPlot;
