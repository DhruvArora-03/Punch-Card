import axios from "axios";
import { setStateType } from "./types";

export async function apiWrapper(
  apiCall: () => Promise<void>,
  setError: setStateType<Error | null>,
  setIsLoading: setStateType<boolean>
) {
  setIsLoading(true);
  await apiCall()
    .catch((err) => setError(err))
    .then(() => setIsLoading(false));
}

export function handleStaleAuthorization(
  error: Error | null,
  signOut: () => boolean
) {
  if (axios.isAxiosError(error) && error.response?.status == 401) {
    signOut();
  }
}

export function snakeCaseToCapitalized(input: string) {
  return input
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
