// import React from "react";
// import { Line, Bubble } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const ForecastData = () => {
//   const data = [
//     {
//       timestamp: "2024-12-11 18:39:26",
//       wave_height: 0.63,
//       wind_speed: 15.17,
//       ocean_current: 0.38,
//     },
//     {
//       timestamp: "2024-12-11 19:38:26",
//       wave_height: 0.75,
//       wind_speed: 22.05,
//       ocean_current: 2.03,
//     },
//   ];

//   // Extracting chart data
//   const timestamps = data.map((entry) => entry.timestamp);
//   const waveHeights = data.map((entry) => entry.wave_height);
//   const windSpeeds = data.map((entry) => entry.wind_speed);
//   const oceanCurrents = data.map((entry) => entry.ocean_current);

//   // Line Chart configuration
//   const lineChartData = {
//     labels: timestamps,
//     datasets: [
//       {
//         label: "Wave Height (m)",
//         data: waveHeights,
//         borderColor: "#3498db",
//         backgroundColor: "rgba(52, 152, 219, 0.2)",
//         tension: 0.4,
//         fill: true,
//       },
//       {
//         label: "Wind Speed (km/h)",
//         data: windSpeeds,
//         borderColor: "#e74c3c",
//         backgroundColor: "rgba(231, 76, 60, 0.2)",
//         tension: 0.4,
//         fill: true,
//       },
//       {
//         label: "Ocean Current (m/s)",
//         data: oceanCurrents,
//         borderColor: "#2ecc71",
//         backgroundColor: "rgba(46, 204, 113, 0.2)",
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   const lineChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Ship Routing Forecast Data - Line Chart",
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Timestamp",
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Values",
//         },
//       },
//     },
//   };

//   // Bubble Chart configuration for heatmap-like effect
//   const bubbleChartData = {
//     datasets: [
//       {
//         label: "Wave Height",
//         data: waveHeights.map((value, index) => ({
//           x: index,
//           y: value,
//           r: value * 10, // Radius proportional to the value
//         })),
//         backgroundColor: "rgba(52, 152, 219, 0.8)",
//       },
//       {
//         label: "Wind Speed",
//         data: windSpeeds.map((value, index) => ({
//           x: index,
//           y: value,
//           r: value / 2, // Adjust radius scaling as needed
//         })),
//         backgroundColor: "rgba(231, 76, 60, 0.8)",
//       },
//       {
//         label: "Ocean Current",
//         data: oceanCurrents.map((value, index) => ({
//           x: index,
//           y: value,
//           r: value * 5,
//         })),
//         backgroundColor: "rgba(46, 204, 113, 0.8)",
//       },
//     ],
//   };

//   const bubbleChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Ship Routing Forecast Data - Heatmap Simulation",
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Index (Simulated Time)",
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: "Value",
//         },
//       },
//     },
//   };

//   return (
//     <div className="forecast-data">
//       <h1 className="text-center text-2xl font-bold mb-4">Forecast Data</h1>
//       <div className="line-chart mb-8">
//         <Line data={lineChartData} options={lineChartOptions} />
//       </div>
//       <div className="bubble-chart">
//         <Bubble data={bubbleChartData} options={bubbleChartOptions} />
//       </div>
//     </div>
//   );
// };

// export default ForecastData;
import React from "react";
import Header from '../components/Header';
import backgroundImage from '../assets/Sea.jpg';
import { Line, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Import the data.json file
import data from "../components/utils/umu.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ForecastData = () => {
  // Extracting chart data from JSON file
  const timestamps = data.map((entry) => entry.timestamp);
  const waveHeights = data.map((entry) => entry.wave_height);
  const windSpeeds = data.map((entry) => entry.wind_speed);
  const oceanCurrents = data.map((entry) => entry.ocean_current);

  // Line Chart configuration
  const lineChartData = {
    labels: timestamps,
    datasets: [
      {
        label: "Wave Height (m)",
        data: waveHeights,
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Wind Speed (km/h)",
        data: windSpeeds,
        borderColor: "#e74c3c",
        backgroundColor: "rgba(231, 76, 60, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Ocean Current (m/s)",
        data: oceanCurrents,
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ship Routing Forecast Data - Line Chart",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Timestamp",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
      },
    },
  };

  // Bubble Chart configuration for heatmap-like effect
  const bubbleChartData = {
    datasets: [
      {
        label: "Wave Height",
        data: waveHeights.map((value, index) => ({
          x: index,
          y: value,
          r: value * 10, // Radius proportional to the value
        })),
        backgroundColor: "rgba(52, 152, 219, 0.8)",
      },
      {
        label: "Wind Speed",
        data: windSpeeds.map((value, index) => ({
          x: index,
          y: value,
          r: value / 2, // Adjust radius scaling as needed
        })),
        backgroundColor: "rgba(231, 76, 60, 0.8)",
      },
      {
        label: "Ocean Current",
        data: oceanCurrents.map((value, index) => ({
          x: index,
          y: value,
          r: value * 5,
        })),
        backgroundColor: "rgba(46, 204, 113, 0.8)",
      },
    ],
  };

  const bubbleChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ship Routing Forecast Data - Heatmap Simulation",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Index (Simulated Time)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div>
      <Header />
      <div
        className="bg-cover bg-center min-h-screen py-12 px-4"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="forecast-data max-w-6xl mx-auto bg-white bg-opacity-90 shadow-lg rounded-lg p-8">
          <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">Forecast Data</h1>

          <div className="line-chart mb-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Line Chart</h2>
            <div className="overflow-x-auto">
              <Line data={lineChartData} options={lineChartOptions} className="rounded-lg shadow-md" />
            </div>
          </div>

          <div className="bubble-chart">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Bubble Chart</h2>
            <div className="overflow-x-auto">
              <Bubble data={bubbleChartData} options={bubbleChartOptions} className="rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastData;
