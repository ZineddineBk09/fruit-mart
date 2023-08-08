'use client'
import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { createTheme, ThemeProvider } from '@mui/material'
import { arEG } from '@mui/material/locale'
import { signOut, useSession } from 'next-auth/react'

import {
  ArchiveBoxIcon,
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  ChartPieIcon,
  UserIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import { truncateText } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'

const theme = createTheme({
  // change font here
  typography: {
    fontFamily: ['Cairo', 'Noto Kufi Arabic', 'sans-serif'].join(','),
  },
})

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: 'green',
        marginRight: theme.spacing(1.5),
      },
    },
  },
}))

const Profile = () => {
  const { data: session, status } = useSession()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  console.log('session: ', session)
  if (status === 'loading') return null
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Button
          className='flex flex-col items-center mr-3 hover:bg-white'
          onClick={handleClick}
        >
          {session?.user?.image ? (
            <Image
              src={session?.user?.image}
              alt={session?.user?.name as string}
              width={40}
              height={40}
              className='rounded-full'
            />
          ) : (
            <UserIcon className='text-green-500 text-xl w-8 h-8' />
          )}
        </Button>
        <StyledMenu
          id='demo-customized-menu'
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={handleClose}
            disableRipple
            className='flex flex-col items-start'
          >
            <p className='text-slate-900 text-sm'>{session?.user?.name}</p>
            <p className='text-slate-900 text-xs font-semibold'>
              {session?.user?.email as string}
            </p>
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          <MenuItem disableRipple>
            <Link href='/dashboard' className='flex items-center'>
              <BanknotesIcon className='w-6 h-5 ml-3' />
              <p className='text-sm'>نقاطي:</p>
              <p className='text-sm text-green-500 font-semibold'>
                {session?.user?.points}
              </p>
            </Link>
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />

          {session?.user.role === 'admin' && (
            <MenuItem disableRipple>
              <Link href='/dashboard' className='flex items-center'>
                <ChartPieIcon className='w-6 h-5 ml-3' />
                <p className='text-sm'>لوحة التحكم</p>
              </Link>
            </MenuItem>
          )}
          {/* <MenuItem disableRipple>
            <Link href="/wallet" className="flex items-center">
              <WalletIcon className="w-6 h-5 ml-3" />
              <p className="text-sm">المحفظة</p>
            </Link>
          </MenuItem> */}
          <MenuItem disableRipple>
            <Link href='/orders' className='flex items-center'>
              <ArchiveBoxIcon className='w-6 h-5 ml-3' />
              <p className='text-sm'>طلباتي</p>
            </Link>
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => signOut({ callbackUrl: '/' })}
            disableRipple
            className='text-sm'
          >
            <ArrowRightOnRectangleIcon className='w-6 h-5 ml-3 text-red-700' />
            <p className='text-sm text-red-700'>خروج</p>
          </MenuItem>
        </StyledMenu>
      </ThemeProvider>
    </div>
  )
}

export default Profile
