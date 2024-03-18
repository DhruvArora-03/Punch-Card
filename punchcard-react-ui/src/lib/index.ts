import axios from "axios";
import {
  ApiUser,
  DisplayUser,
  InternalUser,
  NewDisplayUser,
  setStateType,
} from "./types";

export async function hashPassword(password: string) {
  // encode
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  // hash
  return (
    window.crypto.subtle
      .digest("SHA-256", passwordBuffer)
      // decode
      .then((hashBuffer) =>
        Array.from(new Uint8Array(hashBuffer))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("")
      )
  );
}

export async function apiWrapper(
  apiCall: () => Promise<void>,
  setError: setStateType<Error | undefined>,
  setIsLoading: setStateType<boolean>
) {
  setIsLoading(true);
  await apiCall()
    .catch((err) => setError(err))
    .then(() => setIsLoading(false));
}

export function handleStaleAuthorization(
  error: Error | undefined,
  signOut: () => boolean
) {
  if (error && axios.isAxiosError(error) && error.response?.status == 401) {
    signOut();
  }
}

export function snakeCaseToCapitalized(input: string) {
  return input
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function convertUserToDisplay(user: InternalUser) {
  const { hourly_pay_cents: cents, ...rest } = user;

  return {
    hourly_pay: cents / 100,
    ...rest,
  } satisfies DisplayUser;
}

export function convertUserFromDisplayForApi(
  user: DisplayUser
) {
  const { hourly_pay: pay, ...rest } = user;

  return {
    hourly_pay_cents: Math.floor(pay * 100),
    ...rest,
  } satisfies ApiUser;
}
