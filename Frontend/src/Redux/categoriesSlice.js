import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const fetchAllCategories = createAsyncThunk("categories/fetch", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/category`, {
            withCredentials: true,
        });
        return response.data.categories
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})


const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        loading: false,
        categories: []
    },
    reducers: {
        addCategory(state, action) {
            state.categories.push(action.payload)
        },
        editCategory(state, action) {
            const { id, newCategory } = action.payload;
            const index = state.categories.findIndex((c) => c._id === id);
            if (index !== -1) {
                state.categories[index] = newCategory;
            }
        },
        deleteCategory(state, action) {
            const { id } = action.payload
            state.categories = state.categories.filter((c) => c._id !== id)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCategories.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload
            })
            .addCase(fetchAllCategories.rejected, (state) => {
                state.loading = true
            })
    }
})


export const { addCategory, editCategory, deleteCategory } = categoriesSlice.actions
export default categoriesSlice.reducer

