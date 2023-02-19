import { useRouter } from "next/router";
import React from "react";

const comingSoon = () => {
  const router = useRouter();
  return (
    <section className="flex gap-y-20 flex-col justify-center items-center text-center mx-5">
      <h1 className="font-black text-7xl md:text-9xl break-words">
        Coming Soon!
      </h1>
      <div className="flex flex-col items-center gap-y-10">
        <p className="text-3xl md:text-4xl md:max-w-4xl font-thin leading-relaxed">
          Psst ... guess what? This feature is still cooking up in the lab.
          We're working hard to bring this and other innovative features that
          will take your experience to the next level. Thanks for your patience.
        </p>
        <button
          className="flex justify-center items-center bg-cr-light-green px-10 py-5 gap-x-5 rounded-md mb-10 lg:max-w-lg"
          onClick={() => router.push("/dashboard")}
        >
          <small className="text-lg lg:text-xl font-semibold capitalize">
            Go Back Home
          </small>
        </button>
      </div>
    </section>
  );
};

export default comingSoon;
