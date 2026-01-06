import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const fetchCartThunk = createAsyncThunk("fetch-cart", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart`, {
            withCredentials: true,
        });
        return response.data.cart
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const addToCartThunk = createAsyncThunk("add-cart", async ({ productID, quantity, attributes }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add-cart`,
            { productID, quantity, attributes },
            { withCredentials: true, }
        )
        console.log(response.data);
        return response.data.cart
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const decreaseCartQuantity = createAsyncThunk("decrease-quantity", async ({ productID, attributes }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/decrease-quantity`,
            { productID, attributes },
            { withCredentials: true, }
        )
        console.log(response.data);
        return response.data.cart
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const removeItemFromCart = createAsyncThunk("remove-cart", async ({ productID, attributes }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/remove-cart`,
            { productID, attributes },
            { withCredentials: true, }
        )
        console.log(response.data);
        return response.data.cart
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const buyNowThunk = createAsyncThunk("buy-now", async ({ productID, quantity, attributes }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/buy-now`,
            { productID, quantity, attributes },
            { withCredentials: true, }
        )
        console.log(response.data);
        return response.data.item
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const checkOut = createAsyncThunk("checkout", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/checkout`, {
            withCredentials: true,
        });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})


const cartSllice = createSlice({
    name: "cart",
    initialState: {
        loading: false,
        cart: {},
        chekOut: {}
    },
    reducers: {
        clearCart(state) {
            state.cart = {}
        },
        clearCheckOut(state) {
            state.chekOut = {}
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCartThunk.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(fetchCartThunk.rejected, (state) => {
                state.loading = false;
            })
        builder
            .addCase(addToCartThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(addToCartThunk.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(addToCartThunk.rejected, (state) => {
                state.loading = false;
            })

        builder
            .addCase(decreaseCartQuantity.pending, (state) => {
                state.loading = true
            })
            .addCase(decreaseCartQuantity.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(decreaseCartQuantity.rejected, (state) => {
                state.loading = false;
            })

        builder
            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(removeItemFromCart.rejected, (state) => {
                state.loading = false;
            })

        builder
            .addCase(checkOut.pending, (state) => {
                state.loading = true
            })
            .addCase(checkOut.fulfilled, (state, action) => {
                state.loading = false
                state.chekOut = action.payload.cart
            })
            .addCase(checkOut.rejected, (state) => {
                state.loading = false;
            })
        builder
            .addCase(buyNowThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(buyNowThunk.fulfilled, (state, action) => {
                state.loading = false
                state.chekOut = action.payload
            })
            .addCase(buyNowThunk.rejected, (state) => {
                state.loading = false;
            })
    }

})


export const { clearCart, clearCheckOut } = cartSllice.actions
export default cartSllice.reducer



