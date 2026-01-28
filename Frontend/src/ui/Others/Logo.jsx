import React from 'react'
import { useNavigate } from 'react-router-dom';

const Logo = () => {

    const navigate = useNavigate()

    return (
        <div onClick={() => navigate("/")} className="flex items-center gap-3 pointer">
            <svg
                width="36"
                height="36"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Trenzzo Logo"
            >
                <rect width="100" height="100" rx="20" fill="#E17100" />
                <path
                    d="M30 35H70V45H55V70H45V45H30V35Z"
                    fill="white"
                />
            </svg>

            <span className="text-xl font-bold tracking-tight text-gray-900">
                Trenzzo
            </span>

        </div>
    );
};


export default Logo