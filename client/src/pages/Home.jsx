import React from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const Home = () => {
    return (
        <div className="h-screen w-full bg-gradient-to-b from-pink-100 to-white flex flex-col items-center justify-center relative">
            {/* Top Bar */}
            


            {/* Centered Content */}
            <div className="text-center px-4">
                {/* Robot Image */}
                <div className="w-28 h-28 mx-auto mb-6">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712038.png" /* Replace with your image */
                        alt="Robot"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Text Content */}
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                    Hey Developer! 👋
                </h2>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2">
                    Welcome to our app
                </h1>
                <p className="text-gray-600 mt-4 max-w-md mx-auto">
                    Let’s start with a quick product tour and we will have you up and
                    running in no time!
                </p>

                {/* Get Started Button */}
                <Link to='/Profile'><button className="mt-6 bg-gray-900 text-white py-2 px-6 rounded-full shadow-lg hover:bg-gray-700 transition">
                    Profile
                </button></Link>
            </div>
        </div>
    )
}

export default Home