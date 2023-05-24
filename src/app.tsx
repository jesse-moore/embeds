import { h } from "preact";
import React, { useEffect, useState } from "react";
import { CheckboxInput, RadioInput } from "./components/formInputs";
import { CopyIcon } from "./components/icons";
import { startProgress } from "./widgets/progress";
import progressTemplate from "./widgets/progress/index.html";

type WeekStart = 0 | 1;

export const App = () => {
  const [weekStart, setWeekStart] = useState<WeekStart>(0);
  const [progressBars, setProgressBars] = useState<Set<number>>(new Set([0, 1, 2, 3]));
  const [url, setUrl] = useState("");
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const progressWidget = document.getElementById("progress-widget-container");
    if (!progressWidget) return;
    progressWidget.innerHTML = progressTemplate;
  }, []);

  useEffect(() => {
    renderProgressBars();
    formatURL();
  }, [progressBars, weekStart]);

  const renderProgressBars = () => {
    const bars = [...progressBars].sort((a, b) => (a > b ? 1 : -1));
    startProgress({ bars, startWeekOn: weekStart });
  };

  const formatURL = () => {
    const base = window.location.href;
    const bars = [...progressBars].sort((a, b) => (a > b ? 1 : -1)).join(",");
    const params = [`bars=${bars}`];
    if (bars.includes("1") && weekStart === 1) {
      params.push(`ws=${weekStart}`);
    }
    const url = `${base}progress?${params.join("&")}`;
    setUrl(url);
  };

  const updateProgressBars: h.JSX.MouseEventHandler<HTMLInputElement> = (event) => {
    const { checked, value } = event.target as HTMLInputElement;
    if (checked) {
      setProgressBars(new Set([...progressBars, Number(value)]));
    } else {
      const newSet = new Set([...progressBars]);
      newSet.delete(Number(value));
      setProgressBars(newSet);
    }
  };

  const copyURL = () => {
    setShowCopied(true);
    const urlTextDiv = document.getElementById("url-text") as HTMLDivElement;
    const urlText = urlTextDiv.innerHTML.replace("&amp;", "&");
    navigator.clipboard.writeText(urlText);
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  };

  return (
    <div class="pt-5">
      <div class="border border-gray-600 rounded-md w-fit px-6 py-5 mx-auto">
        <div class="flex flex-row gap-x-10 w-fit items-center">
          <div class="flex flex-col gap-y-6">
            <form id="progress-form" className="flex flex-col gap-y-2 h-[136px]">
              <div className="w-[485px]">
                <label class="block text-base font-medium text-[#07074D]">Progress Bars</label>
                <div className="flex items-center space-x-6">
                  <CheckboxInput
                    label="Day"
                    id="day"
                    name="progress-form-type"
                    value="0"
                    checked={progressBars.has(0)}
                    onClick={updateProgressBars}
                  />
                  <CheckboxInput
                    label="Week"
                    id="week"
                    name="progress-form-type"
                    value="1"
                    checked={progressBars.has(1)}
                    onClick={updateProgressBars}
                  />
                  <CheckboxInput
                    label="Month"
                    id="month"
                    name="progress-form-type"
                    value="2"
                    checked={progressBars.has(2)}
                    onClick={updateProgressBars}
                  />
                  <CheckboxInput
                    label="Year"
                    id="year"
                    name="progress-form-type"
                    value="3"
                    checked={progressBars.has(3)}
                    onClick={updateProgressBars}
                  />
                </div>
              </div>
              {progressBars.has(1) && (
                <div>
                  <label class="block text-base font-medium text-[#07074D]">Start Week On</label>
                  <div className="flex items-center space-x-6">
                    <RadioInput
                      label="Sunday"
                      id="sun"
                      name="progress-form-start-week"
                      value="0"
                      checked={weekStart === 0}
                      onClick={() => setWeekStart(0)}
                    />
                    <RadioInput
                      label="Monday"
                      id="mon"
                      name="progress-form-start-week"
                      value="1"
                      checked={weekStart === 1}
                      onClick={() => setWeekStart(1)}
                    />
                  </div>
                </div>
              )}
            </form>
            <div className="flex w-full">
              <div className="py-2 px-3 bg-gray-200 rounded-l-md flex-grow relative">
                <div id="url-text">{url}</div>
                {showCopied && (
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 rounded-xl bg-success text-sm py-0.5 px-1 font-medium">
                    Copied
                  </div>
                )}
              </div>
              <button
                className="flex py-2 px-3 bg-gray-300 rounded-r-md cursor-pointer active:bg-gray-400"
                onClick={copyURL}
              >
                <CopyIcon width="18px"></CopyIcon>
              </button>
            </div>
          </div>
          <div className="w-[400px]">
            <div id="progress-widget-container" className="mx-auto w-fit"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
