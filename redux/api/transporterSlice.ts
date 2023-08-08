import { Product } from '@/interfaces/products';
import { ApiSlice } from './apiSlice';

export const extendedApiSlice = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransporters: builder.mutation<Product[], null>({
      query: (data) => ({
        url: `/transporter/all`,
        method: 'GET',
        data,
      }),
    }),
    getOneTransoprter: builder.mutation<Product, number>({
      query: (data) => ({
        url: `/transporter/${data}`,
        method: 'GET',
      }),
    }),
    createTransporter: builder.mutation<Product, Product>({
      query: (data) => ({
        url: `/transporter/create`,
        method: 'post',
        data,
      }),
    }),
    updateTransporter: builder.mutation<
      Product,
      Partial<Product> & { transporter_id: number }
    >({
      query: (data) => ({
        url: `/transporter/update`,
        method: 'post',
        data,
      }),
    }),
    deleteTransporter: builder.mutation<Product, number>({
      query: (data) => ({
        url: `/transporter/delete`,
        method: 'post',
        data: { transporter_id: data },
      }),
    }),
  }),
});

export const {
  useCreateTransporterMutation,
  useDeleteTransporterMutation,
  useUpdateTransporterMutation,
  useGetAllTransportersMutation,
  useGetOneTransoprterMutation,
} = extendedApiSlice;
