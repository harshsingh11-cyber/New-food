import React, { useState } from "react";
import Logo from "../img/logo.png";
import { GiShoppingBag } from "react-icons/gi";

import { BiLogOut, BiPlusCircle } from "react-icons/bi";
import Avatar from "../img/avatar.png";
import { motion } from "framer-motion";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase.config";
import { Link } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";

const Header = () => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [{ user, cartShow, cartItems }, dispatch] = useStateValue();

  const [isMenu, setisMenu] = useState(false);

  const login = async () => {
    if (!user) {
      const {
        user: { refreshToken, providerData },
      } = await signInWithPopup(firebaseAuth, provider);
      dispatch({
        type: actionType.SET_USER,
        user: providerData[0],
      });
      localStorage.setItem("user", JSON.stringify(providerData[0]));
    } else {
      setisMenu(!isMenu);
    }
  };
  const logout = () => {
    setisMenu(false);
    localStorage.clear();
    dispatch({
      type: actionType.SET_USER,
      user: null,
    });
  };
  const showCart = () => {
    dispatch({
      type: actionType.SET_CART_SHOW,
      cartShow: !cartShow,
    });
  };
  return (
    <header className="fixed z-50 w-screen p-3 px-4 md:p-6 md:px-16 bg-primary">
      <div className="hidden md:flex w-full h-full justify-between">
        <Link to={"/"} className="flex items-center gap-2">
          <img src={Logo} className="w-14 h-10 object-cover" alt="logo" />
          <p className="text-headingColor text-xl font-bold">Harsh Foodie Zone</p>
        </Link>
        <div className="flex justify-center gap-9">
          <ul className="flex items-center gap-8  ml-auto">
            <li className="text-base text-textColor hover:text-slate-900 hover:scale-105 duration-100 transition-all ease-in-out cursor-pointer">
              Home
            </li>
            <li className="text-base text-textColor hover:text-slate-900 hover:scale-105 duration-100 transition-all ease-in-out cursor-pointer">
              Menu
            </li>
            <li className="text-base text-textColor hover:text-slate-900 hover:scale-105 duration-100 transition-all ease-in-out cursor-pointer">
              About Us
            </li>
            <li className="text-base text-textColor hover:text-slate-900 hover:scale-105 duration-100 transition-all ease-in-out cursor-pointer">
              Services
            </li>
          </ul>
          <div
            className="relative flex items-center justify-center group cursor-pointer"
            onClick={showCart}
          >
            <GiShoppingBag className="text-textColor text-2xl " />
            {cartItems && cartItems.length > 0 && (
              <div className="group-hover:scale-110 transition-all duration-150 w-4 h-4 rounded-full bg-cartNumBg absolute top-1 -right-1  cursor-pointer">
                <p className="text-xs text-white transition-all duration-150 font-semibold flex items-center justify-center ">
                  {cartItems.length}
                </p>
              </div>
            )}
          </div>
          <div className="relative">
            <motion.img
              whileTap={{ scale: 0.6 }}
              className="w-10 h-10 min-h-[40px] min-w-[40px] shadow-2xl cursor-pointer rounded-full"
              src={user ? user.photoURL : Avatar}
              alt="profileImage"
              onClick={login}
            />
            {isMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0 py-2"
              >
                {user && user.email === "benakabp@gmail.com" && (
                  <Link to={"/createItem"}>
                    <p
                      className=" px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base "
                      onClick={() => {
                        setisMenu(false);
                      }}
                    >
                      New Item <BiPlusCircle />
                    </p>
                  </Link>
                )}

                <p
                  className=" px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                  onClick={logout}
                >
                  Logout <BiLogOut />
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <div className="flex md:hidden w-full h-full items-center justify-between">
        <div
          className="relative flex items-center justify-center group cursor-pointer "
          onClick={showCart}
        >
          <GiShoppingBag className="text-textColor text-2xl " />
          {cartItems && cartItems.length > 0 && (
            <div className="group-hover:scale-110 transition-all duration-150 w-4 h-4 rounded-full bg-cartNumBg absolute -top-1 -right-2  cursor-pointer">
              <p className="text-xs text-white transition-all duration-150 font-semibold flex items-center justify-center ">
                {cartItems.length}
              </p>
            </div>
          )}
        </div>
        <Link to={"/"} className="flex items-center gap-2">
          <img src={Logo} className="w-14 h-10 object-cover" alt="logo" />
          <p className="text-headingColor text-xl font-bold">The Foodie Zone</p>
        </Link>
        <div className="relative">
          <motion.img
            whileTap={{ scale: 0.6 }}
            className="w-10 h-10 min-h-[40px] min-w-[40px] shadow-2xl cursor-pointer rounded-full"
            src={user ? user.photoURL : Avatar}
            alt="profileImage"
            onClick={login}
          />
          {isMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0 py-2"
            >
              {user && user.email === "benakabp@gmail.com" && (
                <Link to={"/createItem"}>
                  <p className=" px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base">
                    New Item <BiPlusCircle />
                  </p>
                </Link>
              )}
              <ul className="flex flex-col  gap-4  px-4 py-2 ">
                <li
                  className="text-base text-textColor hover:text-slate-900 cursor-pointer "
                  onClick={() => {
                    setisMenu(false);
                  }}
                >
                  Home
                </li>
                <li
                  className="text-base text-textColor hover:text-slate-900 cursor-pointer "
                  onClick={() => {
                    setisMenu(false);
                  }}
                >
                  Menu
                </li>
                <li
                  className="text-base text-textColor hover:text-slate-900 cursor-pointer "
                  onClick={() => {
                    setisMenu(false);
                  }}
                >
                  About Us
                </li>
                <li
                  className="text-base text-textColor hover:text-slate-900 cursor-pointer "
                  onClick={() => {
                    setisMenu(false);
                  }}
                >
                  Services
                </li>
              </ul>

              <p
                className="m-2 p-2  rounded-md shadow-md flex items-center justify-center bg-gray-200 gap-2 cursor-pointer hover:bg-slate-300 transition-all duration-100 ease-in-out text-textColor text-base"
                onClick={logout}
              >
                Logout <BiLogOut />
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
