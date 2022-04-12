import AuthenticationButton from "../../components/authenticationButton";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-24">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <NavLink to="/">
                    <img
                      className="h-12 w-12"
                      src="/logo.png"
                      alt="NeuraSearch"
                      style={{
                        borderRadius: "2rem",
                      }}
                    />
                  </NavLink>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <NavLink
                      exact
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-400 px-3 py-2 rounded-md text-xl font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-xl font-medium"
                      }
                    >
                      Market
                    </NavLink>
                    <NavLink
                      to="/portfolio"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-400 px-3 py-2 rounded-md text-xl font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-xl font-medium"
                      }
                    >
                      Portfolio
                    </NavLink>
                    <NavLink
                      to="/bots"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-400 px-3 py-2 rounded-md text-xl font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-xl font-medium"
                      }
                    >
                      Bots
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <AuthenticationButton />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                exact
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 px-3 py-2 rounded-md text-xl font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-xl font-medium"
                }
              >
                Market
              </NavLink>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/portfolio"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 px-3 py-2 rounded-md text-xl font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-xl font-medium"
                }
              >
                Portfolio
              </NavLink>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/bots"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 px-3 py-2 rounded-md text-xl font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-xl font-medium"
                }
              >
                Bots
              </NavLink>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
export default Navbar;
