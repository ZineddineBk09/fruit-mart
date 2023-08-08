/*import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const { accessToken } = (await getSession()) as any;
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: false,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const ApiSlice = createApi({
  reducerPath: "Api",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  }),
  endpoints: (builder) => ({
    refreshToken: builder.mutation<any, any>({
      query: (data) => ({
        url: `/auth/refresh-token`,
        method: "post",
        data,
      }),
    }),
    signUp: builder.mutation<any, any>({
      query: (data) => ({
        url: `/auth/register`,
        method: "post",
        data,
      }),
    }),
  }),
});

export const {
  useRefreshTokenMutation,
  useSignUpMutation,
} = ApiSlice;
*/

import { firebaseApp } from "@/firebase/clientApp";
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { getAuth } from "firebase/auth";

const firebaseBaseQuery =
  (
    { app }: { app: any } = { app: null }
  ): BaseQueryFn<
    {
      url: string;
      method: string;
      data?: any;
      params?: any;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const idToken = await user.getIdToken();

      const requestOptions = {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      return { data: result };
    } catch (error: any) {
      return {
        error: {
          status: null,
          data: error.message,
        },
      };
    }
  };

export const ApiSlice = createApi({
  reducerPath: "Api",
  baseQuery: firebaseBaseQuery({
    app: firebaseApp, // Replace with your Firebase app instance
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation<any, any>({
      query: (data) => ({
        url: `/auth/register`,
        method: "post",
        data,
      }),
    }),
  }),
});

export const { useSignUpMutation } = ApiSlice;
