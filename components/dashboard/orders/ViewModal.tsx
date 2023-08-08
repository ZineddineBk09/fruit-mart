import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Tooltip } from "@mui/material";
import { firestore } from "@/firebase/clientApp";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Order } from "@/interfaces/orders";
import { EyeIcon } from "@heroicons/react/20/solid";
import { displayDateAndTime, fetchOrder } from "@/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  id: string;
  refresh: () => void;
};

export default function ViewModal({ id, refresh }: Props) {
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState<Order>({} as Order);
  const [showItems, setShowItems] = React.useState(false);
  const formik = useFormik({
    initialValues: {
      order_status: "",
    },

    validationSchema: Yup.object({
      order_status: Yup.string().required("حقل مطلوب"),
    }),

    onSubmit: async (values) => {
      // update the order doc on firestore
      await updateDoc(doc(firestore, "orders", id.toString()), {
        order_status: values.order_status,
      })
        .then(() => {
          // refresh the orders list
          refresh();
          // close the modal
          handleClose();
          toast.done("تم تعديل السجل بنجاح");
        })
        .catch((error) => {
          toast.error("حدث خطأ ما");
        });
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (open) fetchOrder(id, setOrder);
    formik.setValues({
      order_status: order.order_status ? order.order_status : "",
    });
  }, [open]);


  return (
    <div>
      <Tooltip title="عرض">
        <button onClick={handleClickOpen}>
          <EyeIcon className="text-gray-400 w-6 h-6 mr-3" />
        </button>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            width: "600px",
          },
        }}
      >
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-2 justify-evenly w-full h-full">
              <h4 className="col-span-2 font-semibold">المعلومات الشخصية</h4>
              <div className="flex items-center text-slate-800 text-sm">
                <label className="ml-2 ">الوقت:</label>
                <p>
                  {order?.order_date ? (
                    <>
                      {displayDateAndTime(order?.order_date.seconds as number)}
                    </>
                  ) : (
                    "لا يوجد"
                  )}
                </p>
              </div>

              <div className="flex items-center text-slate-800 text-sm">
                <label className="ml-2 ">الاسم:</label>
                <p>{order.name ? order.name : "لا يوجد"}</p>
              </div>

              <div className="flex items-center text-slate-800 text-sm">
                <label className="ml-2 ">البريد الالكتروني:</label>
                <p>{order.email ? order.email : "لا يوجد"}</p>
              </div>

              <div className="flex items-center text-slate-800 text-sm">
                <label className="ml-2 ">رقم الهاتف:</label>
                <p>{order.phone ? order.phone : "لا يوجد"}</p>
              </div>

              <h4 className="col-span-2 mt-4 font-semibold">معلومات العنوان</h4>
              <div className="flex items-center text-slate-800 text-sm">
                <label className="ml-2 ">المنطقة:</label>
                <p>{order.area ? order.area : "لا يوجد"}</p>
              </div>
              <div className="flex items-center text-slate-800 text-sm">
                <label className="ml-2 ">الامارة:</label>
                <p>{order.emirate ? order.emirate : "لا يوجد"}</p>
              </div>
              <div className="flex items-center text-slate-800 text-sm">
                <label className="ml-2 ">العنوان:</label>
                <p>{order.location ? order.location : "لا يوجد"}</p>
              </div>
              <div className="flex items-center text-slate-800 text-sm">
                <label className="ml-2 ">رقم الفيلا/الشقة:</label>
                <p>
                  {order.villa_flat_number
                    ? order.villa_flat_number
                    : "لا يوجد"}
                </p>
              </div>

              <h4 className="col-span-2 mt-4 font-semibold">معلومات الطلب</h4>
              <div className="flex items-center">
                <label className="ml-2 ">حالة الطلب:</label>
                <select
                  id="order_status"
                  name="order_status"
                  className={
                    "bg-white border outline-none w-full px-2 rounded-md !text-slate-900 flex-1 text-sm lg:px-3"
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.order_status}
                >
                  <option value="قيد الانتظار">قيد الانتظار</option>
                  <option value="تم التسليم">تم التسليم</option>
                  <option value="تم الرفض">تم الرفض</option>
                </select>
              </div>

              <div className="flex items-center text-slate-800 text-sm">
                <label className="ml-2 ">السعر الكلي:</label>
                <p>
                  {order.total_price ? order.total_price : "لا يوجد"}{" "}
                  <span className="text-xs">دينار</span>
                </p>
              </div>

              <div className="flex items-start text-slate-800 text-sm col-span-2">
                <label className="ml-1 ">المنتجات</label>
                <Button onClick={() => setShowItems(!showItems)}>
                  <ChevronDownIcon
                    className={
                      "w-5 transition-all duration-300" +
                      " " +
                      (showItems ? "transform rotate-180" : "")
                    }
                  />
                </Button>
                {showItems && (
                  <div>
                    {order.order_items
                      ? order.order_items.map((item, index) => (
                          <CartItem key={index} product={item} />
                        ))
                      : "لا يوجد"}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex items-center justify-evenly mt-6">
              <Button
                type="submit"
                className="!bg-green-500 !text-white hover:!bg-green-400"
              >
                تعديل
              </Button>
              <Button
                onClick={handleClose}
                className="!bg-red-500 !text-white hover:!bg-red-400"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const CartItem = ({ product }: { product: any }) => {
  return (
    <li key={product.id} className="flex mb-3">
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          width={24}
          height={24}
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="mr-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link href={"/products/" + product?.id}>{product.name}</Link>
            </h3>
            <p className="mr-4">
              {product.price} <small>دينار</small>
            </p>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500">الكمية: {product.quantity}</p>
        </div>
      </div>
    </li>
  );
};
