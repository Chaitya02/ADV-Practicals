// components/LineChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data }) => {
    const ref = useRef();
    const cityData = data.filter(d => d.city === 'Tokyo'); // Filter data for Tokyo

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };

        const xScale = d3.scaleTime().domain(d3.extent(cityData, d => new Date(d.date))).range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear().domain([0, d3.max(cityData, d => d.temperature)]).nice().range([height - margin.bottom, margin.top]);

        const line = d3.line().x(d => xScale(new Date(d.date))).y(d => yScale(d.temperature));

        svg.append("path").datum(cityData).attr("fill", "none").attr("stroke", "steelblue").attr("stroke-width", 2).attr("d", line);

        svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale).ticks(5));
        svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale));
    }, [cityData]);

    return <svg ref={ref} width={400} height={300}></svg>;
};

export default LineChart;
