import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import { ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="flex h-screen">
            {/* Left Side */}
            <div class="hidden lg:flex w-1/2 bg-gradient-to-tr from-red-400  to-[#DC2626]   flex-col justify-between p-12 text-white relative overflow-hidden">

                <div class="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>
                <div class="absolute -bottom-24 -right-10 w-72 h-72 bg-white/10 rounded-full"></div>

                <div class="z-10">
                    <Link to={'/'} class="flex items-center space-x-2">
                        <ClipboardCheck />
                        <span class="font-bold text-2xl drop-shadow-md">dosphere</span>
                    </Link>
                </div>


                <div class="z-10  p-6">
                    <h2 class="text-4xl font-bold leading-tight drop-shadow-md tracking-tight">Clarity, focus, and peace.</h2>
                    <p class="mt-4  text-lg opacity-80 max-w-md drop-shadow-sm">
                        Organize your tasks, declutter your mind, and achieve more.
                    </p>
                </div>


                <div class="z-10 text-sm opacity-70">
                    &copy; 2024 DoSphere Inc. All rights reserved.
                </div>
            </div>


            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#F9FAFB]">
                <header className="lg:hidden fixed gap-20 top-30   flex justify-between items-center py-5 z-10">
                    {/* Logo */}
                    <div className="flex gap-2 sm:gap-3 items-center">
                        <ClipboardCheck
                            className="w-10 h-10 sm:w-10 sm:h-10"
                            strokeWidth={2}
                            color="#DC2626"

                        />
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">DoSphere</h1>
                    </div>

                    {/* Button */}

                </header>
                <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md max-h-1/3 justify-between h-full w-full flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-gray-800">Get Started</h3>
                    <p className="text-gray-500 text-sm mt-2 mb-6">
                        Continue to DoSphere with your Google account.
                    </p>

                    <div className="flex justify-center">
                        <div className="p-2 bg-gradient-to-r from-[#DC2626]   to-red-400  rounded-full shadow-md hover:shadow-lg transition">
                            <div className="bg-white rounded-full">
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        const credential = credentialResponse.credential; // <-- Google ID Token
                                        console.log("Google ID Token:", credential);
                                    }}
                                    onError={() => {
                                        console.error("Login Failed");
                                    }}
                                    theme="outline"
                                    size="large"
                                    text="signin_with"
                                    shape="pill"
                                    logo_alignment="center"
                                />
                            </div>
                        </div>
                    </div>


                    <p className="text-xs text-gray-400 mt-6">
                        By continuing, you agree to our{" "}
                        <span className="text-red-500 hover:underline cursor-pointer">
                            Terms
                        </span>{" "}
                        &{" "}
                        <span className="text-red-500 hover:underline cursor-pointer">
                            Privacy Policy
                        </span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
