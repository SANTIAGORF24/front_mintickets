import React, { useState, useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

Chart.register(...registerables);

const Statistics = ({ ticketsData }) => {
  const [chartType, setChartType] = useState("bar");
  const chartRefs = {
    state: useRef(null),
    theme: useRef(null),
    specialist: useRef(null),
    solvedSpecialist: useRef(null),
  };

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
            "rgba(201, 203, 207, 0.6)",
            "rgba(255, 127, 80, 0.6)",
            "rgba(144, 238, 144, 0.6)",
            "rgba(100, 149, 237, 0.6)",
            "rgba(238, 130, 238, 0.6)",
            "rgba(210, 105, 30, 0.6)",
            "rgba(240, 230, 140, 0.6)",
            "rgba(128, 0, 128, 0.6)",
            "rgba(0, 128, 128, 0.6)",
            "rgba(128, 128, 0, 0.6)",
            "rgba(0, 255, 127, 0.6)",
            "rgba(70, 130, 180, 0.6)",
            "rgba(255, 69, 0, 0.6)",
            "rgba(152, 251, 152, 0.6)",
            "rgba(175, 238, 238, 0.6)",
            "rgba(127, 255, 212, 0.6)",
            "rgba(244, 164, 96, 0.6)",
            "rgba(32, 178, 170, 0.6)",
            "rgba(240, 128, 128, 0.6)",
            "rgba(221, 160, 221, 0.6)",
            "rgba(255, 228, 181, 0.6)",
            "rgba(250, 128, 114, 0.6)",
            "rgba(147, 112, 219, 0.6)",
            "rgba(60, 179, 113, 0.6)",
            "rgba(218, 165, 32, 0.6)",
            "rgba(220, 20, 60, 0.6)",
            "rgba(176, 224, 230, 0.6)",
            "rgba(95, 158, 160, 0.6)",
            "rgba(245, 222, 179, 0.6)",
            "rgba(128, 128, 255, 0.6)",
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

  const renderChart = (data, label, refKey) => {
    const chartWidth = 300;
    const chartHeight = 300;

    return (
      <div ref={chartRefs[refKey]} className="chart-container">
        {chartType === "bar" ? (
          <Bar
            data={chartData(data, label)}
            options={{ ...options, plugins: { ...options.plugins } }}
            width={chartWidth}
            height={chartHeight}
          />
        ) : (
          <Pie
            data={chartData(data, label)}
            options={{ ...options, plugins: { ...options.plugins } }}
            width={chartWidth}
            height={chartHeight}
          />
        )}
      </div>
    );
  };

  const downloadChartAsPNG = (ref, title) => {
    if (!ref.current) return;

    html2canvas(ref.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${title}_chart.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const downloadChartAsPDF = (ref, title) => {
    if (!ref.current) return;

    html2canvas(ref.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title}_chart.pdf`);
    });
  };

  const downloadAsExcel = () => {
    // Function to truncate or modify sheet names to be 31 characters or less
    const sanitizeSheetName = (name) => {
      // Remove any characters that are not allowed in Excel sheet names
      const sanitized = name
        .replace(/[*?:/[\]]/g, "_")
        .replace(/'/g, "")
        .trim();

      // Truncate to 31 characters
      return sanitized.length > 31 ? sanitized.substring(0, 31) : sanitized;
    };

    const sheetsData = [
      {
        name: sanitizeSheetName("Tickets por Estado"),
        data: Object.entries(getTicketCountByState()).map(([key, value]) => ({
          Estado: key,
          Cantidad: value,
        })),
      },
      {
        name: sanitizeSheetName("Tickets por Tema"),
        data: Object.entries(getTicketCountByTheme()).map(([key, value]) => ({
          Tema: key,
          Cantidad: value,
        })),
      },
      {
        name: sanitizeSheetName("Tickets por Especialista"),
        data: Object.entries(getTicketCountBySpecialist()).map(
          ([key, value]) => ({ Especialista: key, Cantidad: value })
        ),
      },
      {
        name: sanitizeSheetName("Tickets Solucionados"),
        data: Object.entries(getSolvedTicketCountBySpecialist()).map(
          ([key, value]) => ({ Especialista: key, Cantidad: value })
        ),
      },
    ];

    const workbook = XLSX.utils.book_new();

    try {
      sheetsData.forEach((sheet, index) => {
        const worksheet = XLSX.utils.json_to_sheet(sheet.data);

        // Ensure unique sheet names
        const sheetName =
          sheet.data.length > 0 ? sheet.name : `Sheet${index + 1}`;

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      XLSX.writeFile(workbook, "tickets_statistics.xlsx");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("No se pudo exportar el archivo Excel. Inténtelo de nuevo.");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-5/6">
        <div className="flex justify-between mb-4">
          <div>
            <button
              onClick={() => downloadAsExcel()}
              className="mr-2 px-4 py-2 rounded bg-green-500 text-white"
            >
              Descargar Excel
            </button>
          </div>
          <div className="flex">
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-center text-black">
                Cantidad de tickets en cada estado
              </h2>
              <div>
                <button
                  onClick={() =>
                    downloadChartAsPNG(chartRefs.state, "estado_tickets")
                  }
                  className="mr-2 px-2 py-1 rounded bg-blue-200 text-black text-sm"
                >
                  PNG
                </button>
                <button
                  onClick={() =>
                    downloadChartAsPDF(chartRefs.state, "estado_tickets")
                  }
                  className="px-2 py-1 rounded bg-blue-200 text-black text-sm"
                >
                  PDF
                </button>
              </div>
            </div>
            {renderChart(
              getTicketCountByState(),
              "Cantidad de tickets",
              "state"
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-center text-black">
                Cantidad de tickets por cada tema
              </h2>
              <div>
                <button
                  onClick={() =>
                    downloadChartAsPNG(chartRefs.theme, "tema_tickets")
                  }
                  className="mr-2 px-2 py-1 rounded bg-blue-200 text-black text-sm"
                >
                  PNG
                </button>
                <button
                  onClick={() =>
                    downloadChartAsPDF(chartRefs.theme, "tema_tickets")
                  }
                  className="px-2 py-1 rounded bg-blue-200 text-black text-sm"
                >
                  PDF
                </button>
              </div>
            </div>
            {renderChart(
              getTicketCountByTheme(),
              "Cantidad de tickets",
              "theme"
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-center text-black">
                Cantidad de tickets asignado a cada especialista
              </h2>
              <div>
                <button
                  onClick={() =>
                    downloadChartAsPNG(
                      chartRefs.specialist,
                      "especialista_tickets"
                    )
                  }
                  className="mr-2 px-2 py-1 rounded bg-blue-200 text-black text-sm"
                >
                  PNG
                </button>
                <button
                  onClick={() =>
                    downloadChartAsPDF(
                      chartRefs.specialist,
                      "especialista_tickets"
                    )
                  }
                  className="px-2 py-1 rounded bg-blue-200 text-black text-sm"
                >
                  PDF
                </button>
              </div>
            </div>
            {renderChart(
              getTicketCountBySpecialist(),
              "Cantidad de tickets",
              "specialist"
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-center text-black">
                Cantidad de tickets solucionado por cada especialista
              </h2>
              <div>
                <button
                  onClick={() =>
                    downloadChartAsPNG(
                      chartRefs.solvedSpecialist,
                      "especialista_tickets_solucionados"
                    )
                  }
                  className="mr-2 px-2 py-1 rounded bg-blue-200 text-black text-sm"
                >
                  PNG
                </button>
                <button
                  onClick={() =>
                    downloadChartAsPDF(
                      chartRefs.solvedSpecialist,
                      "especialista_tickets_solucionados"
                    )
                  }
                  className="px-2 py-1 rounded bg-blue-200 text-black text-sm"
                >
                  PDF
                </button>
              </div>
            </div>
            {renderChart(
              getSolvedTicketCountBySpecialist(),
              "Cantidad de tickets",
              "solvedSpecialist"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
