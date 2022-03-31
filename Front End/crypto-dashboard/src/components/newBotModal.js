import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import Dropdown from "@material-tailwind/react/Dropdown";
import DropdownItem from "@material-tailwind/react/DropdownItem";
import DropdownLink from "@material-tailwind/react/DropdownLink";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, InputAdornment  } from "@material-ui/core";
const NewBotModal = (props) => {
  const cancelButtonRef = useRef(null);
  const [amount,setAmount] = useState(0.0);
  const [coin,setCoin] = useState("BTC");

  const preventMinus = (e) => {
    if (e.code === 'Minus') {
        e.preventDefault();
    }
};

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={props.setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          {/* <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span> */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 py-10"
                    >
                      Create new bot
                    </Dialog.Title>
                    <FormControl fullWidth>
                      <InputLabel>Coin</InputLabel>
                      <Select
                        value={coin}
                        label="Coin"
                        onChange={(e) => { 
                          setCoin(e.target.value);
                          props.setOpen(true)
                        }}
                      >
                        <MenuItem value={"BTC"}>BTC</MenuItem>
                        <MenuItem value={"ETH"}>ETH</MenuItem>
                        <MenuItem value={"DOGE"}>DOGE</MenuItem>
                        <MenuItem value={"LTC"}>LTC</MenuItem>
                        <MenuItem value={"SOL"}>SOL</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 2 }}>
                      <InputLabel htmlFor="outlined-adornment-amount">
                        Amount
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        value={amount && Math.max(0, amount)}
                        
                        startAdornment={
                          <InputAdornment position="start">$</InputAdornment>
                        }
                        label="Amount"
                        onChange={(e) => {
                          setAmount(Number(e.target.value));
                        }}
                        type="number"
                        min="1"
                        className="mt-10"
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    props.setOpen(false);
                    props.addBot(coin,amount);
                  }}
                >
                  Add Bot
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setAmount(0)
                    props.setOpen(false)
                  }}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default NewBotModal;
