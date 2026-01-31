import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const fetchOngoingDeliveryOrders = createAsyncThunk("fetch-ongoing-orders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/delivery/pending-orders`,
            { withCredentials: true }
        );
        // console.log(response?.data);
        return response.data.orders
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const fetchAllDeliveryOrders = createAsyncThunk("fetch-all-orders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/delivery/all-orders`,
            { withCredentials: true }
        );
        console.log(response?.data);
        return response.data.orders
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const fetchReturnOrders = createAsyncThunk("fetch-return-orders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/delivery/all-returns`,
            { withCredentials: true }
        );
        console.log(response?.data);
        return response.data.items
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})


const deliverySlice = createSlice({
    name: "delivery",
    initialState: {
        ongoingLoading: false,
        ongingOrders: [],
        AllLoading: false,
        allDeliveryOrders: [],
        returnLoading: false,
        allReturns: []
    },
    reducers: {
        updateStatusOfOrder(state, action) {
            const updatedItem = action.payload
            const orderIndex = state.ongingOrders.findIndex(o => o.item._id === updatedItem._id);
            if (orderIndex !== -1) {
                state.ongingOrders[orderIndex].item.deliveryStatus = updatedItem.deliveryStatus;
                state.ongingOrders[orderIndex].item.status = updatedItem.status;
            }
        },
        updateReturnStatus(state, action) {
            const { returnId } = action.payload;
            const idx = state.allReturns.findIndex(r => r.returnRequest?._id === returnId);
            if (idx !== -1) {
                state.allReturns[idx].returnRequest.returnStatus = "pickedUp";
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchOngoingDeliveryOrders.pending, (state, action) => {
                state.ongoingLoading = true
            })
            .addCase(fetchOngoingDeliveryOrders.fulfilled, (state, action) => {
                state.ongingOrders = action.payload
                state.ongoingLoading = false
            })
            .addCase(fetchOngoingDeliveryOrders.rejected, (state, action) => {
                state.ongoingLoading = false
            })
        builder
            .addCase(fetchAllDeliveryOrders.pending, (state, action) => {
                state.AllLoading = true
            })
            .addCase(fetchAllDeliveryOrders.fulfilled, (state, action) => {
                state.allDeliveryOrders = action.payload
                state.AllLoading = false
            })
            .addCase(fetchAllDeliveryOrders.rejected, (state, action) => {
                state.AllLoading = false
            })
        builder
            .addCase(fetchReturnOrders.pending, (state, action) => {
                state.returnLoading = true
            })
            .addCase(fetchReturnOrders.fulfilled, (state, action) => {
                state.allReturns = action.payload
                state.returnLoading = false
            })
            .addCase(fetchReturnOrders.rejected, (state, action) => {
                state.returnLoading = false
            })
    }
})


export const { updateStatusOfOrder, updateReturnStatus } = deliverySlice.actions
export default deliverySlice.reducer


