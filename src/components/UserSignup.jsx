import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";

import Pattern from "../img/bg-login.svg";
import DefaultBtn from "./common/DefaultBtn";
import DefaultInput from "./common/DefaultInput";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validator.isEmail(formData.email)) {
      toast.error("Masukkan email yang valid");
      return;
    }

    if (
      !validator.isStrongPassword(formData.password, {
        minLength: 6,
        minSymbols: 0,
      })
    ) {
      toast.error(
        "Password minimal 6 karakter, mengandung huruf kapital dan angka"
      );
      return;
    }

    fetch("https://pharma-web-backend-nine.vercel.app/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const data = await response.json();
        const message = data.message;
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        toast.success(message + ". Silahkan Login");
        setTimeout(() => {
          navigate("/loginuser");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
    /* NOTE:
    data yg didapat dari fetch() adalah object dgn atribut "message".
    message dapat berisi: 
    "Failed! Username is already in use!"   (400)
    "Failed! Email is already in use!"      (400)
    "Failed! Role {...} does not exist!"    (400)
    errorException                          (500)
    "User was registered successfully!"
    */
  }

  return (
    <div
      className="w-full h-screen bg-putih bg-repeat bg-auto flex"
      style={{ backgroundImage: `url(${Pattern})` }}
    >
      <ToastContainer />
      <div className="w-[240px] sm:w-[500px] lg:w-[780px] bg-biru-muda/[.1] rounded-3xl backdrop-blur-sm shadow-3xl m-auto">
        <form className="flex flex-col items-center justify-center w-3/4 mx-auto my-[100px]">
          <DefaultInput
            placeholder="Username"
            className="w-full text-sm md:text-xl"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <DefaultInput
            type="email"
            placeholder="Email"
            className="w-full text-sm md:text-xl"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <DefaultInput
            placeholder="Password"
            className="w-full text-sm md:text-xl"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
          />

          <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-between w-full mt-4 sm:mt-12 gap-2 sm:gap-0">
            <Link to="/">
              <DefaultBtn
                type="button"
                judulButton="Kembali"
                className="text-sm lg:text-xl lg:w-[150px] lg:h-[52px] py-2 bg-white text-gray-400 outline outline-2 outline-gray-300 hover:text-biru-tua hover:border-4 hover:border-biru-tua hover:transition-all"
              />
            </Link>
            {/* <Link to="/loginuser"> */}
            <DefaultBtn
              type="submit"
              onClick={handleSubmit}
              judulButton="Daftar"
              className="text-putih text-sm lg:text-xl lg:w-[150px] lg:h-[52px] py-2 hover:bg-putih hover:text-biru-tua hover:border-4 hover:border-biru-tua hover:transition-all"
            />
            {/* </Link> */}
          </div>
        </form>
      </div>
    </div>
  );
}
