import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const fetchAllCarousels = createAsyncThunk("fetch/carousels", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/carousels`, {
            withCredentials: true,
        });
        return response.data.carousels
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const fetchAllBanners = createAsyncThunk("fetch/banners", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/banners`, {
            withCredentials: true,
        });
        return response.data.banners
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

const bannersSlice = createSlice({
    name: "banners",
    initialState: {
        loading: false,
        bannerLoading: false,
        carousels: [],
        banners: [],
    },
    reducers: {
        addBanners(state, action) {
            state.banners.push(action.payload)
        },
        addCarousels(state, action) {
            state.carousels.push(action.payload)
        },
        deleteCarousel(state, action) {
            const { id } = action.payload
            state.carousels = state.carousels.filter((c) => c._id !== id)
        },
        deleteBanner(state, action) {
            const { id } = action.payload
            state.banners = state.banners.filter((b) => b._id !== id)
        },
        editCarousel(state, action) {
            const { id, newCarousel } = action.payload;
            const index = state.carousels.findIndex((c) => c._id === id);
            if (index !== -1) {
                state.carousels[index] = newCarousel;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCarousels.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAllCarousels.fulfilled, (state, action) => {
                state.loading = false
                state.carousels = action.payload
            })
            .addCase(fetchAllCarousels.rejected, (state) => {
                state.loading = false
            })
        builder
            .addCase(fetchAllBanners.pending, (state) => {
                state.bannerLoading = true
            })
            .addCase(fetchAllBanners.fulfilled, (state, action) => {
                state.bannerLoading = false
                state.banners = action.payload
            })
            .addCase(fetchAllBanners.rejected, (state) => {
                state.bannerLoading = false
            })
    }
})

export const { addBanners, addCarousels, deleteBanner, deleteCarousel, editCarousel } = bannersSlice.actions
export default bannersSlice.reducer