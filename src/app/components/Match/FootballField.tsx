import React from "react";

const FootballField = () => {
    return (
        <div className="relative w-full h-full opacity-20">
            {/* Outer Field Border */}
            <div className="absolute inset-[1rem] border-2 border-custom_dark_red rounded-lg"></div>

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] aspect-square rounded-full border-2 border-red-800"></div>

            {/* Center line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-red-800"></div>

            {/* Center spot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-800"></div>

            {/* Top penalty area */}
            <div className="absolute top-[1rem] left-1/2 -translate-x-1/2 w-[60%] h-[20%] border-2 border-red-800"></div>

            {/* Top goal area */}
            <div className="absolute top-[1rem] left-1/2 -translate-x-1/2 w-[30%] h-[8%] border-2 border-red-800"></div>

            {/* Top goal */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[25%] h-[1rem] border-b-2 border-red-800"></div>

            {/* Bottom penalty area */}
            <div className="absolute bottom-[1rem] left-1/2 -translate-x-1/2 w-[60%] h-[20%] border-2 border-red-800"></div>

            {/* Bottom goal area */}
            <div className="absolute bottom-[1rem] left-1/2 -translate-x-1/2 w-[30%] h-[8%] border-2 border-red-800"></div>

            {/* Bottom goal */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[1rem] border-t-2 border-red-800"></div>

            {/* Top penalty spot */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-800"></div>

            {/* Bottom penalty spot */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-800"></div>
        </div>
    );
};

export default FootballField;
