import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { firestore } from "@/firebase/clientApp";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  id: number;
  refresh: () => void;
};

export default function DeleteModal({ id, refresh }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    // delete product from firestore
    try {
      const docRef = doc(firestore, "orders", id.toString());
      await deleteDoc(docRef);
      refresh();
      toast.done("تم حذف السجل بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف السجل");
    }
  };

  return (
    <div>
      <Tooltip title="حذف">
        <button onClick={handleClickOpen}>
          <DeleteIcon className="text-red-500 !text-[22px] mr-3" />
        </button>
      </Tooltip>
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
            width: "300px",
          },
        }}
      >
        <DialogContent>
          <DialogContentText className="text-slate-800">
            هل تريد حذف هذا السجل؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDelete}
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
}
