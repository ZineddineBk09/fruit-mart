import { GridColDef } from "@mui/x-data-grid";
import Table from "../Table";
import { sharedColumnSettings } from "@/data/table/columns";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";
import AddModal from "./AddModal";
import Image from "next/image";

type Props = {
  admins: any[];
  refreshTable: () => void;
  isLoading: boolean;
};

export default function AdminsTable({
  admins,
  refreshTable,
  isLoading,
}: Props) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "الاسم",
      ...sharedColumnSettings,
    },
    {
      field: "email",
      headerName: "البريد الالكتروني",
      ...sharedColumnSettings,
    },
  ];
  return (
    <div className="w-full bg-light-dark-2 p-3 rounded-lg !shadow-md">
      <Table
        isLoading={isLoading}
        actions
        rows={admins}
        columns={columns}
        DeleteModal={DeleteModal}
        AddModal={AddModal}
        refresh={refreshTable}
        addRecord
      />
    </div>
  );
}
