import { Loader2 } from 'lucide-react'
import React from 'react'

const MainLoader = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Loader2 className="animate-spin text-red-500"></Loader2>
        </div>
    )
}

export default MainLoader