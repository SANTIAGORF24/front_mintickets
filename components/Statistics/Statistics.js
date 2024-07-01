import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Statistics = ({ ticketsData }) => {
  const [chartType, setChartType] = useState("bar");

  const getTicketCountByState = () => {
    const stateCounts = ticketsData.reduce((acc, ticket) => {
      acc[ticket.estado] = (acc[ticket.estado] || 0) + 1;
      return acc;
    }, {});
    return stateCounts;
  };

  const getTicketCountByTheme = () => {
    const themeCounts = ticketsData.reduce((acc, ticket) => {
      acc[ticket.tema] = (acc[ticket.tema] || 0) + 1;
      return acc;
    }, {});
    return themeCounts;
  };

  const getTicketCountBySpecialist = () => {
    const specialistCounts = ticketsData.reduce((acc, ticket) => {
      acc[ticket.especialista_nombre] =
        (acc[ticket.especialista_nombre] || 0) + 1;
      return acc;
    }, {});
    return specialistCounts;
  };

  const getSolvedTicketCountBySpecialist = () => {
    const specialistSolvedCounts = ticketsData.reduce((acc, ticket) => {
      if (ticket.estado === "Solucionado") {
        acc[ticket.especialista_nombre] =
          (acc[ticket.especialista_nombre] || 0) + 1;
      }
      return acc;
    }, {});
    return specialistSolvedCounts;
  };

  const chartData = (data, label) => {
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: label,
          data: Object.values(data),
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const renderChart = (data, label) => {
    const chartWidth = 300; // Ajusta el ancho del gráfico aquí
    const chartHeight = 300; // Ajusta el alto del gráfico aquí

    return chartType === "bar" ? (
      <div className="chart-container">
        <Bar
          data={chartData(data, label)}
          options={{ ...options, plugins: { ...options.plugins } }}
          width={chartWidth}
          height={chartHeight}
        />
      </div>
    ) : (
      <div className="chart-container">
        <Pie
          data={chartData(data, label)}
          options={{ ...options, plugins: { ...options.plugins } }}
          width={chartWidth}
          height={chartHeight}
        />
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-5/6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setChartType("bar")}
            className={`mr-2 px-4 py-2 rounded ${
              chartType === "bar"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Barras
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`px-4 py-2 rounded ${
              chartType === "pie"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Pastel
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-center mb-2 text-black">
              Cantidad de tickets en cada estado
            </h2>
            {renderChart(getTicketCountByState(), "Cantidad de tickets")}
          </div>
          <div>
            <h2 className="text-center mb-2  text-black">
              Cantidad de tickets por cada tema
            </h2>
            {renderChart(getTicketCountByTheme(), "Cantidad de tickets")}
          </div>
          <div>
            <h2 className="text-center mb-2  text-black">
              Cantidad de tickets asignado a cada especialista
            </h2>
            {renderChart(getTicketCountBySpecialist(), "Cantidad de tickets")}
          </div>
          <div>
            <h2 className="text-center mb-2  text-black">
              Cantidad de tickets solucionado por cada especialista
            </h2>
            {renderChart(
              getSolvedTicketCountBySpecialist(),
              "Cantidad de tickets"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
