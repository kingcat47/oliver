import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { Card } from "@/shared/components";

import s from "./style.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
);

interface Props {
  averageDelay: number;
  maxDelay: number;
  medianDelay: number;
}

const generateMockDelayData = () => {
  const labels = [];
  const data = [];

  for (let i = 0; i < 30; i++) {
    labels.push(`${i}`);
    data.push(Math.floor(Math.random() * 150) + 50);
  }

  return { labels, data };
};

export default function CameraSignalStrengthCard({
  averageDelay,
  maxDelay,
  medianDelay,
}: Props) {
  const { labels, data } = generateMockDelayData();

  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: "#007AFF",
        backgroundColor: "rgb(55, 116, 215, 0.1)",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.6,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: { display: true, color: "rgba(255, 255, 255, 0.1)" },
        ticks: { display: false },
        border: { display: false },
      },
      y: {
        display: true,
        min: 0,
        max: 300,
        grid: { display: true, color: "rgba(255, 255, 255, 0.1)" },
        ticks: { display: false },
        border: { display: false },
      },
    },
    elements: {
      point: { radius: 0, hoverRadius: 0 },
    },
  };

  return (
    <Card>
      <Card.Title>영상 신호 퀄리티</Card.Title>
      <div className={s.content}>
        <div>
          <div className={s.signalStrength}>
            <span>평균 지연</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="5" cy="5" r="5" />
            </svg>
          </div>

          <span>{averageDelay}ms</span>
        </div>
        <div>
          <span>최대 지연</span>
          <span>{maxDelay}ms</span>
        </div>
        <div>
          <span>중앙값</span>
          <span>{medianDelay}ms</span>
        </div>
      </div>

      <div className={s.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </Card>
  );
}
