import React, { useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { useNavigate } from "react-router-dom";

const BotMenu = (props) => {
  const [settings, setSettings] = useState({
    id: props.id,
    coin: props.coin,
    funds: props.funds,
    pnl: props.pnl,
    sparkline: props.sparkline,
    state: props.status,
  });

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    const prevState = { ...settings };
    if (prevState.state === "Running") {
      prevState.state = "Stopped";
    } else {
      prevState.state = "Running";
    }
    setSettings(prevState);
  };

  return (
    <>
      <ul>
        <div
          class="flex flex-wrap gap-4 py-12 px-24 border-2 rounded-lg hover:bg-gray-200 shadow-md"
          onClick={() => navigate("/coin/" + settings.coin)}
          style={{ cursor: "pointer" }}
        >
          <li>Coin : {settings.coin}</li>
          <li>Funds : ${settings.funds}</li>
          <li>Profit / Loss : {settings.pnl}% </li>
          <li>
            <Sparklines data={[1,1,1,1,1]}>
              <SparklinesLine
                color={
                  settings.sparkline[0] < settings.sparkline.reverse()[0]
                    ? "red"
                    : "green"
                }
                style={{ fill: "none" }}
              />
            </Sparklines>
          </li>
          <li>
            Status : <span
              className={
                settings.state === "Stopped"
                  ? "text-base text-red-500"
                  : "text-base text-green-500"
              }
            >
            {settings.state}
            </span>
          </li>
          {settings.state === "Stopped" ? (
            <li>
              <button
                class="py-2 px-4 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300"
                onClick={handleClick}
              >
                Start
              </button>
            </li>
          ) : (
            <li>
              <button
                class="py-2 px-4 font-medium text-white bg-red-500 rounded hover:bg-red-400 transition duration-300"
                onClick={handleClick}
              >
                Stop
              </button>
            </li>
          )}
          <li>
            <button
              class="border-none px-4"
              onClick={(e) => {
                e.stopPropagation();
                props.setOpen(true);
                props.setDelete(settings.id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </li>
        </div>
      </ul>
    </>
  );
};

export default BotMenu;
