"use client";

import Cookies from "js-cookie";
import { getFirebaseAuth } from "./FirebaseConfig";
import { getFcmTokenFromCookie } from "./getFcmTokenn";
import type { IGoogleLoginAPIResponse } from "@/redux/rtkQueries/authApi";
import { API_BASE_URL } from "@/utils/config";

export type GoogleLoginRoleType = "User" | "Vendor";

export const loginWithGoogle = async (
  roleType: GoogleLoginRoleType = "User"
): Promise<IGoogleLoginAPIResponse> => {
  try {
    const auth = await getFirebaseAuth();
    if (!auth) throw new Error("Firebase auth not supported in this environment");

    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const idToken = await user.getIdToken();

    // Cookies.set("auth_token", idToken, {
    //   secure: true,
    //   sameSite: "Strict",
    //   expires: 7,
    // });

    const fcmToken = typeof window !== "undefined" ? getFcmTokenFromCookie() : null;
    const response = await fetch(`${API_BASE_URL}/user/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        idToken,
        role_type: roleType,
        ...(fcmToken && { fcm_token: fcmToken }),
      }),
    });

    const data: IGoogleLoginAPIResponse = await response.json();
    if (!response.ok) {
      const err = new Error(data?.message ?? "Google login failed") as Error & {
        responseData?: IGoogleLoginAPIResponse & { data?: { flow?: string; phone_verified?: boolean } };
        googleEmail?: string;
      };
      err.responseData = data as IGoogleLoginAPIResponse & { data?: { flow?: string; phone_verified?: boolean } };
      if (response.status === 403 && (data as { data?: { flow?: string } })?.data?.flow === "PHONE_VERIFICATION_REQUIRED") {
        err.googleEmail = user.email ?? undefined;
      }
      throw err;
    }
    return data;
  } catch (error) {
    console.error("Login Failed", error);
    throw error;
  }
};
