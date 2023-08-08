"use client";
import React from "react";
import Logo from "../shared/Logo";
import Link from "next/link";
import { Divider } from "@mui/material";
import {
  FacebookRegisterButton,
  GoogleRegisterButton,
} from "../auth/authButtons";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FacebookSignInButton, GoogleSignInButton } from "../auth/authButtons";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { hashPass } from "@/utils";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("الرجاء إدخال اسم المستخدم").min(5),
      email: Yup.string()
        .email("الرجاء إدخال بريد إلكتروني صالح")
        .required("الرجاء إدخال البريد الإلكتروني"),
      password: Yup.string()
        .required("الرجاء ادخال كلمة المرور")
        .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
    }),

    onSubmit: async (values) => {
      try {
        // check if user already exists
        setLoading(true);
        const q = query(
          collection(firestore, "users"),
          where("email", "==", values.email)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
          setLoading(false);
          setError("البريد الإلكتروني مستخدم بالفعل");
          return;
        }

        const hashedPassword = await hashPass(values.password);

        await addDoc(collection(firestore, "users"), {
          email: values.email,
          password: hashedPassword,
          username: values.username,
          role: "user",
          date: new Date(),
        }).then((docRef) => {
          if (docRef) {
            signIn("fruit-mart", {
              email: values.email,
              password: values.password,
              callbackUrl: "/",
            });
            //            router.push("/");
          }
        });
      } catch (error) {
        toast.error(" حدث خطأ ما ، يرجى إعادة تحميل الصفحة");
        setError(" حدث خطأ ما ، يرجى إعادة تحميل الصفحة");
      }
    },
  });

  return (
    <section className="bg-gray-50 dark:bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-fit lg:py-0">
        <Logo />
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border">
          <div className="w-full p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900  md:text-2xl text-center">
              إفتح حساب الأن{" "}
            </h1>
            {/* google & facebook login */}
            <div className="flex items-center justify-between">
              {/* <FacebookSignInButton /> */}
              <GoogleSignInButton />
            </div>

            <div className="w-full flex items-center justify-between mt-4">
              <Divider className="w-1/3" />
              <span className="text-sm text-gray-500">أو</span>
              <Divider className="w-1/3" />
            </div>

            <form
              className="w-full flex flex-col space-y-4 md:space-y-6"
              onSubmit={formik.handleSubmit}
            >
              {/* error */}
              {error && (
                <span className="w-full text-center transition-all duration-300 bg-red-100 text-xs text-red-500 rounded p-2 mx-auto">
                  {error}
                </span>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-900 ">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="اسم المستخدم"
                  className={
                    "bg-gray-50 border border-gray-300 text-slate-900 sm:text-sm rounded-lg block w-full p-2.5 outline-none" +
                    " " +
                    (formik.touched.username && formik.errors.username
                      ? "border border-red-500"
                      : "")
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username ? (
                  <span className="w-full transition-all duration-300 text-xs text-red-500 rounded py-1 px-2 mx-auto">
                    {formik.errors.username}
                  </span>
                ) : null}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-900 ">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@company.com"
                  className={
                    "bg-gray-50 border border-gray-300 text-slate-900 sm:text-sm rounded-lg block w-full p-2.5 outline-none" +
                    " " +
                    (formik.touched.email && formik.errors.email
                      ? "border border-red-500"
                      : "")
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <span className="w-full transition-all duration-300 text-xs text-red-500 rounded py-1 px-2 mx-auto">
                    {formik.errors.email}
                  </span>
                ) : null}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-900 ">
                  كلمة المرور
                </label>
                <div
                  className={
                    "flex items-center bg-gray-50 border border-gray-300 rounded-lg w-full " +
                    " " +
                    (formik.touched.password && formik.errors.password
                      ? "border border-red-500"
                      : "")
                  }
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className=" text-slate-900 sm:text-sm w-full p-2.5 bg-gray-50 outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />

                  <button
                    type="button"
                    className="bg-gray-50"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 ml-3 text-gray-400" />
                    ) : (
                      <EyeIcon className="w-5 h-5 ml-3 text-gray-400" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <span className="w-full transition-all duration-300 text-xs text-red-500 rounded py-1 px-2 mx-auto">
                    {formik.errors.password}
                  </span>
                ) : null}
              </div>

              <button
                type="submit"
                className={
                  "w-full text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer" +
                  " " +
                  (formik.errors.email ||
                  formik.errors.password ||
                  formik.errors.username ||
                  formik.isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600")
                }
                disabled={formik.isSubmitting}
              >
                {!formik.isSubmitting ? "إرسال" : "... إنشاء حساب"}
              </button>

              <p className="text-sm font-light text-gray-500">
                لديك حساب؟{" "}
                <Link
                  href="/login"
                  className="font-medium text-slate-700 hover:underline"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
