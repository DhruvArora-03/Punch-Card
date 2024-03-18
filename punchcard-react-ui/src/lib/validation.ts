import * as Yup from "yup";

const GenericStringSchema = Yup.string()
  .required()
  .min(3, "Too Short!")
  .max(63, "Too Long!");
const HourlyPaySchema = Yup.number()
  .required()
  .test(
    "is-currency",
    "Only up to 2 decimals",
    (value) => value * 100 === Math.floor(value * 100)
  );
const PaymentMethodSchema = Yup.string().required().max(255, "Too Long!");

export const NewUserSchema = Yup.object().shape({
  username: GenericStringSchema,
  password: GenericStringSchema,
  first_name: GenericStringSchema,
  last_name: GenericStringSchema,
  hourly_pay: HourlyPaySchema,
  role: GenericStringSchema,
  preferred_payment_method: PaymentMethodSchema,
});
