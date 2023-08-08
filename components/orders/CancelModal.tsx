import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { Tooltip } from '@mui/material'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { firestore } from '@/firebase/clientApp'
import { useSession } from 'next-auth/react'
import { changePoints } from '@/utils'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

type Props = {
  id: string
  refresh: () => void
  total: number
}

export default function CancelModal({ id, refresh, total }: Props) {
  const [open, setOpen] = React.useState(false)
  const { data: session, status } = useSession()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCancelOrder = async () => {
    // update the order doc on firestore
    await updateDoc(doc(firestore, 'orders', id), {
      order_status: 'ملغي',
    })
      .then(async () => {
        // reduce the points of the user
        await changePoints(
          session?.user?.email as string,
          (total * -3) as number
        )

        // refresh the orders list
        refresh()
        // close the modal
        handleClose()
        toast.done('تم الإلغاء بنجاح')
      })
      .catch((error) => {
        toast.error('حدث خطأ ما')
      })
  }

  return (
    <div>
      <Tooltip title='الغاء'>
        <button
          className='text-red-500 p-2 rounded transition-all duration-300 hover:bg-gray-200'
          onClick={handleClickOpen}
        >
          الغاء الطلب
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
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            width: '300px',
          },
        }}
      >
        <DialogContent>
          <DialogContentText className='text-slate-800'>
            هل تريد حذف هذا السجل؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelOrder}
            className='!text-slate-800 hover:!bg-green-500 hover:!bg-opacity-20'
          >
            نعم
          </Button>
          <Button
            onClick={handleClose}
            className='!text-slate-800 hover:!bg-red-900 hover:!bg-opacity-20'
          >
            لا
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
