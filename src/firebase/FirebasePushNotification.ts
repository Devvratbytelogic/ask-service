// import { useEffect, useState } from "react";
// import { getToken } from "firebase/messaging";
// import Cookies from "js-cookie";
// import { getMessagingInstance } from "./FirebaseConfig";
// import { FIREBASE_NOTIFICATION_KEY } from "../config";

// const useFcmToken = () => {
//   const [fcmToken, setFcmToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [permission, setPermission] = useState<NotificationPermission>("default");

//   useEffect(() => {
//     const requestToken = async () => {
//       try {
//         const permissionResult = await Notification.requestPermission();
//         setPermission(permissionResult);

//         if (permissionResult === "denied") {
//           setError("Notifications are blocked in your browser.");
//           return;
//         }

//         if (permissionResult !== "granted") {
//           setError("Notification permission not granted");
//           return;
//         }

//         // Use existing token from cookies if available
//         // const existingToken = Cookies.get("fcm_Token");
//         // if (existingToken) {
//         //   localStorage.setItem("fcm_Token", existingToken);
//         //   setFcmToken(existingToken);
//         //   return;
//         // }

//         const messaging = await getMessagingInstance();
//         if (!messaging) {
//           setError("Firebase Messaging not supported in this browser.");
//           return;
//         }

//         const token = await getToken(messaging, {
//           vapidKey: FIREBASE_NOTIFICATION_KEY,
//         });

//         if (token) {
//           localStorage.setItem("fcm_Token", token);
//           Cookies.set("fcm_Token", token, { expires: 7 });
//           setFcmToken(token);
//         } else {
//           setError("Failed to get FCM token");
//         }
//       } catch (err) {
//         console.error("FCM token error:", err);
//         const errorMessage = (err as { code?: string; message?: string });
//         if (errorMessage.code === "messaging/permission-blocked") {
//           setError("You have blocked notifications. Please allow them in browser settings.");
//         } else {
//           setError(errorMessage.message || "Unknown error occurred.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     requestToken();
//   }, []);

//   return {
//     fcmToken,
//     permission,
//     loading,
//     error,
//   };
// };

// export default useFcmToken;
