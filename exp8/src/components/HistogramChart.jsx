// components/SelectableHistogram.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const SelectableHistogram = ({ data }) => {
    const ref = useRef();
    const [selectedColumn, setSelectedColumn] = useState("PM25");

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[selectedColumn])])
            .range([margin.left, width - margin.right]);

        const histogram = d3.histogram()
            .value(d => d[selectedColumn])
            .domain(xScale.domain())
            .thresholds(xScale.ticks(20));

        const bins = histogram(data);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height - margin.bottom, margin.top]);

        svg.selectAll("rect")
            .data(bins)
            .enter().append("rect")
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
            .attr("height", d => yScale(0) - yScale(d.length))
            .attr("fill", "steelblue");

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));
    }, [data, selectedColumn]);

    return (
        <div>
            <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>
                <option value="PM25">PM2.5</option>
                <option value="PM10">PM10</option>
                <option value="NO2">NO2</option>
                <option value="SO2">SO2</option>
            </select>
            <svg ref={ref} width={400} height={300}></svg>
        </div>
    );
};

export default SelectableHistogram;
