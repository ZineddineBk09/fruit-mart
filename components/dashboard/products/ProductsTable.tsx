import { GridColDef } from "@mui/x-data-grid";
import Table from "../Table";
import { sharedColumnSettings } from "@/data/table/columns";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";
import AddModal from "./AddModal";
import Image from "next/image";

type Props = {
  products: any[];
  refreshTable: () => void;
  isLoading: boolean;
};

export default function ProductsTable({
  products,
  refreshTable,
  isLoading,
}: Props) {
  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "الصورة",
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center">
            <Image
              className="w-12 h-12 object-cover rounded"
              src={params.value}
              alt={params.value}
              width={40}
              height={40}
              quality={100}
            />
          </div>
        );
      },

      ...sharedColumnSettings,
    },
    {
      field: "name",
      headerName: "الاسم",
      ...sharedColumnSettings,
    },
    {
      field: "price",
      headerName: "السعر",
      ...sharedColumnSettings,
    },
    {
      field: "description",
      headerName: "الوصف",
      ...sharedColumnSettings,
    },
    {
      field: "unit",
      headerName: "الوحدة",
      ...sharedColumnSettings,
    },
    {
      field: "country",
      headerName: "الدولة",
      ...sharedColumnSettings,
    },
    {
      field: "brand",
      headerName: "الماركة",
      ...sharedColumnSettings,
    },
    {
      field: "category",
      headerName: "القسم",
      ...sharedColumnSettings,
    },
    {
      field: "discount",
      headerName: "الخصم",
      ...sharedColumnSettings,
    },
    {
      field: "weight",
      headerName: "الوزن",
      ...sharedColumnSettings,
    },
  ];
  return (
    <div className="w-full bg-light-dark-2 p-3 rounded-lg !shadow-md">
      <Table
        isLoading={isLoading}
        actions
        rows={products}
        columns={columns}
        DeleteModal={DeleteModal}
        UpdateModal={UpdateModal}
        AddModal={AddModal}
        refresh={refreshTable}
        addRecord
      />
    </div>
  );
}
