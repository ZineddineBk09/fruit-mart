'use client'
import { useEffect, useRef, useState } from 'react'
import { products } from '@/data/products'
import { Product } from '@/interfaces/products'
import { searchProducts } from '@/lib/search'
import SearchIcon from '@mui/icons-material/Search'
import Image from 'next/image'
import Menu, { MenuProps } from '@mui/material/Menu'
import { styled } from '@mui/material'
import Link from 'next/link'

const SearchBar = () => {
  const [filterredProducts, setFilteredProducts] = useState<Product[]>([])
  const handleSearchVehicles = (search: string) => {
    if (search === '') {
      setFilteredProducts([])
      return
    }
    // search inside shipments array
    setFilteredProducts(searchProducts(products, search))
  }

  const searchRef = useRef<any>(null) // Ref to the search suggestions container

  // Event listener to close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setFilteredProducts([]) // Close the search suggestions
      }
    }

    window.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className='w-full max-w-[700px] relative'
      ref={searchRef}
      // check if we clicked outside the search suggestions to close it
    >
      <div className='w-full h-10 flex items-center justify-between pr-4 bg-gray-100 rounded'>
        <input
          type='text'
          className='h-full flex-1 text-gray-500 text-sm  py-1 bg-transparent border-none outline-none'
          placeholder='ابحث عن فاكهة أو خضروات'
          onChange={(e) => handleSearchVehicles(e.target.value)}
        />
        <span className='h-full w-12 flex items-center justify-center bg-green-500 rounded-l'>
          <SearchIcon className='text-white ' />
        </span>
      </div>

      {/* Search suggestions */}
      {filterredProducts.length > 0 && (
        <div
          className='w-full max-h-64 absolute top-12 flex flex-col items-center p-1 bg-white rounded mt-2 z-[100] overflow-y-scroll transition-all duration-200 shadow-gray-500 shadow'
          id='search-suggestions'
        >
          {filterredProducts.map((product: Product) => (
            <Link
              href={'/products/' + product.id}
              key={product.id}
              className='w-full h-12 my-1 py-1 flex items-center pr-4 bg-white rounded transition-all duration-200 hover:bg-gray-100'
            >
              <Image
                src={product.image}
                alt={product?.name || ''}
                width={350}
                height={350}
                className='w-10 h-10 object-contain rounded ml-3'
              />
              <div className='flex flex-col items-start'>
                <p>{product.name}</p>
                <small className='text-gray-400 text-xs mt-1'>
                  {product.description.join(' - ')}
                </small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(10),
    minWidth: '450px',
    marginLeft: 'auto',
    marginRight: 'auto',
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

export default SearchBar
