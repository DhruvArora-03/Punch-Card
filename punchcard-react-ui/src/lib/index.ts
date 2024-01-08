import axios from "axios"

export type setStateType<T> = React.Dispatch<React.SetStateAction<T>>

export async function apiWrapper(callback: () => Promise<void>,
  setError: setStateType<Error | null>,
  setIsLoading: setStateType<boolean>
) {
  setIsLoading(true)
  setError(null)
  await callback()
    .catch((err) => {
      setError(err)
      !(axios.isAxiosError(err) && err.response?.status == 401) && console.log(err)
    })
  setIsLoading(false)
}