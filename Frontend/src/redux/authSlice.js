import api from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/user/check-auth");
        return res?.data?.user;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        loading: false,
        userData: {},
    },
    reducers: {
        clearUser(state) {
            state.userData = {}
            state.isAuthenticated = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.userData = action.payload
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false
                state.isAuthenticated = false
            })
    }
})

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;