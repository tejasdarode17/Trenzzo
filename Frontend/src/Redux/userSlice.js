import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchOrders = createAsyncThunk("fetch-orders", async ({ search, page = 1 }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders`,
            {
                params: { search, page },
                withCredentials: true
            })
        console.log(response.data);
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const fetchUserReviews = createAsyncThunk("fetch-user-reviews", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch/user/reviews`,
            { withCredentials: true })
        return response.data.reviews
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

const userSlice = createSlice({
    name: "user",
    initialState: {
        ordersData: {
            orders: [],
            page: "",
            totalOrders: "",
            pages: "",
            filtredTotal: "",
            ordersLoading: false,
        },
        order: JSON.parse(localStorage.getItem("order")) || {},
        userReviewsLoading: false,
        userReviews: [],
        wishlist: [],
    },
    reducers: {
        setOrder(state, action) {
            state.order = action.payload
            localStorage.setItem("order", JSON.stringify(action.payload));
        },

        setReviewforLiveChanges(state, action) {
            state.userReviews.push(action.payload)
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.ordersData.ordersLoading = true
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                const { orders, totalOrders, filteredTotal, pages } = action.payload
                state.ordersData.ordersLoading = false
                state.ordersData.orders = orders
                state.ordersData.filtredTotal = filteredTotal
                state.ordersData.totalOrders = totalOrders
                state.ordersData.pages = pages
            })
            .addCase(fetchOrders.rejected, (state) => {
                state.ordersData.ordersLoading = false
            })
        builder
            .addCase(fetchUserReviews.pending, (state) => {
                state.userReviewsLoading = true
            })
            .addCase(fetchUserReviews.fulfilled, (state, action) => {
                state.userReviewsLoading = false
                state.userReviews = action.payload
            })
            .addCase(fetchUserReviews.rejected, (state) => {
                state.userReviewsLoading = false
            })
    }
})


export const { setOrder, setReviewforLiveChanges } = userSlice.actions

export default userSlice.reducer

