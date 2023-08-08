import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Tooltip } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Product } from "@/interfaces/products";
import { firestore, storage } from "@/firebase/clientApp";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { categories } from "@/data/categories";
import { useGetCountries } from "@/hooks/useGetCountries";
import { ref, uploadBytes } from "firebase/storage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Image from "next/image";
import { fetchProduct } from "@/utils";

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

export default function UpdateModal({ id, refresh }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [product, setProduct] = React.useState<Product>();
  const [image, setImage] = React.useState<File>();
  const [imageUrl, setImageUrl] = React.useState<string>();
  const countries = useGetCountries();

  const handleUploadImage = async () => {
    if (!image) return;
    // upload image to firebase storage
    const storageRef = ref(storage, `products/${formik.values.name}`);
    await uploadBytes(storageRef, image);
  };
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
  const formik = useFormik({
    initialValues: {
      name: product?.name,
      price: product?.price,
      description: product?.description,
      image: product?.image,
      unit: product?.unit,
      country: product?.country,
      brand: product?.brand,
      category: product?.category,
      discount: product?.discount,
      weight: product?.weight,
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
      await updateDoc(doc(firestore, "products", id.toString()), {
        name: values.name,
        price: values.price,
        description: values.description,
        unit: values.unit,
        country: values.country,
        brand: values.brand,
        category: values.category,
        discount: values.discount,
        weight: values.weight,
        lastUpdate: new Date(),
      })
        .then(() => {
          // refresh the products list
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
    if (open) {
      fetchProduct(id, setProduct as any);
      formik.setValues({
        name: product?.name,
        price: product?.price,
        description: product?.description,
        image: product?.image,
        unit: product?.unit,
        country: product?.country,
        brand: product?.brand,
        category: product?.category,
        discount: product?.discount,
        weight: product?.weight,
      });
    }
  }, [open]);


  return (
    <div>
      <Tooltip title="تعديل">
        <button onClick={handleClickOpen}>
          <BorderColorIcon className="text-slate-600 !text-[22px] mr-3" />
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
                {formik.values?.image ? (
                  <div className="w-full h-full flex flex-col items-center">
                    <Image
                      src={formik?.values.image}
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
