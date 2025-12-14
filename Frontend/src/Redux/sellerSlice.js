import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchAllSellerProducts = createAsyncThunk("seller/products", async ({ category, page, status, search }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/products`,
            {
                params: { category, page, status, search },
                withCredentials: true
            }
        );
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
});

export const fetchAllSellerOrders = createAsyncThunk("seller/orders", async ({ range = "today", page }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/all-orders`,
            {
                params: { range, page },
                withCredentials: true
            }
        );
        return {
            orders: response.data.orders,
            page: response.data.page,
            totalOrders: response.data.totalOrders,
            totalPages: response.data.totalPages,
        }
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
});

export const fetchRecentSellerOrders = createAsyncThunk("seller/recent-orders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/recent-orders`,
            {
                withCredentials: true
            }
        );
        return response.data.orders
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
});

export const fetchSellerStats = createAsyncThunk("seller/stats", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/stats`,
            { withCredentials: true }
        );
        return response.data
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
});

export const fetchSellerReturns = createAsyncThunk("seller/returns", async ({ filter = "today", page = 1 }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/returns`,
            {
                params: { filter, page },
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


const sellerSlice = createSlice({
    name: "seller",
    initialState: {
        products: {
            allProducts: [],
            totalProducts: 0,
            filteredTotal: 0,
            page: 1,
            pages: 1,
            productsLoading: false,
        },
        product: {},
        orders: {
            allOrders: [],
            recentOrdersLoading: "false",
            recentOrders: [],
            page: 1,
            totalPages: 1,
            totalOrders: 0,
            ordersLoading: false
        },
        revenue: {
            statsLoading: false,
            totalRevenue: 0,
            monthlyRevenue: 0,
            yearlyRevenue: 0,
            monthlyBreakdown: [],
            totalOrdersDelivered: 0
        },
        orderDetails: {
            order: {},
            orderLoading: false,
        },
        returns: {
            loading: false,
            data: [],
            totalItems: 0,
            pages: 1
        }

    },
    reducers: {
        clearAllProducts(state) {
            state.products = {}
        },

        addProduct(state, action) {
            state.products.allProducts.push(action.payload);
        },

        deleteProduct(state, action) {
            const productID = action.payload
            state.products.allProducts = state.products.allProducts.filter((p) => p._id !== productID);
        },

        updateProduct(state, action) {
            const { id, product } = action.payload;
            const index = state.products.allProducts.findIndex((p) => p._id === id);
            if (index !== -1) {
                state.products.allProducts[index] = product;
            }
        },

        updateProductStatus(state, action) {
            const { id, active } = action.payload;
            const product = state.products.allProducts.find((p) => p._id === id);
            if (product) {
                product.active = active;
            }
        },

        setSellerSingleProduct(state, action) {
            state.product = action.payload
        },

        setSellerSingleOrder(state, action) {
            state.orderDetails.order = action.payload
        },

        updateOrderPacked(state, action) {
            const { itemID, newStatus } = action.payload
            const item = state.orderDetails.order.items.find((i) => i._id === itemID)
            if (item) {
                item.status = newStatus
            }
        },

        setOrderDeliveryPartner(state, action) {
            const { itemID, partnerID } = action.payload
            const item = state.orderDetails.order.items.find((i) => i._id === itemID)
            if (item) {
                item.deliveryPartner = partnerID
            }
        },

        setReturnDeliveryPartner(state, action) {
            const { partnerID, returnID } = action.payload
            const item = state.returns.data.find((i) => i.returnRequest._id === returnID)
            if (item) {
                item.returnStatus = "in-transit"
                item.deliveryPartner = partnerID
            }
        },

        updateReturnStatus(state, action) {
            const { returnID, status } = action.payload;
            console.log(state);
            const item = state.returns.data.find((i) => i.returnRequest._id === returnID);
            console.log(item);
            if (item) {
                item.returnRequest.returnStatus = status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSellerProducts.pending, (state) => {
                state.products.productsLoading = true;
            })
            .addCase(fetchAllSellerProducts.fulfilled, (state, action) => {
                const { products, totalProducts, filteredTotal, page, pages } = action.payload;
                state.products.productsLoading = false;
                state.products.allProducts = products
                state.products.filteredTotal = filteredTotal
                state.products.page = page
                state.products.pages = pages
                state.products.totalProducts = totalProducts
            })
            .addCase(fetchAllSellerProducts.rejected, (state) => {
                state.productsLoading = false;
            });
        builder
            .addCase(fetchAllSellerOrders.pending, (state) => {
                state.orders.ordersLoading = true;
            })
            .addCase(fetchAllSellerOrders.fulfilled, (state, action) => {
                state.orders.ordersLoading = false;
                state.orders.allOrders = action.payload.orders;
                state.orders.page = action.payload.page;
                state.orders.totalOrders = action.payload.totalOrders;
                state.orders.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllSellerOrders.rejected, (state) => {
                state.orders.ordersLoading = false;
            });

        builder
            .addCase(fetchRecentSellerOrders.pending, (state) => {
                state.orders.recentOrdersLoading = true;
            })
            .addCase(fetchRecentSellerOrders.fulfilled, (state, action) => {
                state.orders.recentOrdersLoading = false;
                state.orders.recentOrders = action.payload
            })
            .addCase(fetchRecentSellerOrders.rejected, (state) => {
                state.orders.recentOrders = false;
            });
        builder
            .addCase(fetchSellerStats.pending, (state) => {
                state.revenue.statsLoading = true;
            })
            .addCase(fetchSellerStats.fulfilled, (state, action) => {
                const { totalRevenue, monthRevenue, yearRevenue, totalOrders, monthlyBreakdown } = action.payload
                state.revenue.statsLoading = false;
                state.revenue.totalRevenue = totalRevenue
                state.revenue.yearlyRevenue = yearRevenue
                state.revenue.monthlyRevenue = monthRevenue
                state.revenue.monthlyBreakdown = monthlyBreakdown
                state.revenue.totalOrdersDelivered = totalOrders
            })
            .addCase(fetchSellerStats.rejected, (state) => {
                state.orders.recentOrders = false;
            });
        builder
            .addCase(fetchSellerReturns.pending, (state) => {
                state.returns.loading = true;
            })
            .addCase(fetchSellerReturns.fulfilled, (state, action) => {
                const { items, total, pages } = action.payload
                state.returns.loading = false;
                state.returns.data = items
                state.returns.totalItems = total
                state.returns.pages = pages
            })
            .addCase(fetchSellerReturns.rejected, (state) => {
                state.returns.loading = false;
            });
    },
});

export const { clearAllProducts, updateProductStatus, addProduct, deleteProduct, updateProduct, setSellerSingleProduct, setSellerSingleOrder, updateOrderPacked, setOrderDeliveryPartner, setReturnDeliveryPartner, updateReturnStatus } = sellerSlice.actions
export default sellerSlice.reducer;



