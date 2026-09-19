import { Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProcessSection from "./components/ProcessSection";

import ApplicationForm from "./pages/ApplicationForm";
import Dashboard from "./pages/Dashboard";
import Confirmation from "./pages/Confirmation";
import Admin from "./pages/Admin";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ProcessSection />
      </main>

      <footer className="bg-gray-950 px-6 py-10 text-white">
  <div className="mx-auto max-w-6xl">

    <div className="flex flex-col items-center justify-between gap-6 border-b border-gray-800 pb-8 md:flex-row">
      
      {/* Logo */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-blue-400">
          Apply<span className="text-white">Now</span>
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
          A simple and convenient online admissions portal
          for managing your university application journey.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex gap-6 text-sm text-gray-400">
        <Link
  to="/"
  className="transition hover:text-white"
>
  Home
</Link>

        <Link
  to="/apply"
  className="transition hover:text-white"
>
  Apply
</Link>
        <Link
  to="/dashboard"
  className="transition hover:text-white"
>
  Dashboard
</Link>

      </div>
    </div>

    {/* Copyright */}
    <div className="pt-6 text-center text-sm text-gray-500">
      <p>© 2026 ApplyNow. All rights reserved.</p>
    </div>

  </div>
</footer>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

<Route
  path="/apply"
  element={
    <>
      <Navbar />
      <ApplicationForm />
    </>
  }
/>

<Route
  path="/confirmation"
  element={
    <>
      <Navbar />
      <Confirmation />
    </>
  }
/>

<Route
  path="/dashboard"
  element={
    <>
      <Navbar />
      <Dashboard />
    </>
  }
/>

<Route
  path="/admin"
  element={
    <>
      <Navbar />
      <Admin />
    </>
  }
/>
    </Routes>
  );
}

export default App;