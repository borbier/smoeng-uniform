import * as React from "react";
import { observer } from "mobx-react";
import { user_store } from "../../stores/user";
import { Formik, Form, Field, FieldArray } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "material-ui-formik-components/TextField";
import { Select } from "material-ui-formik-components/Select";
import {
  Paper,
  Box,
  colors,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Axios from "axios";
import { overlay_store } from "../../stores/overlay";
import { getUser, updateUser } from "../../services/user";

const useStyles = makeStyles((theme) => ({
  contact: {
    display: "flex",
    padding: "20px",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const departmentList = [
  "วิศวกรรมโทรคมนาคม",
  "วิศวกรรมอิเล็กทรอนิกส์",
  "วิศวกรรมไฟฟ้า",
  "วิศวกรรมคอมพิวเตอร์",
  "วิศวกรรมแมคคาทรอนิกส์และออโตเมชั่น",
  "วิศวกรรมเกษตรอัจฉริยะ",
  "วิศวกรรมอุตสาหการ",
  "วิศวกรรมเคมี",
  "วิศวกรรมโยธา",
  "วิศวกรรมเครื่องกล",
  "วิศวกรรมขนส่งทางราง",
  "[SIIE] Biomedical Engineering",
  "[SIIE] Computer Innovation Engineering",
  "[SIIE] Civil Engineering",
  "[SIIE] Chemical Engineering",
  "[SIIE] Electrical Engineering",
  "[SIIE] Engineering Management & Entrepreneurship",
  "[SIIE] Energy Engineering",
  "[SIIE] Financial Engineering",
  "[SIIE] Industrial Engineering & Logistics Management",
  "[SIIE] Mechanical Engineering",
  "[SIIE] Robotics & AI Engineering",
  "[SIIE] Software Engineering",
  "หลักสูตรปริญญาต่อเนื่อง",
];
const departmentLabel = departmentList.map((department, index) => {
  return { label: department, value: department };
});

interface ContactFormValue {
  telNumber: string;
  department: string;
  room: string;
}

const Contact = observer(() => {
  const classes = useStyles();
  const initialValues: ContactFormValue = {
    telNumber: user_store.telNumber,
    department: user_store.department,
    room: user_store.room,
  };
  const [editOn, setEditOn] = React.useState(true);

  const toggleEdit = () => setEditOn(!editOn);

  React.useEffect(() => {
    async function fetchUser() {
      const userData = await getUser(user_store.userId);
      console.log(userData);
      user_store.updateContact(
        userData.telNumber,
        userData.department,
        userData.room
      );
    }

    overlay_store.add();
    fetchUser();
    overlay_store.subtract();
  }, []);

  return (
    <Paper>
      <Box className={classes.contact}>
        <Box className={classes.header}>
          <h2>ข้อมูลส่วนตัว</h2>
          <IconButton onClick={toggleEdit}>
            <EditIcon />
          </IconButton>
        </Box>
        {editOn ? (
          <List>
            <ListItem>
              <ListItemText>เบอร์โทรศัพท์</ListItemText>
              <ListItemText>{user_store.telNumber}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>ภาควิชา</ListItemText>
              <ListItemText>{user_store.department}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>ห้อง</ListItemText>
              <ListItemText>{user_store.room}</ListItemText>
            </ListItem>
          </List>
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              overlay_store.add();
              await updateUser(user_store.userId, {
                telNumber: values.telNumber,
                department: values.department,
                room: values.room,
              });

              user_store.updateContact(
                values.telNumber,
                values.department,
                values.room
              );
              toggleEdit();

              overlay_store.subtract();
            }}
          >
            <Form>
              <ListItem>
                <Field
                  required
                  name={`telNumber`}
                  label="เบอร์โทรศัพท์"
                  component={TextField}
                  variant="outlined"
                />
              </ListItem>
              <ListItem>
                <Field
                  required
                  name={`department`}
                  label="ภาควิชา"
                  component={Select}
                  variant="outlined"
                  options={departmentLabel}
                />
              </ListItem>
              <ListItem>
                <Field
                  required
                  component={Select}
                  name={`room`}
                  label="ห้อง"
                  options={[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "4", label: "4" },
                    { value: "5", label: "5" },
                    { value: "6", label: "6" },
                    { value: "7", label: "7" },
                    { value: "8", label: "8" },
                    { value: "9", label: "9" },
                    { value: "10", label: "10" },
                    { value: "ไม่ทราบ", label: "ไม่ทราบ" },
                  ]}
                  variant="outlined"
                />
              </ListItem>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
              >
                อัปเดตข้อมูล
              </Button>
            </Form>
          </Formik>
        )}
      </Box>
    </Paper>
  );
});

export default Contact;
