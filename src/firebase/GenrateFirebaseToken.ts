import { getFirebaseAuth } from "./FirebaseConfig";

export const getFirebaseToken = async (): Promise<string | null> => {
  const auth = await getFirebaseAuth();
  if (!auth) return null;

  const user = auth.currentUser;

  if (!user) return null;

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error fetching Firebase ID token:", error);
    return null;
  }
};
