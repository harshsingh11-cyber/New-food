import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
  MdAttachMoney,
} from "react-icons/md";
import { categories } from "../utils/data";
import Loader from "./Loader";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase.config";
import { saveItem } from "../utils/firebaseFunctions";
import { useStateValue } from "../context/StateProvider";
import { getAllFoodItems } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";

const CreateContainer = () => {
  const [title, settitle] = useState("");
  const [calories, setcalories] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState(null);
  const [imageAsset, setimageAsset] = useState(null);
  const [fields, setfields] = useState(false);
  const [alertStatus, setalertStatus] = useState("danger");
  const [msg, setmsg] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [{ foodItems }, dispatch] = useStateValue();

  const uploadImage = (e) => {
    setisLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        setfields(true);
        setmsg("Error while uploading : Try Again");
        setalertStatus("danger");
        setTimeout(() => {
          setfields(false);
          setisLoading(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setimageAsset(downloadURL);
          setisLoading(false);
          setfields(true);
          setmsg("Image Uploaded Successfully");
          setalertStatus("success");
          setTimeout(() => {
            setfields(false);
          }, 4000);
        });
      }
    );
  };
  const deleteImage = () => {
    setisLoading(true);
    const deleteRef = ref(storage, imageAsset);
    deleteObject(deleteRef).then(() => {
      setimageAsset(null);
      setisLoading(false);
      setfields(true);
      setmsg("Image deleted Successfully");
      setTimeout(() => {
        setfields(false);
      }, 4000);
    });
  };
  const saveDetails = () => {
    setisLoading(true);
    try {
      if (!title || !calories || !imageAsset || !price || !category) {
        setfields(true);
        setmsg("Required Fileds Can't be empty");
        setalertStatus("danger");
        setTimeout(() => {
          setfields(false);
          setisLoading(false);
        }, 4000);
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          imageURL: imageAsset,
          category: category,
          calories: calories,
          qty: 1,
          price: price,
          star: 5,
        };
        saveItem(data);
        setfields(true);
        setisLoading(false);
        clearData();
        setmsg("Data Uploaded successfully");
        setalertStatus("success");
        setTimeout(() => {
          setfields(false);
        }, 4000);
      }
    } catch (error) {
      setfields(true);
      setmsg("Error while uploading : Try Again");
      setalertStatus("danger");
      setTimeout(() => {
        setfields(false);
        setisLoading(false);
      }, 4000);
    }
    fetchData();
  };
  const clearData = () => {
    settitle("");
    setimageAsset(null);
    setcalories("");
    setprice("");
    setcategory("Select Category");
  };
  const fetchData = async () => {
    await getAllFoodItems().then((data) => {
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        foodItems: data,
      });
    });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-[90%] md:w-[75%] border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
        {fields && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
              alertStatus === "danger"
                ? "bg-red-400 text-red-800"
                : "bg-emerald-400 text-emerald-800"
            }`}
          >
            {msg}
          </motion.p>
        )}
        <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
          <MdFastfood className="text-xl text-gray-700" />
          <input
            onChange={(e) => {
              settitle(e.target.value);
            }}
            className="w-full h-full text-lg bg-transparent text-textColor  outline-none border-none placeholder:text-gray-400"
            type="text"
            required
            value={title}
            placeholder="Give me a title..."
          />
        </div>
        <div className="w-full">
          <select
            onChange={(e) => setcategory(e.target.value)}
            className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
          >
            <option value={category} className="bg-white">
              Select Category
            </option>
            {categories &&
              categories.map((item) => (
                <option
                  key={item.id}
                  className="text-base border-0 outline-none capitalize bg-white text-textColor"
                  value={item.urlParamName}
                >
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <div className="goup flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-225 md:h-420 cursor-pointer rounded-lg">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {!imageAsset ? (
                <>
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 ">
                      <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                      <p className="text-gray-500  hover:text-gray-700">
                        Click Here to upload
                      </p>
                    </div>
                    <input
                      type="file"
                      name="uploadimage"
                      accept="image/*"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="relative h-full">
                    <img
                      src={imageAsset}
                      alt="Uploaded image"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                      onClick={deleteImage}
                    >
                      <MdDelete className="text-white" />
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="w-full flex flex-col md:flex-row items-center gap-3 ">
          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <MdFoodBank className="text-gray-700 text-2xl" />
            <input
              type="text"
              required
              placeholder="Calories"
              className="w-full h-full text-lg bg-transparent outline-none border-none text-textColor placeholder:text-gray-400"
              value={calories}
              onChange={(e) => setcalories(e.target.value)}
            />
          </div>
          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <MdAttachMoney className="text-gray-700 text-2xl" />
            <input
              type="text"
              required
              placeholder="Price"
              className="w-full h-full text-lg bg-transparent outline-none border-none text-textColor placeholder:text-gray-400"
              value={price}
              onChange={(e) => setprice(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center w-full">
          <button
            type="button"
            className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
            onClick={saveDetails}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContainer;
