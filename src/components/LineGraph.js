'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function generateColor(label) {
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
        hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (hash >> 16) & 255;
    const g = (hash >> 8) & 255;
    const b = hash & 255;
    return `rgba(${r}, ${g}, ${b}, 1)`;
}

function transparentize(color, transparency = 0.2) {
    const rgba = color.replace('rgba(', '').replace(')', '').split(',');
    return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${transparency})`;
}

export default function LineGraph({ xaxis, yaxis, chart_label, xscale, yscale }) {
    const borderColor = generateColor(chart_label);
    const backgroundColor = transparentize(borderColor);

    const data = {
        labels: xaxis,
        datasets: [
            {
                label: chart_label,
                data: yaxis,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: chart_label,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xscale,
                },
            },
            y: {
                title: {
                    display: true,
                    text: yscale,
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}
