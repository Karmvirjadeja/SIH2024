import React, { useState, useEffect, useRef } from "react";

// Heuristic function for A* algorithm
const heuristic = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

// Custom A* algorithm for diagonal paths
const astarDiagonal = (graph, start, end) => {
  const openSet = [];
  openSet.push({ cost: 0, position: start });
  const cameFrom = new Map();
  const gScore = {};
  const fScore = {};
  const infinity = Infinity;
  for (const node in graph) {
    gScore[node] = infinity;
    fScore[node] = infinity;
  }
  gScore[start] = 0;
  fScore[start] = heuristic(start, end);

  while (openSet.length > 0) {
    const current = openSet.shift().position;

    if (current === end) {
      const path = [];
      let temp = current;
      while (cameFrom.has(temp)) {
        path.push(temp);
        temp = cameFrom.get(temp);
      }
      path.push(start);
      path.reverse();
      return path;
    }

    const neighbors = graph[current] || {};
    for (const neighbor in neighbors) {
      const tentativeGScore = gScore[current] + graph[current][neighbor].weight;
      if (tentativeGScore < gScore[neighbor]) {
        cameFrom.set(neighbor, current);
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);
        openSet.push({ cost: fScore[neighbor], position: neighbor });
      }
    }
  }
  return null;
};

// Custom A* algorithm for horizontal/vertical paths
const astarStraight = (graph, start, end) => {
  const openSet = [];
  openSet.push({ cost: 0, position: start });
  const cameFrom = new Map();
  const gScore = {};
  const fScore = {};
  const infinity = Infinity;
  for (const node in graph) {
    gScore[node] = infinity;
    fScore[node] = infinity;
  }
  gScore[start] = 0;
  fScore[start] = heuristic(start, end);

  while (openSet.length > 0) {
    const current = openSet.shift().position;

    if (current === end) {
      const path = [];
      let temp = current;
      while (cameFrom.has(temp)) {
        path.push(temp);
        temp = cameFrom.get(temp);
      }
      path.push(start);
      path.reverse();
      return path;
    }

    const neighbors = graph[current] || {};
    for (const neighbor in neighbors) {
      const tentativeGScore = gScore[current] + graph[current][neighbor].weight;
      if (tentativeGScore < gScore[neighbor]) {
        cameFrom.set(neighbor, current);
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);
        openSet.push({ cost: fScore[neighbor], position: neighbor });
      }
    }
  }
  return null;
};

// Generate weather data
const generateWeatherData = (gridSize) => {
  const weatherData = {};
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      weatherData[`${x},${y}`] = {
        windSpeed: Math.floor(Math.random() * 31),
        waveHeight: Math.random() * 5,
        danger: Math.random() < 0.33,
      };
    }
  }
  return weatherData;
};

// Create graph function with different weight adjustments
const createGraph = (gridSize, weatherData, isDiagonal) => {
  const graph = {};
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const key = `${x},${y}`;
      graph[key] = {};
      const directions = isDiagonal
        ? [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]
        : [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ];
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < gridSize && ny < gridSize) {
          const neighborKey = `${nx},${ny}`;
          const weight = weatherData[neighborKey].danger ? 10 : 1;
          graph[key][neighborKey] = {
            weight: dx !== 0 && dy !== 0 ? weight * Math.sqrt(2) : weight,
          };
        }
      }
    }
  }
  return graph;
};

const Algorithm = () => {
  const [gridSize] = useState(10);
  const [weatherData, setWeatherData] = useState(generateWeatherData(gridSize));
  const [paths, setPaths] = useState([]);
  const canvasRef = useRef(null);

  // Function to find multiple paths
  const findMultiplePaths = () => {
    const graphDiagonal = createGraph(gridSize, weatherData, true);
    const graphStraight = createGraph(gridSize, weatherData, false);
    const start = "0,0";
    const end = `${gridSize - 1},${gridSize - 1}`;

    const paths = [];
    const diagonalPath = astarDiagonal(graphDiagonal, start, end);
    const straightPath = astarStraight(graphStraight, start, end);
    if (diagonalPath) paths.push(diagonalPath);
    if (straightPath) paths.push(straightPath);

    setPaths(paths);
  };

  // Effect to handle drawing on canvas
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const cellSize = canvasRef.current.width / gridSize;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw ocean background
    ctx.fillStyle = "#8dbfd8"; // Light Sky Blue
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw weather data
    Object.keys(weatherData).forEach((key) => {
      const [x, y] = key.split(",").map(Number);
      if (weatherData[key].danger) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent red for danger zones
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    });

    // Draw multiple paths
    const colors = ["blue", "green"];
    paths.forEach((path, pathIndex) => {
      ctx.strokeStyle = colors[pathIndex];
      ctx.lineWidth = 5;
      ctx.beginPath();
      path.forEach((position, index) => {
        const [x, y] = position.split(",").map(Number);
        const cx = x * cellSize + cellSize / 2;
        const cy = y * cellSize + cellSize / 2;
        if (index === 0) {
          ctx.moveTo(cx, cy);
        } else {
          ctx.lineTo(cx, cy);
        }
      });
      ctx.stroke();
    });

    // Draw the start and end markers
    ctx.fillStyle = "green"; // Port
    ctx.beginPath();
    ctx.arc(0.5 * cellSize, 0.5 * cellSize, cellSize / 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "red"; // Destination
    ctx.beginPath();
    ctx.arc(
      (gridSize - 0.5) * cellSize,
      (gridSize - 0.5) * cellSize,
      cellSize / 3,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [weatherData, paths, gridSize]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-100 to-blue-500">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Working of Algorithm !</h1>
      <button
        onClick={findMultiplePaths}
        className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out mb-4"
      >
        Find Multiple Paths
      </button>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="border-2 border-gray-300 rounded-lg shadow-lg"
      ></canvas>
    </div>
  );
};

export default Algorithm;
