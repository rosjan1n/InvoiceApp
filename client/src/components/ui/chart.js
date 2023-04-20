import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function ChartComponent({ invoices }) {
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = document.getElementById("myChart");
    const labels = [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ];
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Łączna kwota",
          data: values(),
          backgroundColor: "rgb(104 117 245)",
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          display: false,
          grid: {
            display: false, // ukryj siatkę dla osi y
          },
        },
        x: {
          grid: {
            display: false, // ukryj siatkę dla osi x
          },
        },
      },
    };
    const chart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });
    setChartInstance(chart);

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [invoices]);

  const values = () => {
    const totalInvoice = Array(12).fill(0);
    invoices.forEach((invoice) => {
      const date = new Date(invoice.details.date_issue);
      totalInvoice[date.getMonth()] += invoice.details.total;
    });
    return totalInvoice;
  };

  return <canvas id="myChart"></canvas>;
}

export default ChartComponent;
