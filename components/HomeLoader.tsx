import React from "react";

const HomeLoader = () => {
  return (
    <div className="flex flex-col items-center animate-pulse gap-y-5 md:gap-y-10 px-5 md:px-10">
      <div className="w-full h-[300px] bg-cr-loader-bg rounded-lg"></div>
      <div className="w-full px-1 md:px-10">
        <div className="w-full h-[100px] bg-cr-loader-bg rounded-lg"></div>
      </div>
      <div className="w-full px-2 md:px-40">
        <div className="w-full h-[200px] bg-cr-loader-bg rounded-lg"></div>
      </div>
      <div className="w-full mt-5 px-2 md:px-52 flex md:gap-x-5">
        <div className="w-full h-[70px] bg-cr-loader-bg rounded-md"></div>
        <div className="hidden md:visible w-full h-[70px] bg-cr-loader-bg rounded-md"></div>
      </div>
    </div>
  );
};

export default HomeLoader;
