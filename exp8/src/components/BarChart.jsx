// components/BarChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous content

        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 60, left: 60 };

        // Set up scales
        const xScale = d3.scaleBand().domain(data.map(d => d.city)).range([margin.left, width - margin.right]).padding(0.1);
        const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.PM25)]).nice().range([height - margin.bottom, margin.top]);

        // Draw bars
        svg.selectAll("rect").data(data).enter().append("rect")
            .attr("x", d => xScale(d.city))
            .attr("y", d => yScale(d.PM25))
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(0) - yScale(d.PM25))
            .attr("fill", "steelblue");

        // Add X axis
        svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale))
            .selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

        // Add Y axis
        svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale));
    }, [data]);

    return <svg ref={ref} width={400} height={300}></svg>;
};

export default BarChart;
