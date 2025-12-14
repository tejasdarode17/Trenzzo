import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchSearchProducts = createAsyncThunk("fetch/products", async ({ page = 1, sort = "relevance", query }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search`,
            {
                params: {
                    search: query,
                    page,
                    sort,
                },
                withCredentials: true
            }
        );
        return response?.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }

})

export const fetchProductDetails = createAsyncThunk("fetch/product-details", async ({ slug }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product-details/${slug}`,
            { withCredentials: true }
        );
        return response?.data?.product
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

const productsSlice = createSlice({
    name: "product",
    initialState: {
        loading: false,
        products: [],
        product: {},
        productLoading: false,
        total: 0,
        totalPages: 0,
        currentPage: 1,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchProducts.pending, (state, action) => {
                state.loading = true
            })
            .addCase(fetchSearchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products || [];
                state.total = action.payload.total || 0;
                state.totalPages = action.payload.totalPages || 0;
                state.currentPage = action.payload.currentPage || 1;
                state.error = null;
            })
            .addCase(fetchSearchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Failed to fetch products"
            })
        builder
            .addCase(fetchProductDetails.pending, (state, action) => {
                state.productLoading = true
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.productLoading = false
                state.product = action.payload
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.productLoading = false
            })
    }
})


export const { } = productsSlice.actions
export default productsSlice.reducer