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

export default function MultiLineGraph({ xaxis, datasets, chart_label }) {
    const data = {
        labels: xaxis,
        datasets: datasets.map((dataset) => {
          const borderColor = generateColor(dataset.label);
          const backgroundColor = transparentize(borderColor, 0.2);
          return {
            label: dataset.label,
            data: dataset.data,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            borderWidth: 2,
          };
        }),
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
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sales ($)',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
