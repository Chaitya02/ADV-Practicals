import React, { useState } from 'react';
import WordCloud from 'react-wordcloud';

const WordChart = ({ data }) => {
    const [emissionType, setEmissionType] = useState("CO");
    const [selectedCountry, setSelectedCountry] = useState("All");

    // Get unique countries from the data for dropdown
    const countries = Array.from(new Set(data.map(item => item.country)));

    const emissions = [
        { value: "CO", label: "CO" },
        { value: "SO2", label: "SO2" },
        { value: "PM25", label: "PM2.5" },
        { value: "PM10", label: "PM10" }
    ];

    // Aggregate data based on the selected emission type and country/state
    const countryEmissions = Array.from(
        data.reduce((acc, item) => {
            // Check if the item should be included based on the selected country/state
            if (selectedCountry === "All" || item.country === selectedCountry) {
                const emissionValue = item[emissionType];
                acc.set(item.country, (acc.get(item.country) || 0) + emissionValue);
            }
            return acc;
        }, new Map()),
        ([text, value]) => ({ text, value })
    );

    const options = {
        rotations: 2,
        rotationAngles: [-90, 0],
        fontSizes: [15, 50],
        scale: 'sqrt',
        colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
    };

    return (
        <div>
            <label>
                Select Emission Type:
                <select value={emissionType} onChange={(e) => setEmissionType(e.target.value)}>
                    {emissions.map(e => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Select Country/State:
                <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                    <option value="All">All</option>
                    {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
            </label>
            <div style={{ width: 400, height: 300 }}>
                <WordCloud words={countryEmissions} options={options} />
            </div>
        </div>
    );
};

export default WordChart;
