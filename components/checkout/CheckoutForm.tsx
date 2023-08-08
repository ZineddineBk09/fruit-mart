import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addDocument } from "@/utils";
import { useSession } from "next-auth/react";
import { clearCart } from "@/redux/slices/cart";

const CheckOutForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const total = useAppSelector((state) => state.cart.total);
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: session?.user?.email || "",
      phone: "",
      emirate: "",
      area: "",
      villa_flat_number: "",
      location: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("الاسم حقل مطلوب."),
      email: Yup.string()
        .email("البريد الالكتروني غير صحيح.")
        .required("البريد الالكتروني حقل مطلوب."),
      phone: Yup.string()
        .matches(/^[0-9]+$/, "رقم الهاتف يجب ان يكون ارقام فقط")
        .required("رقم الهاتف حقل مطلوب."),
      emirate: Yup.string().required("الامارة حقل مطلوب."),
      area: Yup.string().required("المنطقة حقل مطلوب."),
      villa_flat_number: Yup.string().required("رقم الفيلا/الشقة حقل مطلوب."),
      location: Yup.string().required("الموقع حقل مطلوب."),
    }),

    onSubmit: async (values) => {
      try {
        addDocument(
          "orders",
          {
            ...values,
            order_items: items,
            total_price: total,
            order_date: new Date(),
            order_status: "قيد الانتظار",
          },
          () => {
            toast.success("تم ارسال الطلب بنجاح");
            dispatch(clearCart());
            router.push("/");
          }
        );
      } catch (error) {
        toast.error("حدث خطأ ما، يرجى ملء طلبك مرة أخرى");
      }
    },
  });

  return (
    <div className="w-full mx-auto h-auto flex flex-col gap-5 items-start justify-evenly px-4 py-6 rounded-lg ">
      <h3 className="text-xl font-bold mb-3">ادخل بياناتك</h3>

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-5 items-start justify-evenly w-full h-full"
      >
        <h4 className="col-span-2">المعلومات الشخصية</h4>
        <div className="grid grid-cols-2 gap-2 justify-evenly w-full h-full">
          <div>
            <input
              id="name"
              name="name"
              type="text"
              className={
                "relative w-full h-10 px-4 text-sm border outline-none rounded" +
                " " +
                (formik.touched.name && formik.errors.name
                  ? "border border-red-500"
                  : "")
              }
              placeholder="الاسم"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <small className="text-red-500 text-xs">
                {formik.errors.name}
              </small>
            ) : null}
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="text"
              className="relative w-full h-10 px-4 text-gray-600 text-sm border outline-none rounded"
              value={session?.user?.email || ""}
            />
          </div>

          <div>
            <input
              id="phone"
              name="phone"
              type="text"
              className={
                "relative w-full h-10 px-4 text-sm border outline-none rounded" +
                " " +
                (formik.touched.phone && formik.errors.phone
                  ? "border border-red-500"
                  : "")
              }
              placeholder="رقم الهاتف"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <small className="text-red-500 text-xs">
                {formik.errors.phone}
              </small>
            ) : null}
          </div>
          <h4 className="col-span-2 my-4">معلومات العنوان</h4>
          <div>
            <input
              id="emirate"
              name="emirate"
              type="text"
              className={
                "relative w-full h-10 px-4 text-sm border outline-none rounded" +
                " " +
                (formik.touched.emirate && formik.errors.emirate
                  ? "border border-red-500"
                  : "")
              }
              placeholder="الامارة"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.emirate}
            />
            {formik.touched.emirate && formik.errors.emirate ? (
              <small className="text-red-500 text-xs">
                {formik.errors.emirate}
              </small>
            ) : null}
          </div>
          <div>
            <input
              id="area"
              name="area"
              type="text"
              className={
                "relative w-full h-10 px-4 text-sm border outline-none rounded" +
                " " +
                (formik.touched.area && formik.errors.area
                  ? "border border-red-500"
                  : "")
              }
              placeholder="المنطقة"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.area}
            />
            {formik.touched.area && formik.errors.area ? (
              <small className="text-red-500 text-xs">
                {formik.errors.area}
              </small>
            ) : null}
          </div>
          <div>
            <input
              id="villa_flat_number"
              name="villa_flat_number"
              type="text"
              className={
                "relative w-full h-10 px-4 text-sm border outline-none rounded" +
                " " +
                (formik.touched.villa_flat_number &&
                formik.errors.villa_flat_number
                  ? "border border-red-500"
                  : "")
              }
              placeholder="رقم الفيلا/الشقة"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.villa_flat_number}
            />
            {formik.touched.villa_flat_number &&
            formik.errors.villa_flat_number ? (
              <small className="text-red-500 text-xs">
                {formik.errors.villa_flat_number}
              </small>
            ) : null}
          </div>
          <div>
            <input
              id="location"
              name="location"
              type="text"
              className={
                "relative w-full h-10 px-4 text-sm border outline-none rounded" +
                " " +
                (formik.touched.location && formik.errors.location
                  ? "border border-red-500"
                  : "")
              }
              placeholder="الموقع"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.location}
            />
            {formik.touched.location && formik.errors.location ? (
              <small className="text-red-500 text-xs">
                {formik.errors.location}
              </small>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className={
            "w-full h-12 px-4 text-white bg-green-500 border rounded  transition-all duration-300 hover:bg-opacity-80" +
            " " +
            (formik.isSubmitting ? "opacity-50 cursor-not-allowed" : "")
          }
        >
          {formik.isSubmitting ? "جاري التأكيد..." : "تأكيد"}
        </button>
      </form>
    </div>
  );
};

export default CheckOutForm;
