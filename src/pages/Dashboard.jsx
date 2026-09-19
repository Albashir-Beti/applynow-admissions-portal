import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Search for an application using the unique Application ID
  const handleSearch = async (event) => {
    event.preventDefault();

    const enteredId = applicationId.trim();

    if (!enteredId) {
      setError("Please enter your Application ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setApplication(null);

      // Search JSON Server using the applicationId field
      const response = await api.get("/applications", {
        params: {
          applicationId: enteredId,
        },
      });

      if (response.data.length > 0) {
        setApplication(response.data[0]);
      } else {
        setError(
          "Application not found. Please check your Application ID and try again."
        );
      }
    } catch (error) {
      console.error("Error searching for application:", error);

      setError(
        "Unable to check your application right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Allow applicant to search for another application
  const handleClear = () => {
    setApplication(null);
    setApplicationId("");
    setError("");
  };

  // Show Application ID search before displaying the dashboard
  if (!application) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm md:p-10">

            <div className="text-center">
              <p className="font-semibold uppercase tracking-wide text-blue-700">
                Applicant Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                Check Application Status
              </h1>

              <p className="mt-4 leading-7 text-gray-600">
                Enter the Application ID you received after submitting
                your application to view your application details and
                admission status.
              </p>
            </div>

            <form onSubmit={handleSearch} className="mt-8">

              <label
                htmlFor="applicationId"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Application ID
              </label>

              <input
                id="applicationId"
                type="text"
                value={applicationId}
                onChange={(event) => {
                  setApplicationId(event.target.value);
                  setError("");
                }}
                placeholder="e.g. APP-2026-1789812345678"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

              {error && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Checking..." : "Check Application Status"}
              </button>

            </form>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm leading-6 text-blue-800">
                <strong>Note:</strong> Use the exact Application ID
                provided to you after submitting your application.
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Haven&apos;t submitted an application yet?
              </p>

              <Link
                to="/apply"
                className="mt-2 inline-block font-semibold text-blue-700 hover:text-blue-800"
              >
                Start a New Application →
              </Link>
            </div>

          </div>
        </div>
      </main>
    );
  }

  const statusSteps = [
    "Application Started",
    "Application Submitted",
    "Under Review",
    "Decision",
  ];

  const applicantName =
    `${application.firstName || ""} ${application.lastName || ""}`.trim() ||
    "Applicant";

 const oLevelSubjects = application.oLevelSubjects || [];

/*
  Rule-Based AI Admission Status Predictor

  JAMB contributes 60% of the prediction.
  O'Level results contribute 40%.

  Both results are normalized to a 0-100 scale
  before the final weighted score is calculated.
*/
const gradePoints = {
  A1: 100,
  B2: 90,
  B3: 80,
  C4: 70,
  C5: 60,
  C6: 50,
  D7: 40,
  E8: 30,
  F9: 0,
};

// Convert JAMB score from 0-400 to 0-100
const jambScore = Number(application.jambScore) || 0;
const normalizedJambScore = (jambScore / 400) * 100;

// Calculate average O'Level performance
const validOLevelGrades = oLevelSubjects
  .map((subject) => gradePoints[subject.grade])
  .filter((score) => score !== undefined);

const oLevelAverage =
  validOLevelGrades.length > 0
    ? validOLevelGrades.reduce((total, score) => total + score, 0) /
      validOLevelGrades.length
    : 0;

// Weighted prediction:
// JAMB = 60%, O'Level = 40%
const predictionScore = Math.round(
  normalizedJambScore * 0.6 + oLevelAverage * 0.4
);

// Convert the score into a prediction category
let prediction = "Low Likelihood";

if (predictionScore >= 70) {
  prediction = "High Likelihood";
} else if (predictionScore >= 50) {
  prediction = "Moderate Likelihood";
}

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-10">
          <p className="font-semibold uppercase tracking-wide text-blue-700">
            Applicant Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Welcome Back, {applicantName}
          </h1>

          <p className="mt-3 text-gray-600">
            Track your admission application and view its current status.
          </p>

          <button
            type="button"
            onClick={handleClear}
            className="mt-4 font-semibold text-blue-700 transition hover:text-blue-800"
          >
            ← Check Another Application
          </button>
        </div>

        {/* Application Summary */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">

          <DashboardCard
            title="Application ID"
            value={application.applicationId}
          />

          <DashboardCard
            title="Course"
            value={application.course}
          />

          <DashboardCard
            title="Status"
            value={application.status}
          />

        </div>

        {/* Application Status */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Application Status
              </h2>

              <p className="mt-2 text-gray-600">
                {application.status === "Approved"
                  ? "Congratulations! Your application has been approved."
                  : application.status === "Rejected"
                    ? "A decision has been made on your application."
                    : "Your application is currently being reviewed."}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                application.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : application.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {application.status}
            </span>

          </div>

          {/* Status Progress */}
          <div className="grid gap-6 md:grid-cols-4">

            {statusSteps.map((step, index) => {
              const isCompleted =
                index < 3 ||
                (index === 3 &&
                  (application.status === "Approved" ||
                    application.status === "Rejected"));

              return (
                <div
                  key={step}
                  className="flex items-center gap-3 md:block"
                >

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${
                      isCompleted
                        ? "bg-blue-700 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  <div className="md:mt-3">
                    <p
                      className={`font-semibold ${
                        isCompleted
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step}
                    </p>
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* Main Dashboard Content */}
<div className="grid gap-8 lg:grid-cols-3">

  {/* Application Details */}
  <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">

    <h2 className="mb-6 text-2xl font-bold text-gray-900">
      Application Details
    </h2>

    <div className="grid gap-6 md:grid-cols-2">

      <DetailItem
        label="Applicant Name"
        value={applicantName}
      />

      <DetailItem
        label="Course"
        value={application.course}
      />

      <DetailItem
        label="Application ID"
        value={application.applicationId}
      />

      <DetailItem
        label="Submitted Date"
        value={application.submittedDate}
      />

      <DetailItem
        label="JAMB Score"
        value={application.jambScore}
      />

      <DetailItem
        label="Examination Type"
        value={application.examType}
      />

      <DetailItem
        label="Examination Year"
        value={application.examYear}
      />

      <DetailItem
        label="Secondary School"
        value={application.schoolName}
      />

    </div>

  </div>

  {/* Applicant Information */}
  <div className="rounded-2xl bg-white p-6 shadow-sm">

    <h2 className="text-2xl font-bold text-gray-900">
      Applicant Information
    </h2>

    <p className="mt-2 text-sm leading-6 text-gray-600">
      Personal information provided with your application.
    </p>

    <div className="mt-6 space-y-5">

      <ApplicantInfo
        label="Email"
        value={application.email}
      />

      <ApplicantInfo
        label="Phone"
        value={application.phone}
      />

      <ApplicantInfo
        label="State"
        value={application.state}
      />

      <ApplicantInfo
        label="Local Government Area"
        value={application.lga}
      />

      <ApplicantInfo
        label="NIN"
        value={application.nin}
      />

    </div>

  </div>

</div>

{/* AI Admission Status Predictor */}
<div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">

  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
        Rule-Based Prediction
      </p>

      <h2 className="mt-2 text-2xl font-bold text-gray-900">
        AI Admission Status Predictor
      </h2>

      <p className="mt-2 max-w-2xl leading-7 text-gray-600">
        This predictor analyzes your JAMB and O&apos;Level results
        using a weighted scoring system to estimate your admission
        likelihood.
      </p>
    </div>

    <div className="rounded-2xl bg-blue-50 px-8 py-5 text-center">
      <p className="text-sm font-medium text-gray-500">
        Prediction Score
      </p>

      <p className="mt-1 text-4xl font-bold text-blue-700">
        {predictionScore}%
      </p>
    </div>

  </div>

  <div className="mt-8 grid gap-6 md:grid-cols-3">

    <PredictionItem
      label="JAMB Performance"
      value={`${Math.round(normalizedJambScore)}%`}
    />

    <PredictionItem
      label="O'Level Performance"
      value={`${Math.round(oLevelAverage)}%`}
    />

    <PredictionItem
      label="Predicted Outcome"
      value={prediction}
    />

  </div>

  <div className="mt-6 rounded-xl bg-yellow-50 p-4">
    <p className="text-sm leading-6 text-yellow-800">
      <strong>Important:</strong> This prediction is only an estimate
      based on academic results. It does not represent the official
      admission decision. Final approval or rejection is determined
      by the admission officer.
    </p>
  </div>

</div>


        {/* O'Level Results */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            O&apos;Level Results
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-gray-100">

                  <th className="border p-3 text-left">
                    Subject
                  </th>

                  <th className="border p-3 text-left">
                    Grade
                  </th>

                </tr>
              </thead>

              <tbody>

                {oLevelSubjects.map((subject, index) => (
                  <tr key={index}>

                    <td className="border p-3">
                      {subject.subject}
                    </td>

                    <td className="border p-3 font-semibold">
                      {subject.grade}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap gap-4">

          <Link
            to="/"
            className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            Back to Home
          </Link>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-blue-700 px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Check Another Application
          </button>

          <Link
            to="/apply"
            className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            New Application
          </Link>

        </div>

      </div>
    </main>
  );
}

/* Reusable dashboard card */
function DashboardCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-2 break-words text-2xl font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
}

/* Reusable application detail item */
function DetailItem({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-4">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-gray-900">
        {value || "Not provided"}
      </p>

    </div>
  );
}

/* Reusable applicant information item */
function ApplicantInfo({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-gray-900">
        {value || "Not provided"}
      </p>

    </div>
  );
}

/* Reusable predictor information item */
function PredictionItem({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 p-5">

      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
}

export default Dashboard;