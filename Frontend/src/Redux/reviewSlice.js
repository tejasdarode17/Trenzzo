import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
//the product reviews will be stored here 
export const fetchReviews = createAsyncThunk("fetch-reviews", async ({ productID }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetch/reviews`,
            {
                params: { productID },
                withCredentials: true
            })
        return response.data.reviews
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        )
    }
})

const reviewSlice = createSlice({
    name: "Review",
    initialState: {
        loading: false,
        reviews: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchReviews.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchReviews.fulfilled, (state, action) => {
            state.loading = false
            state.reviews = action.payload
        })
        builder.addCase(fetchReviews.rejected, (state) => {
            state.loading = false
        })
    }

})


export const { } = reviewSlice.actions

export default reviewSlice.reducer