import "../../main.css";
import progressTemplate from "./progressTemplate.html";

let intervals: NodeJS.Timer[] = [];

(function () {
  const barsString = new URLSearchParams(window.location.search).get("bars");
  if (!barsString) return;
  const weekStartString = new URLSearchParams(window.location.search).get("ws");
  const bars = barsString.split(",").map((b) => Number(b));
  const startWeekOn = Number(weekStartString ?? 0);
  startProgress({ bars, startWeekOn });
})();

interface ProgressProps {
  bars: number[];
  startWeekOn: number;
}

type BarConfig = {
  id: number;
  title: string;
  startWeekOn?: number;
  progressElement: HTMLDivElement;
  titleElement: HTMLDivElement;
  percentElement: HTMLDivElement;
};

export function startProgress({ bars, startWeekOn }: ProgressProps) {
  intervals.forEach((interval) => clearInterval(interval));
  const progressBarMap = {
    0: { title: "Day" },
    1: { title: "Week", startWeekOn: startWeekOn ?? 0 },
    2: { title: "Month" },
    3: { title: "Year" },
  };

  const widgetContainer = document.getElementById("progress-widget");
  widgetContainer.innerHTML = bars.map((_) => progressTemplate).join("");
  const progressBars = bars.map((id, index) => {
    const { title, startWeekOn } = progressBarMap[id];
    const element = widgetContainer.children.item(index) as HTMLElement;
    const barConfig: BarConfig = {
      id,
      title,
      progressElement: element.children.item(0).children.item(0) as HTMLDivElement,
      titleElement: element.children.item(1) as HTMLDivElement,
      percentElement: element.children.item(2) as HTMLDivElement,
    };
    if (startWeekOn) {
      barConfig.startWeekOn = startWeekOn;
    }
    return barConfig;
  });

  progressBars.forEach((config) => {
    let interval: NodeJS.Timer;
    setProgress(config);
    interval = setInterval(() => setProgress(config), 1000);
    intervals.push(interval);
  });
}

function setProgress({ id, progressElement, percentElement, titleElement, title, startWeekOn }: BarConfig) {
  const currentDate = new Date();
  let percent: number = 0;
  let hour: number;
  let monthDay: number;
  switch (id) {
    case 0:
      hour = currentDate.getHours();
      const minute = currentDate.getMinutes();
      percent = (hour * 60 + minute) / 14.4;
      break;
    case 1:
      hour = currentDate.getHours();
      let weekDay = currentDate.getDay();
      if (startWeekOn === 1) {
        weekDay = weekDay === 0 ? 7 : weekDay - 1;
      }
      percent = (weekDay * 24 + hour) / 1.68;
      break;
    case 2:
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
      hour = currentDate.getHours();
      monthDay = currentDate.getDate();
      percent = (monthDay * 24 + hour) / (daysInMonth * 0.24);
      break;
    case 3:
      const monthDaysPast = [...Array(currentDate.getMonth()).keys()].reduce((a, c) => {
        return new Date(currentDate.getFullYear(), c + 1, 0).getDate() + a;
      }, 0);
      monthDay = currentDate.getDate();
      percent = (monthDaysPast + monthDay) / 3.65;
      break;
    default:
      break;
  }
  progressElement.style.width = `${percent}%`;
  percentElement.innerHTML = `${Math.round(percent)}%`
  titleElement.innerHTML = `${title}:`;
}
