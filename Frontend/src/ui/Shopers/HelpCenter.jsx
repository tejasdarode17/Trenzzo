import React from "react";

const HelpCenter = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 md:px-16 lg:px-24">
            <div className="max-w-6xl mx-auto">

                {/* Page Header */}
                <div className="text-center mb-14">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                        Help & Support Center
                    </h1>
                    <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                        Have questions about your orders, payments, or account management? 
                        Our dedicated support team is ready to assist you. Reach out through 
                        any of the channels below.
                    </p>
                </div>

                {/* Contact Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    
                    {/* Email Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="mb-6 flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Email Support
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            For detailed inquiries and documentation support
                        </p>
                        <a 
                            href="mailto:support@trenzzo.com" 
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-base transition-colors"
                        >
                            support@trenzzo.com
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="mb-6 flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Phone Support
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Monday to Friday, 9:00 AM - 6:00 PM IST
                        </p>
                        <a 
                            href="tel:+918605605058" 
                            className="inline-flex items-center text-gray-900 hover:text-indigo-700 font-semibold text-lg transition-colors"
                        >
                            +91 860 560 5058
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>

                    {/* Address Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="mb-6 flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Corporate Office
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Visit us at our headquarters
                        </p>
                        <div className="space-y-2">
                            <p className="text-gray-900 font-medium leading-relaxed">
                                Nagpur, Maharashtra
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                441106, India
                            </p>
                        </div>
                    </div>

                </div>

                {/* Additional Info Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 md:p-10 border border-indigo-100">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Still Need Assistance?
                        </h2>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Our typical response time is within 24 hours for emails and instant 
                            support during business hours for calls. For urgent matters, we 
                            recommend calling our support line.
                        </p>
                        <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-700 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            Support team is currently online
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HelpCenter;