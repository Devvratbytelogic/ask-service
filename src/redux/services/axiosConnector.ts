/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_BASE_URL } from "@/utils/config";
import axios from "axios";
import Cookies from "js-cookie"
import { notFound } from "next/navigation";

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'userID': '',
        'Authorization': `Bearer `,
    },
});

axiosInstance.interceptors.request.use((config:any) => {
  const token = Cookies.get('auth_token') || '';
  const deviceId = Cookies.get('device') || '';
  const userId = Cookies.get('userID') || '';

  config.headers['Authorization'] = `Bearer ${token}`;
  config.headers['device'] = deviceId;
  config.headers['userID'] = userId;

  return config;
}, (error:any) => {
  return Promise.reject(error);
});


export const axiosConnector = async (
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    end_point: string,
    bodyData: any = null,
    headers?: Record<string, any>,
    params?: Record<string, any>
) => {

    try {
        const response = await axiosInstance({
            method,
            url: end_point,
            data: bodyData,
            headers: {
                ...axiosInstance.defaults.headers.common,
                ...(headers || {}),
            },
            params,
        });
        return response?.data;
    } catch (error: any) {
        
        // console.error(`API Error at [${method.toUpperCase()} ${end_point}]`, error?.response || error);

        // Optional: Handle 404 using Next.js logic
        if (error?.response?.status === 404) {
            if (typeof window === "undefined") {
                // Server-side (e.g. Next.js)
                notFound()
                //throw new Error("NEXT_NOT_FOUND");
            } else {
                // Client-side
                window.location.href = "/404";
            }
        }

        throw error;
    }
};