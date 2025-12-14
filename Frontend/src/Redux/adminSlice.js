import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const fetchAllSellers = createAsyncThunk("fetch/seller", async ({ status, page = 1, search = "" }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/sellers`,
            {
                params: { status, page, search },
                withCredentials: true
            }
        );
        console.log(response.data);

        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const getAdminStats = createAsyncThunk("fetch/stats", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/stats`,
            { withCredentials: true }
        );
        console.log(response.data);
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})
const adminSlice = createSlice({
    name: "admin",
    initialState: {
        seller: {},
        sellersData: {
            sellersLoading: false,
            sellers: [],
            total: 0,
            filtredTotal: 0,
            page: 1,
            pages: 1,
        },
        dashboardData: {
            dashboardLoading: false,
            totals: {},
            recentSellers: []
        }
    },
    reducers: {
        setSeller(state, action) {
            state.seller = action.payload;
        },

        updateSellerStatus(state, action) {
            const { id, status } = action.payload;
            const seller = state.sellersData.sellers.find(s => s._id === id);
            if (seller) {
                seller.status = status;
                if (status !== "pending") {
                    state.dashboardData.totals.pending -= 1;
                }
            }
            state.seller.status = status
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSellers.pending, (state) => {
                state.sellersData.sellersLoading = true;
            })
            .addCase(fetchAllSellers.fulfilled, (state, action) => {
                const { sellers, total, filtredTotal, page, pages } = action.payload;
                state.sellersData.sellersLoading = false;
                state.sellersData.sellers = sellers;
                state.sellersData.total = total;
                state.sellersData.filtredTotal = filtredTotal;
                state.sellersData.page = page;
                state.sellersData.pages = pages;
            })
            .addCase(fetchAllSellers.rejected, (state) => {
                state.sellersData.sellersLoading = false;
            });

        builder
            .addCase(getAdminStats.pending, (state) => {
                state.dashboardData.dashboardLoading = true;
            })
            .addCase(getAdminStats.fulfilled, (state, action) => {
                state.dashboardData.dashboardLoading = false;
                state.dashboardData.totals = action.payload.totals;
                state.dashboardData.recentSellers = action.payload.recentSellers;
            })
            .addCase(getAdminStats.rejected, (state) => {
                state.dashboardData.dashboardLoading = false;
            });
    }
});



export const { setSeller, updateSellerStatus } = adminSlice.actions
export default adminSlice.reducer



