import React, { useEffect, useRef, useState } from "react";
import { GiShoppingBag } from "react-icons/gi";
import { motion } from "framer-motion";
import Rating from "@mui/material/Rating";
import NotFound from "../img/NotFound.svg";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase.config";
import { useStateValue } from "../context/StateProvider";
import { getAllFoodItems } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";

const RowContainer = ({ flag, data, scrollValue }) => {
  const [{ cartItems,user }, dispatch] = useStateValue();
  const [items, setItems] = useState([]);

  const rowContainer = useRef();

  const handleStar = async (id, newValue) => {
    await updateDoc(
      doc(firestore, "foodItems", `${id}`),
      {
        star: newValue,
      },
      { merge: true }
    );
    fetchData();
  };
  const fetchData = async () => {
    await getAllFoodItems().then((data) => {
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        foodItems: data,
      });
    });
  };

  useEffect(() => {
    rowContainer.current.scrollLeft += scrollValue;
  }, [scrollValue]);
  useEffect(() => {
    addtoCart();
  }, [items]);

  const addtoCart = () => {
    dispatch({
      type: actionType.SET_CARTITEMS,
      cartItems: items,
    });
    localStorage.setItem("cartItems", JSON.stringify(items));
  };
  return (
    <div
      ref={rowContainer}
      className={`w-full my-6 md:my-12 flex items-center gap-3 scroll-smooth ${
        flag
          ? "overflow-x-scroll scrollbar-none"
          : " items-center justify-center flex-wrap"
      }`}
    >
      {data && data.length > 0 ? (
        data.map((item) => (
          <div
            key={item.id}
            className="w-225 min-w-[225px] md:w-300 md:min-w-[300px] h-auto bg-cardOverlay rounded-lg my-3 md:my-12 p-2 backdrop-filter backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-between"
          >
            <div className="w-full flex items-center justify-between">
              <motion.img
                whileHover={{ scale: 1.2 }}
                src={item?.imageURL}
                alt=""
                className="w-40 h-40 -mt-8 drop-shadow-2xl object-contain"
              />
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md"
                onClick={() => {
                  !cartItems.includes(item) && setItems([...cartItems, item]);
                }}
              >
                <GiShoppingBag className="text-white" />
              </motion.div>
            </div>
            <div className="w-full flex items-center justify-between ">
              <div className="w-3 md:w-12">
                <Rating
                  name="simple-controlled"
                  value={item.star}
                  disabled={user? false: true}
                  precision={0.5}
                  onChange={(event, newValue) => {
                    handleStar(item.id, newValue);
                  }}
                />
              </div>
              <div className="w-full flex flex-col items-end justify-end">
                <p className="text-textColor font-semibold text-base md:text-lg">
                  {item?.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {item?.calories} Calories
                </p>
                <div className="flex items-center gap-8">
                  <p className="text-lg text-headingColor font-semibold">
                    <span className="text-sm text-red-500">$</span>
                    {item?.price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <img src={NotFound} className="w-300" />
          <p className="text-xl text-headingColor font-semibold my-2">
            Items not Available
          </p>
        </div>
      )}
    </div>
  );
};

export default RowContainer;
