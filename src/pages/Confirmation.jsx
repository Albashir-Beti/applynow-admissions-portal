import { useState } from "react";
import { Link } from "react-router-dom";

function Confirmation() {
  // Get the submitted application from localStorage
  const savedApplication = localStorage.getItem("applyNowApplication");

  const application = savedApplication
    ? JSON.parse(savedApplication)
    : null;

  const [copied, setCopied] = useState(false);

  // Copy Application ID to clipboard
  const handleCopy = async () => {
    if (!application?.applicationId) return;

    try {
      await navigator.clipboard.writeText(application.applicationId);

      setCopied(true);

      // Change the button back after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy Application ID:", error);
    }
  };

  // If no submitted application was found
  if (!application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-gray-900">
            No Application Found
          </h1>

          <p className="mt-4 text-gray-600">
            We could not find a recently submitted application.
          </p>

          <Link
            to="/apply"
            className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Start Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-md md:p-12">

        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <span className="text-4xl text-green-600">✓</span>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-bold text-gray-900 md:text-4xl">
          Application Submitted Successfully!
        </h1>

        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-600">
          Thank you for submitting your application through ApplyNow.
          Your application has been received and is now being reviewed.
        </p>

        {/* Application ID */}
        <div className="mx-auto mt-8 max-w-md rounded-xl bg-blue-50 p-6">
          <p className="text-sm font-medium text-gray-500">
            Your Application ID
          </p>

          <p className="mt-2 break-all text-2xl font-bold text-blue-700">
            {application.applicationId}
          </p>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            {copied ? "✓ Copied!" : "Copy Application ID"}
          </button>

          <p className="mt-4 text-sm font-medium leading-6 text-gray-700">
            Please copy and save your Application ID. You will need it
            whenever you want to check your application and admission status.
          </p>
        </div>

        {/* Important Notice */}
        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-left">
          <p className="font-semibold text-yellow-800">
            Important
          </p>

          <p className="mt-1 text-sm leading-6 text-yellow-700">
            Keep your Application ID safe. If you leave this page,
            you will need this ID to access your application status
            from the applicant dashboard.
          </p>
        </div>

        {/* Status */}
        <div className="mt-8 rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Current Status
          </p>

          <span className="mt-2 inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
            {application.status}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/dashboard"
            className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Check Application Status
          </Link>

          <Link
            to="/"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Confirmation;