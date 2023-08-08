import { DataGrid, GridValueGetterParams } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material";
import { useRouter } from "next/navigation";
import { arEG } from "@mui/material/locale";
import { arSD as aer } from "@mui/x-data-grid";
import LoadingSpinner from "../shared/LoadingSpinner";

const theme = createTheme(
  {
    // change font here
    typography: {
      fontFamily: ["Cairo", "Noto Kufi Arabic", "sans-serif"].join(","),
    },
    palette: {
      primary: { main: "#1976d2" },
    },
    //direction: 'rtl',
  },
  arEG, // x-data-grid translations
  aer // x-data-grid translations
);

type Props = {
  rows: any;
  columns: any;
  addRecord?: boolean;
  deleteRecord?: (id: number) => void;
  updateRecord?: (id: number) => void;
  DeleteModal?: JSX.Element | any;
  UpdateModal?: JSX.Element | any;
  AddModal?: JSX.Element | any;
  ViewModal?: JSX.Element | any;
  actions?: boolean;
  refresh?: () => void;
  isLoading: boolean;
};

const Table = ({
  rows = [],
  columns = [],
  addRecord = false,
  actions = false,
  DeleteModal,
  UpdateModal,
  AddModal,
  ViewModal,
  isLoading,
  refresh,
}: Props) => {
  const router = useRouter();
  return (
    <ThemeProvider theme={theme}>
      <div className="w-full h-[500px] flex-1">
        <DataGrid
          autoPageSize
          rows={rows}
          columns={
            actions
              ? columns.concat({
                  field: "actions",
                  headerName: "إجراءات",
                  headerAlign: "center",
                  align: "left",
                  sortable: false,
                  disableColumnMenu: true,
                  renderCell: (params: GridValueGetterParams) => {
                    return (
                      // two button with bin and pen icons
                      <div className="flex items-center justify-center">
                        <DeleteModal id={params.row.id} refresh={refresh} />
                        {UpdateModal && (
                          <UpdateModal id={params.row.id} refresh={refresh} />
                        )}
                        {ViewModal && (
                          <ViewModal id={params.row.id} refresh={refresh} />
                        )}
                      </div>
                    );
                  },
                })
              : columns
          }
          className="!rounded-lg p-1 sm:p-2"
          //pageSize={7}
          //rowsPerPageOptions={[7]}
          style={{
            border: 0,
          }}
          sx={{
            "& .MuiDataGrid-row": {
              border: 0,
            },
            "& .MuiDataGrid-cell": {
              border: 0,
            },
            "& .MuiDataGrid-columnHeader": {
              border: 0,
              backgroundColor: "rgb(34 197 94)",
              width: "100%",
              color: "#ffffff",
            },
            "& .MuiDataGrid-root": {
              borderRadius: "100px",
            },
            // remove column separator
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            // pagination color
            "& .MuiTablePagination-root": {
              color: "rgb(34 197 94) !important",
            },
            // pagination button color
            "& .MuiIconButton-root": {
              color: "rgb(34 197 94) !important",
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <div className="flex items-center justify-center h-full">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <h3 className="text-base font-medium sm:text-xl">
                    لا يوجد بيانات
                  </h3>
                )}
              </div>
            ),
            Toolbar: () => (
              <div className="flex items-center justify-between mb-4">
                <span></span>
                {addRecord ? <AddModal refresh={refresh} /> : <div />}
              </div>
            ),
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default Table;
