import { GridColDef } from "@mui/x-data-grid";
import Table from "../Table";
import { sharedColumnSettings } from "@/data/table/columns";
import DeleteModal from "./DeleteModal";
import ViewModal from "./ViewModal";
import { displayDateAndTime } from "@/utils";

type Props = {
  orders: any[];
  refreshTable: () => void;
  isLoading: boolean;
};

export default function OrdersTable({
  orders,
  refreshTable,
  isLoading,
}: Props) {
  const columns: GridColDef[] = [
    {
      field: "order_status",
      headerName: "حالة الطلب",
      ...sharedColumnSettings,
      // there is 3 status: قيد الانتظار , تم التسليم , تم الرفض
      // orange for pending, green for accepted, red for rejected
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                params.value === "قيد الانتظار"
                  ? "bg-yellow-400 text-white"
                  : params.value === "تم التسليم"
                  ? "bg-green-500 text-white"
                  : "bg-red-400 text-white"
              }`}
            >
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "الاسم",
      ...sharedColumnSettings,
    },
    {
      field: "email",
      headerName: "البريد",
      ...sharedColumnSettings,
    },
    {
      field: "phone",
      headerName: "الهاتف",
      ...sharedColumnSettings,
    },
    {
      field: "order_date",
      headerName: "تاريخ الطلب",
      ...sharedColumnSettings,
      renderCell: (params) => {
        return <p>{displayDateAndTime(params.value.seconds)}</p>;
      },
      minWidth: 250,
    },
    {
      field: "total_price",
      headerName: "السعر الكلي",
      ...sharedColumnSettings,
    },
  ];
  return (
    <div className="w-full bg-light-dark-2 p-3 rounded-lg !shadow-md">
      <Table
        isLoading={isLoading}
        actions
        rows={orders}
        columns={columns}
        DeleteModal={DeleteModal}
        refresh={refreshTable}
        ViewModal={ViewModal}
      />
    </div>
  );
}
