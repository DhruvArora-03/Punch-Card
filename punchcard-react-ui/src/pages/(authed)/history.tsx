import { useFormik } from "Formik";
import { useState } from "react";
import { Form, InputGroup, Table } from "react-bootstrap";
import styles from "./history.module.css";
import Button from "components/Button";
import axios, { AxiosResponse } from "axios";
import { useAuthHeader } from "react-auth-kit";
import { formatDuration, historyRowType } from "lib";

const years = Array.from(
  { length: new Date().getFullYear() - 2016 },
  (_, index) => 2017 + index
);

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
};

export default function HistoryPage() {
  const authHeader = useAuthHeader();
  const [data, setData] = useState<historyRowType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      month: "0",
      year: "2024", //new Date().getFullYear(),
    },
    onSubmit: async (values: any) => {
      setIsLoading(true)
      await axios.get(`http://localhost:8080/shift-history/${values.month}/${values.year}`,
        { headers: { Authorization: authHeader() } } // request config
      )
        .then((response: AxiosResponse) => response.data)
        .then((data) => {
          console.log(data)
          setData(data.map((d: any) => {
            const clock_in_time = new Date(d.ClockIn)
            const clock_out_time = new Date(d.ClockOut)
            return {
              key: clock_in_time.getTime(),
              clock_in_time: clock_in_time.toLocaleString('en-US', options),
              clock_out_time: clock_out_time.toLocaleString('en-US', options),
              duration: formatDuration(clock_out_time.getTime() - clock_in_time.getTime()),
              user_notes: d.UserNotes,
              admin_notes: d.AdminNotes
            }
          }))
        })
      setIsLoading(false)
    },
  });

  return (
    <>
      <div className={styles.page}>
        <h1>Shift History</h1>
        <Form className={styles.form} onSubmit={formik.handleSubmit}>
          <div>
            <InputGroup>
              <InputGroup.Text> Month: </InputGroup.Text>
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
            </InputGroup>
            <InputGroup className={styles.input}>
              <InputGroup.Text> Year: </InputGroup.Text>
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
            </InputGroup>
          </div>
          <Button
            className={styles.button}
            type="submit"
            loading={isLoading}
            text="&#128269; Search"
          />
        </Form>

        <Table striped hover bordered>
          <thead>
            <tr>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Duration</th>
              <th>Your Notes</th>
              <th>Admin Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) =>
              <tr key={row.key}>
                <td>{row.clock_in_time}</td>
                <td>{row.clock_out_time}</td>
                <td>{row.duration}</td>
                <td>{row.user_notes}</td>
                <td>{row.admin_notes}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}
