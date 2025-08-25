import { CheckCircle, Circle, ListFilter } from "lucide-react";
import React from "react";

const Completed = () => {
    return (
        <div className="w-full">
            <header className="p-5 flex justify-end">
                <div className="relative w-6 h-6">
                    <Circle className="absolute inset-0 text-gray-500" strokeWidth={1.5} />
                    <ListFilter className="absolute inset-0 m-auto w-3.5 h-3.5 text-gray-700" />
                </div>
            </header>
            <div className="flex flex-col max-w-4xl mx-auto w-full">
                <h3 className="text-3xl font-bold">Activity</h3>
                <div className="mt-4">
                    <h3 className="text-sm font-bold border-b border-gray-200 pb-2">
                        22 Aug 2025 • Friday
                    </h3>
                    <div className="flex flex-row py-4 gap-4 border-b border-gray-200">
                        <div className="relative">
                            <img
                                className="w-12 h-12 rounded-full shadow"
                                src="https://lh3.googleusercontent.com/a/ACg8ocKhQjJ7cwMhqmJCi9k-5pdrktEkvNX2fhMJwKTo04uQmRpRuTK5=s96-c"
                                alt="User"
                            />
                            <CheckCircle className="absolute bottom-0 right-0 w-4 h-4 text-green-500 bg-white rounded-full" />
                        </div>

                        <div className="flex flex-col w-full gap-2">
                            <p className="text-sm">
                                <span className="font-bold">You</span> completed a task:{" "}
                                <span className="underline">Task Title</span>
                            </p>
                            <div className="flex flex-row justify-between text-xs">
                                <h4>01:15</h4>
                                <h4>
                                    Home <span className="text-gray-500">#</span>
                                </h4>
                            </div>
                        </div>
                        
                    </div>
                     <div className="flex flex-row py-4 gap-4 border-b border-gray-200">
                        <div className="relative">
                            <img
                                className="w-12 h-12 rounded-full shadow"
                                src="https://lh3.googleusercontent.com/a/ACg8ocKhQjJ7cwMhqmJCi9k-5pdrktEkvNX2fhMJwKTo04uQmRpRuTK5=s96-c"
                                alt="User"
                            />
                            <CheckCircle className="absolute bottom-0 right-0 w-4 h-4 text-green-500 bg-white rounded-full" />
                        </div>

                        <div className="flex flex-col w-full gap-2">
                            <p className="text-sm">
                                <span className="font-bold">You</span> completed a task:{" "}
                                <span className="underline">Task Title</span>
                            </p>
                            <div className="flex flex-row justify-between text-xs">
                                <h4>01:15</h4>
                                <h4>
                                    Home <span className="text-gray-500">#</span>
                                </h4>
                            </div>
                        </div>
                        
                    </div>
                     <div className="flex flex-row py-4 gap-4 border-b border-gray-200">
                        <div className="relative">
                            <img
                                className="w-12 h-12 rounded-full shadow"
                                src="https://lh3.googleusercontent.com/a/ACg8ocKhQjJ7cwMhqmJCi9k-5pdrktEkvNX2fhMJwKTo04uQmRpRuTK5=s96-c"
                                alt="User"
                            />
                            <CheckCircle className="absolute bottom-0 right-0 w-4 h-4 text-green-500 bg-white rounded-full" />
                        </div>

                        <div className="flex flex-col w-full gap-2">
                            <p className="text-sm">
                                <span className="font-bold">You</span> completed a task:{" "}
                                <span className="underline">Task Title</span>
                            </p>
                            <div className="flex flex-row justify-between text-xs">
                                <h4>01:15</h4>
                                <h4>
                                    Home <span className="text-gray-500">#</span>
                                </h4>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Completed;
