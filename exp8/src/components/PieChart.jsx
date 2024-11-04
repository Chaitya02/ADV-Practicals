// components/PieChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 300, height = 300;
        const radius = Math.min(width, height) / 2;

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie().value(d => d.CO);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

        g.selectAll("path").data(pie(data)).enter().append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.city));

    }, [data]);

    return <svg ref={ref} width={300} height={300}></svg>;
};

export default PieChart;
