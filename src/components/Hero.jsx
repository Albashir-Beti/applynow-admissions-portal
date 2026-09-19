import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl text-center">

        {/* Small Label */}
        <span className="mb-5 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          Online Admissions Portal
        </span>

        {/* Main Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Start Your Journey to
          <span className="mt-2 block text-blue-100">
            Higher Education
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
          Apply for admission online, track your application,
          and stay updated throughout the admission process.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <Link
         to="/apply"
         className="inline-flex items-center rounded-lg bg-white px-7 py-3.5 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50 hover:shadow-xl"
          >
         Start Your Application
         <span className="ml-2">→</span>
         </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;