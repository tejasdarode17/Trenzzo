import { createSlice } from "@reduxjs/toolkit";

const sellerSlice = createSlice({
    name: "seller",
    initialState: {
        notifications: {
            data: [],
            unreadCount: 0
        },
        returnNotification: {
            data: [],
            unreadCount: 0
        }
    },

    reducers: {
        addSellerNotification(state, action) {
            state.notifications.data.unshift(action.payload);
            state.notifications.unreadCount += 1;
        },

        markSellerNotificationsRead(state) {
            state.notifications.unreadCount = 0;
            state.notifications.data.forEach(n => n.read = true);
        },

        addSellerReturnNotification(state, action) {
            state.returnNotification.data.unshift(action.payload);
            state.returnNotification.unreadCount += 1;
        },

        markSellerReturnNotificationsRead(state) {
            state.returnNotification.unreadCount = 0;
            state.returnNotification.data.forEach(n => n.read = true);
        },

    },
})

export const { addSellerNotification, markSellerNotificationsRead, addSellerReturnNotification, markSellerReturnNotificationsRead } = sellerSlice.actions
export default sellerSlice.reducer;



