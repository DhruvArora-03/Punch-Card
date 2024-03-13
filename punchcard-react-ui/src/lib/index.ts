import axios from "axios";
import { DisplayUser, InternalUser, setStateType } from "./types";

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

export function convertUserFromDisplay(user: DisplayUser) {
  const { hourly_pay: pay, ...rest } = user;

  return {
    hourly_pay_cents: Math.floor(pay * 100),
    ...rest,
  } satisfies InternalUser;
}
