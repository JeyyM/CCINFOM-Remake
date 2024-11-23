'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

export default function BarChart({ labels, data, chart_label }) {
    const backgroundColors = labels.map((label) => transparentize(generateColor(label), 0.6));
    const borderColors = labels.map((label) => generateColor(label));

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: chart_label,
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
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
          text: 'Food Categories',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Quantity',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
