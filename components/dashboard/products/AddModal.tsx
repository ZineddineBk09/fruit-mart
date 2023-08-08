import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Tooltip } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { firestore, storage } from "@/firebase/clientApp";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useGetCountries } from "@/hooks/useGetCountries";
import { categories } from "@/data/categories";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  refresh: () => void;
};

export default function AddModal({ refresh }: Props) {
  const [open, setOpen] = React.useState(false);
  // handle image separately
  const [image, setImage] = React.useState<File>();
  const [imageUrl, setImageUrl] = React.useState<string>();
  const countries = useGetCountries();

  const handleUploadImage = async (id: string) => {
    if (!image) return;
    // upload image to firebase storage
    const storageRef = ref(storage, `products/${id}`);
    await uploadBytes(storageRef, image);
  };
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setImageUrl(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
      unit: "",
      country: "",
      brand: "",
      category: "",
      discount: 0,
      weight: 0,
    },

    validationSchema: Yup.object({
      name: Yup.string().required("الاسم مطلوب"),
      price: Yup.number()
        .required("السعر مطلوب")
        .min(0, "السعر يجب ان يكون اكبر من 0"),
      description: Yup.string().required("الوصف مطلوب"),
      unit: Yup.string().required("الوحدة مطلوبة"),
      country: Yup.string().required("البلد مطلوب"),
      brand: Yup.string(),
      category: Yup.string().required("القسم مطلوب"),
      discount: Yup.number().min(0, "الخصم يجب ان يكون اكبر من 0"),
      weight: Yup.number().min(0, "الوزن يجب ان يكون اكبر من 0"),
    }),

    onSubmit: async (values) => {
      // update the product doc on firestore
      await addDoc(collection(firestore, "products"), {
        name: values.name,
        price: values.price,
        description: values.description,
        unit: values.unit,
        country: values.country,
        brand: values.brand,
        category: values.category,
        discount: values.discount,
        weight: values.weight,
        date: new Date(),
        lastUpdate: new Date(),
      })
        .then((docRef) => {
          // save the image to firebase storage
          handleUploadImage(docRef.id);
          // refresh the products list
          refresh();
          // close the modal
          handleClose();
          toast.success("تمت الاضافة بنجاح");
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
    setImageUrl("");
  };

  return (
    <div>
      <div className="w-full flex items-center">
        <Tooltip title="تحديث">
          <button
            onClick={refresh}
            className="bg-green-500 text-white ml-6 px-4 py-2 rounded-md w-12 font-[500] flex items-center justify-evenly md:w-32"
          >
            <ArrowPathIcon className="h-6 w-6 text-dark " />
            <p className="hidden md:block">تحديث</p>
          </button>
        </Tooltip>

        <Tooltip title="إضافة">
          <button
            onClick={handleClickOpen}
            className="bg-green-500 text-white px-4 py-2 rounded-md w-12 font-[500] flex items-center justify-evenly md:w-32"
          >
            <AddOutlinedIcon className="text-2xl text-dark " />
            <p className="hidden md:block"> إضافة</p>
          </button>
        </Tooltip>
      </div>
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
            <div className="flex items-center">
              <label className="text-slate-800 ml-2">الصورة</label>
              <div
                className={
                  "relative flex flex-col items-center justify-center bg-gray-100 mt-3 mb-5 border-none outline-none w-24 mx-auto h-24 rounded-md"
                }
              >
                <input
                  id="image"
                  type="file"
                  name="image"
                  placeholder="الصورة"
                  accept="image/*"
                  onChange={handleChangeImage}
                  className="absolute inset-0 outline-none border-none opacity-0 z-10"
                />
                {imageUrl ? (
                  <div className="w-full h-full flex flex-col items-center">
                    <Image
                      src={imageUrl}
                      alt="product image"
                      width={100}
                      height={100}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <AddPhotoAlternateIcon className="w-full h-full text-2xl scale-150 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex items-center h-fit">
              <label className="text-slate-800 ml-2">الاسم</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="الاسم"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11 " +
                  " " +
                  (formik.touched.name && formik.errors.name
                    ? "border border-red-500"
                    : "")
                }
              />
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 ml-2">السعر</label>
              <input
                id="price"
                type="text"
                name="price"
                placeholder="السعر"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11" +
                  " " +
                  (formik.touched.price && formik.errors.price
                    ? "border border-red-500"
                    : "")
                }
              />
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 ml-2">الوصف</label>
              <input
                id="description"
                type="text"
                name="description"
                placeholder="الوصف"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11" +
                  " " +
                  (formik.touched.description && formik.errors.description
                    ? "border border-red-500"
                    : "")
                }
              />
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 ml-2">الوحدة</label>
              <select
                id="unit"
                name="unit"
                placeholder="الوحدة"
                value={formik.values.unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11" +
                  " " +
                  (formik.touched.unit && formik.errors.unit
                    ? "border border-red-500"
                    : "")
                }
              >
                <option value="" className="w-full">
                  الوحدة
                </option>
                <option value="صحن" className="w-full">
                  صحن
                </option>
                <option value="كلغ" className="w-full">
                  كلغ
                </option>
                <option value="غرام" className="w-full">
                  غرام
                </option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 ml-2">البلد</label>

              <select
                id="country"
                name="country"
                placeholder="البلد"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11" +
                  " " +
                  (formik.touched.country && formik.errors.country
                    ? "border border-red-500"
                    : "")
                }
              >
                {countries.map((country, index) => (
                  <option key={country.id} value={country.name}>
                    {country.flag}
                    {" " + country.name + " "}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 ml-2">الماركة</label>
              <input
                id="brand"
                type="text"
                name="brand"
                placeholder="الماركة"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11" +
                  " " +
                  (formik.touched.brand && formik.errors.brand
                    ? "border border-red-500"
                    : "")
                }
              />
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 ml-2">الفئة</label>
              <select
                id="category"
                name="category"
                placeholder="الفئة"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11" +
                  " " +
                  (formik.touched.category && formik.errors.category
                    ? "border border-red-500"
                    : "")
                }
              >
                <option value="">الفئة</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.link}>
                    {category.link}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 ml-2">الخصم</label>
              <input
                id="discount"
                type="number"
                name="discount"
                placeholder="الخصم"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11" +
                  " " +
                  (formik.touched.discount && formik.errors.discount
                    ? "border border-red-500"
                    : "")
                }
              />
            </div>
            <div className="flex items-center">
              <label className="text-slate-800 ml-2">الوزن</label>
              <input
                id="weight"
                type="number"
                name="weight"
                placeholder="الوزن"
                value={formik.values.weight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11" +
                  " " +
                  (formik.touched.weight && formik.errors.weight
                    ? "border border-red-500"
                    : "")
                }
              />
            </div>

            <div className="w-full flex items-center justify-evenly mt-6">
              <Button
                type="submit"
                className="!bg-green-500 !text-white hover:!bg-green-400"
              >
                إضافة
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
