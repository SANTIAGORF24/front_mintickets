import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export function TicketCharts({ tickets }) {
  const [chartType, setChartType] = useState("bar");

  const countByProperty = (property) => {
    if (!tickets || !Array.isArray(tickets)) {
      return {};
    }
    return tickets.reduce((acc, ticket) => {
      acc[ticket[property]] = (acc[ticket[property]] || 0) + 1;
      return acc;
    }, {});
  };

  const temaCount = countByProperty("tema");
  const estadoCount = countByProperty("estado");

  const createChartData = (data, label) => ({
    labels: Object.keys(data),
    datasets: [
      {
        label: label,
        data: Object.values(data),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const temaChartData = createChartData(temaCount, "Tickets por Tema");
  const estadoChartData = createChartData(estadoCount, "Tickets por Estado");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Distribución de Tickets",
      },
    },
  };

  const ChartComponent = chartType === "bar" ? Bar : Pie;

  if (!tickets || tickets.length === 0) {
    return <div>No hay datos de tickets disponibles.</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-around">
        <div className="w-full md:w-[45%] mb-8">
          <h3 className="text-xl font-semibold mb-2  text-black">
            Tickets por Tema
          </h3>
          <ChartComponent data={temaChartData} options={options} />
        </div>
        <div className="w-full md:w-[45%] mb-8">
          <h3 className="text-xl font-semibold mb-2  text-black">
            Tickets por Estado
          </h3>
          <ChartComponent data={estadoChartData} options={options} />
        </div>
      </div>
    </div>
  );
}
