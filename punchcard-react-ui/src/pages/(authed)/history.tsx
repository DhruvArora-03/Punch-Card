import { useFormik } from "Formik";
import { useState } from "react";
import { Form, FloatingLabel, Table } from "react-bootstrap";
import styles from "./history.module.css";
import Button from "components/Button";

const years = Array.from(
  { length: new Date().getFullYear() - 2016 },
  (_, index) => 2017 + index
);

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      month: "0",
      year: "2024", //new Date().getFullYear(),
    },
    onSubmit: async (values: any) => {
      {
      }
    },
  });

  return (
    <>
      <div className={styles.page}>
        <h1>View Shifts</h1>
        <Form className={styles.form} onSubmit={formik.handleSubmit}>
          <FloatingLabel label="Month">
            <Form.Select
              className={styles.select}
              id="month"
              onChange={formik.handleChange}
              value={formik.values.month}
            >
              <option value={0}>All Months</option>
              <option value={1}>January</option>
              <option value={2}>February</option>
              <option value={3}>March</option>
              <option value={4}>April</option>
              <option value={5}>May</option>
              <option value={6}>June</option>
              <option value={7}>July</option>
              <option value={8}>August</option>
              <option value={9}>September</option>
              <option value={10}>October</option>
              <option value={11}>November</option>
              <option value={12}>December</option>
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel label="Year">
            <Form.Select
              id="year"
              onChange={formik.handleChange}
              value={formik.values.year}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <Button
            className={styles.button}
            type="submit"
            loading={isLoading}
            text="&#128269; Search"
          />
        </Form>

        <Table striped>
          <thead>
            <tr>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Duration</th>
              <th>Your Notes</th>
              <th>Admin Notes</th>
            </tr>
          </thead>
          {/* <tbody>

          </tbody> */}
        </Table>
      </div>
    </>
  );
}
