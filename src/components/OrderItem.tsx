import * as React from "react";
import { Grid, Paper, Box, makeStyles, IconButton } from "@material-ui/core";
import Product from "../types/product";

import CropFreeIcon from "@material-ui/icons/CropFree";
import DeleteIcon from "@material-ui/icons/Delete";
import Axios from "axios";
import { observer } from "mobx-react";
import { user_store } from "../stores/user";
import QRDialog from "./QRDialog";

function displayStatus(status: string) {
  switch (status) {
    case "unpaid":
      return "ยังไม่จ่าย";
    case "ready":
      return "สินค้าพร้อมรับ";
    case "completed":
      return "การสั่งซื้อสำเร็จ";
    default:
      return "";
  }
}

const useStyles = makeStyles((theme) => ({
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

const OrderItem = observer((props: Props) => {
  const classes = useStyles();
  const [orders, setOrders] = React.useState([]);
  const [qrOrder, setQrOrder] = React.useState("");
  const [qrOpen, setQrOpen] = React.useState(false);

  React.useEffect(() => {
    async function getOrders() {
      const newData = (
        await Axios.get(
          `https://asia-northeast1-uniform-smoeng.cloudfunctions.net/api/orders/${user_store.userId}`
        )
      ).data;
      setOrders(newData);
      console.log(newData);
    }

    getOrders();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        {orders.map((orderItem, index) => (
          <Grid item xs={12} sm={6}>
            <Paper>
              <Box padding="10px 20px">
                <Box className={classes.head}>
                  <h4>{index + 1}</h4>
                  <Box>
                    <IconButton
                      onClick={() => {
                        setQrOrder(orderItem.id);
                        setQrOpen(true);
                      }}
                    >
                      <CropFreeIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        console.log("Delete");
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {orderItem.orders.map((item: Product, index: any) => (
                  <li>
                    {item.product} ขนาด {item.size} จำนวน {item.amount} ตัว
                  </li>
                ))}
                <p>สถานะ : {displayStatus(orderItem.status)}</p>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <QRDialog
        open={qrOpen}
        userId={user_store.userId}
        orderId={qrOrder}
        onClose={() => {
          setQrOpen(false);
        }}
      />
    </>
  );
});

export default OrderItem;
