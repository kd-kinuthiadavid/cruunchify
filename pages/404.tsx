import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  return (
    <section className="h-screen flex flex-col items-center gap-y-10 text-center mx-5">
      <h1 className="font-black text-8xl md:text-9xl">Oops !</h1>
      <h2 className="font-black text-5xl md:text-6xl text-cr-light-green">
        404
      </h2>
      <p className="font-bold text-xl md:text-3xl max-w-lg leading-normal">
        We couldn't find what you're looking for. Please try again.
      </p>
      <button
        className="flex items-center bg-cr-light-green px-10 py-5 gap-x-5 rounded-md mb-10"
        onClick={() => router.push("/dashboard")}
      >
        <small className="text-lg lg:text-xl font-semibold capitalize">
          Go Back Home
        </small>
      </button>
    </section>
  );
}
