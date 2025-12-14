import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/check-auth`, {
            withCredentials: true,
        });
        console.log(response?.data?.user);
        return response?.data?.user
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
        userAddresses: []
    },
    reducers: {
        setUser(state, action) {
            state.isAuthenticated = true
            state.userData = action.payload
            state.userAddresses = action.payload.addresses || []
        },
        clearUser(state) {
            state.userData = {}
            state.userAddresses = []
            state.isAuthenticated = false
        },
        updateUserAddresses(state, action) {
            state.userAddresses.push(action.payload)
        },
        editUserAddress(state, action) {
            const { id, address } = action.payload
            const addressIndex = state.userAddresses.findIndex((a) => a._id == id)
            state.userAddresses[addressIndex] = address
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true
                state.isAuthenticated = false
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.userData = action.payload
                state.userAddresses = action.payload?.addresses
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false
                state.isAuthenticated = false
            })
    }
})

export const { clearUser, setUser, userAddresses, setUserAddresses, updateUserAddresses, editUserAddress } = authSlice.actions;
export default authSlice.reducer;