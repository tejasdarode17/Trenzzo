import React from "react";
import { CheckCircle, Clock, } from "lucide-react";
import { useSelector } from "react-redux";

const DeliveryDashboard = () => {

    const { allDeliveryOrders, ongingOrders } = useSelector((store) => store.delivery);
    const { userData } = useSelector((store) => store.auth)
    return (
        <div className="min-h-screen bg-gray-100 flex">

            <div className="flex-1 p-6">

                <h1 className="text-3xl font-bold mb-4">Welcome, {userData.username} 👋</h1>
                <p className="text-gray-600 mb-6">Here’s your current delivery overview.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-4">
                            <Clock className="text-blue-500" size={30} />
                            <div>
                                <p className="text-gray-600 text-sm">Ongoing Deliveries</p>
                                <h3 className="text-xl font-bold">{ongingOrders.length}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-4">
                            <CheckCircle className="text-green-500" size={30} />
                            <div>
                                <p className="text-gray-600 text-sm">All Orders</p>
                                <h3 className="text-xl font-bold">{allDeliveryOrders.length}</h3>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DeliveryDashboard;
