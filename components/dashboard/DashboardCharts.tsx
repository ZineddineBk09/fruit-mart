"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  getMonths,
  getOrdersAddedInEachMonth,
  getProductsAddedInEachMonth,
  getUsersAddedInEachMonth,
} from "@/utils";
Chart.register(zoomPlugin);

type Props = {};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  bezierCurve: true,
  elements: {
    line: {
      tension: 0.4,
    },
  },

  // read data from lines on hover
  tooltips: {
    mode: "index" as const,
    intersect: false,
  },
  // read data from lines on hover
  hover: {
    mode: "nearest" as const,
    intersect: true,
  },

  // X and Y axes labels colors
  scales: {
    x: {
      ticks: {
        color: "rgba(0, 0, 0, 1)",
      },
    },
    y: {
      ticks: {
        color: "rgba(0, 0, 0, 1)",
      },
    },
  },

  plugins: {
    legend: {
      position: "top" as const,
    },
    // zoom
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        drag: {
          enabled: true,
        },
        mode: "x",
      },
    },
  },
};

export default async function DashboardCharts({}: Props) {
  const months = getMonths();

  const products = await getProductsAddedInEachMonth();
  const orders = await getOrdersAddedInEachMonth();
  const users = await getUsersAddedInEachMonth();


  const data = {
    labels: months,

    // read data from lines on hover
    datasets: [
      // orders: green
      {
        label: "الطلبات",
        data: orders,
        borderColor: "rgb(3, 255, 59)",
        backgroundColor: "rgba(3, 255, 59, 0.5)",
      },
      // products: red
      {
        label: "المنتجات",
        data: products,
        borderColor: "rgb(255, 10, 10)",
        backgroundColor: "rgba(255, 10, 10, 0.5)",
      },
      // users: yellow
      {
        label: "المستخدمين",
        data: users,
        borderColor: "rgb(255, 255, 0)",
        backgroundColor: "rgba(255, 255, 0, 0.5)",
      },
    ],
  };

  return (
    <div className="h-[100%] w-full  mt-10  bg-light-dark-2 rounded-md p-3">
      <Line options={options as any} data={data} />
    </div>
  );
}
