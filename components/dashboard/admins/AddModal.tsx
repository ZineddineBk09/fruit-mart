import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  Button,
  DialogActions,
  DialogContentText,
  Divider,
  Tooltip,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { newAdmin, searchUsersByEmail } from "@/utils";

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
  const [users, setUsers] = React.useState([]);
  const [user, setUser] = React.useState<any>();
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleChangeEmail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") return setUsers([]);
    const docs = await searchUsersByEmail(e.target.value);
    setUsers(docs);
  };

  const handleYes = () => {
    setOpen2(false);
    setOpen1(false);

    // add user to admins collection
    if (user.id) {
      newAdmin(user.id);
      refresh();
    }
  };

  const handleNo = () => {
    setOpen2(false);
    setUser(null);
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
            onClick={() => setOpen1(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md w-12 font-[500] flex items-center justify-evenly md:w-32"
          >
            <AddOutlinedIcon className="text-2xl text-dark " />
            <p className="hidden md:block"> إضافة</p>
          </button>
        </Tooltip>
      </div>
      <Dialog
        open={open1}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen1(false)}
        PaperProps={{
          style: {
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            width: "600px",
          },
        }}
      >
        <DialogContent>
          <div className="w-full flex flex-col items-start">
            <form className="w-full">
              <div className="flex items-center">
                <label className="text-slate-800 ml-2">
                  البحث عن طريق البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  placeholder="البريد الإلكتروني"
                  onChange={handleChangeEmail}
                  className={
                    "bg-gray-100 my-3 outline-none w-full px-2 rounded-md !text-slate-900 text-xs text-right flex-1 h-10 lg:text-md lg:h-12 lg:px-3 md:h-11 "
                  }
                />
              </div>

              <Divider className="bg-gray-100" />

              {/* search result */}
              <div className="w-full flex flex-col items-start mt-3 space-y-4">
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <div
                      key={user.id}
                      className="w-full flex items-center justify-between "
                    >
                      <label className="text-slate-800 text-sm">
                        {user.email}
                      </label>
                      <Button
                        className="text-white w-5 h-8 bg-green-500 p-1 rounded hover:bg-green-400"
                        onClick={() => {
                          setUser(user);
                          setOpen2(true);
                        }}
                      >
                        <PlusIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">لا يوجد نتائج</p>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open2}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen2(false)}
        // make a dark background with rounded corners
        PaperProps={{
          style: {
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            width: "600px",
          },
        }}
      >
        <DialogContent>
          <DialogContentText className="text-slate-800">
            هل أنت متأكد من إضافة هذا المستخدم؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleYes}
            className="!text-slate-800 hover:!bg-green-500 hover:!bg-opacity-20"
          >
            نعم
          </Button>
          <Button
            onClick={handleNo}
            className="!text-slate-800 hover:!bg-red-900 hover:!bg-opacity-20"
          >
            لا
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ConfirmModal = ({ open, handleClose, handleConfirm }: any) => {
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        // make a dark background with rounded corners
        PaperProps={{
          style: {
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            width: "600px",
          },
        }}
      >
        <DialogContent>
          <DialogContentText className="text-slate-800">
            هل أنت متأكد من إضافة هذا المستخدم؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            className="!text-slate-800 hover:!bg-green-500 hover:!bg-opacity-20"
          >
            نعم
          </Button>
          <Button
            onClick={handleClose}
            className="!text-slate-800 hover:!bg-red-900 hover:!bg-opacity-20"
          >
            لا
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
