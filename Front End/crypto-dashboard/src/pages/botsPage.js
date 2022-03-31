import React, { useState } from "react";
import Navbar from "../components/navbar/navbar";
import BotMenu from "../components/botMenu";
import DeleteModal from "../components/modal";
import NewBotModal from "../components/newBotModal";

const Bots = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isNewBotModalOpen, setNewBotModalOpen] = useState(false);

  const [botList, setBotList] = useState([
    {
      id: 1,
      coin: "BTC",
      funds: 1000,
      pnl: 5,
      sparkline: [1, 2, 3, 2, 1],
      status: "Running",
    },
    {
      id: 2,
      coin: "ETH",
      funds: 2000,
      pnl: 10,
      sparkline: [1, 2, 3, 2, 1],
      status: "Running",
    },
  ]);

  //This will contain the ID of the bot to be deleted
  const [toDelete, setToDelete] = useState(null);

  const removeBot = () => {
    var filtered = botList.filter(function (value, index, arr) {
      return value.id != toDelete;
    });
    console.log(filtered);
    setDeleteModalOpen(false);
    setBotList(filtered);
  };

  const addBot = (coin,amount) => {
    let lastId = 0;
    if (botList.length > 0) {
      lastId = botList[botList.length - 1].id;
    }
    lastId++;
    setBotList([
      ...botList,
      {
        id: lastId,
        coin: coin,
        funds: amount,
        pnl: 0,
        sparkline: [0],
        status: "Running",
      },
    ]);
  };

  return (
    <>
      <Navbar />
      {botList.length === 0 ? (
        <>
          <div className="min-h-screen bg-gray-100 text-gray-1000">
            <div class="flex flex-wrap overflow-hidden">
              <div class="container-sm">
                <h1 className="mt-10 text-2xl font-semibold">
                  You currently have no active bots.
                </h1>
                <button
                  onClick={() => setNewBotModalOpen(true)}
                  class="mt-10 hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
                >
                  <svg
                    class="group-hover:text-blue-500 mb-1 text-slate-400"
                    width="20"
                    height="20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                  </svg>
                  New bot
                </button>
              </div>
            </div>
          </div>
          <NewBotModal
                open={isNewBotModalOpen}
                setOpen={setNewBotModalOpen}
                addBot={addBot}
              ></NewBotModal>
        </>
      ) : (
        <div className="min-h-screen bg-gray-100 text-gray-1000">
          <div class="flex flex-wrap overflow-hidden">
            <div class="container-sm">
              {botList.map((bot) => {
                return (
                  <div class="w-full overflow-hidden px-4 py-6" key={bot.id}>
                    <BotMenu
                      id={bot.id}
                      coin={bot.coin}
                      funds={bot.funds}
                      pnl={bot.pnl}
                      sparkline={bot.sparkline}
                      status={bot.status}
                      open={isDeleteModalOpen}
                      setOpen={setDeleteModalOpen}
                      setDelete={setToDelete}
                    />
                  </div>
                );
              })}
              <button
                onClick={() => setNewBotModalOpen(true)}
                class="hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
              >
                <svg
                  class="group-hover:text-blue-500 mb-1 text-slate-400"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                </svg>
                New bot
              </button>
              <DeleteModal
                open={isDeleteModalOpen}
                setOpen={setDeleteModalOpen}
                toDelete={setToDelete}
                removeBot={removeBot}
              ></DeleteModal>
              <NewBotModal
                open={isNewBotModalOpen}
                setOpen={setNewBotModalOpen}
                addBot={addBot}
              ></NewBotModal>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bots;
