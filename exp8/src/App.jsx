// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import * as d3 from 'd3';
import WordChart from './components/WordChart';
import SelectableHistogram from './components/HistogramChart';
import RegressionPlot from './components/RegressionPlot';
import BoxPlot from './components/BoxPlot'
import ViolinPlot from './components/ViolenChart';

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        d3.csv('/air_quality.csv').then(data => {
            const parsedData = data.map(d => ({
                city: d.City,
                country: d.Country,
                date: d.Date,
                PM25: +d["PM2.5"],
                PM10: +d.PM10,
                NO2: +d.NO2,
                SO2: +d.SO2,
                CO: +d.CO,
                O3: +d.O3,
                temperature: +d.Temperature,
                humidity: +d.Humidity,
                windSpeed: +d["Wind Speed"]
            }));
            setData(parsedData);
        });
    }, []);

    return (
        <div className="dashboard">
            <h1>Air Quality Dashboard</h1>
            <div className="chart-container">
                <WordChart data={data} />
                <SelectableHistogram data={data} />
                <RegressionPlot data={data} />
                <BoxPlot data={data} />
                <ViolinPlot data={data} />
            </div>
        </div>
    );
}

export default App;
