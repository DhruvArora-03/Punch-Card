export type setStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type HistoryRowType = {
  key: number;
  clock_in_time: string;
  clock_out_time: string;
  duration: string;
  user_notes: string;
  admin_notes: string;
};

export type InternalUser = {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  hourly_pay_cents: number;
  role: string;
  preferred_payment_method: string;
};

// swap out cents for normal and take out user_id
export type DisplayUser = Omit<InternalUser, "hourly_pay_cents"> & {
  hourly_pay: number;
};

export type FormItemProps = {
  label?: string;
  field_id: keyof DisplayUser;
};
