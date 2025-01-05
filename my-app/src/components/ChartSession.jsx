// BarChartComponent.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ dataArray }) => {
  if (!dataArray || dataArray.length === 0) {
    return <p>No data available</p>;
  }

  // Dynamically generate chart labels based on the length of the dataArray
  const generateLabels = () => {
    const labels = [];
    if (dataArray.length === 24) {
      // For 24 points (hourly data)
      for (let i = 0; i < 24; i++) {
        labels.push({ name: `${i}:00`, value: dataArray[i] || 0 });
      }
    } else if (dataArray.length === 7) {
      // For 7 points (daily data)
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      for (let i = 0; i < 7; i++) {
        labels.push({ name: days[i], value: dataArray[i] || 0 });
      }
    } else if (dataArray.length >= 28 && dataArray.length <= 31) {
      // For monthly data (number of days in a month)
      for (let i = 1; i <= dataArray.length; i++) {
        labels.push({ name: `Day ${i}`, value: dataArray[i - 1] || 0 });
      }
    } else if (dataArray.length === 12) {
      // For yearly data (12 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < 12; i++) {
        labels.push({ name: months[i], value: dataArray[i] || 0 });
      }
    }
    return labels;
  };

  const chartData = generateLabels();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
