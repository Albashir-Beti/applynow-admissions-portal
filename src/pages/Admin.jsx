import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Admin() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications");

        console.log(
          "Admin applications fetched:",
          response.data
        );

        setApplications(response.data);
      } catch (error) {
        console.error(
          "Error fetching applications:",
          error
        );
      }
    };

    fetchApplications();
  }, []);

  // Statistics
  const totalApplications = applications.length;

  const underReviewCount = applications.filter(
    (application) => application.status === "Under Review"
  ).length;

  const approvedCount = applications.filter(
    (application) => application.status === "Approved"
  ).length;

  const rejectedCount = applications.filter(
  (application) => application.status === "Rejected"
).length;

  // Applications that are still waiting for an admin decision
const pendingApplications = applications.filter(
  (application) => application.status === "Under Review"
);

// Applications that already have a decision
const decidedApplications = applications.filter(
  (application) =>
    application.status === "Approved" ||
    application.status === "Rejected"
);

// Keep pending applications in submission order.
// The person who submitted first stays at the top.
const sortedPendingApplications = [...pendingApplications].sort(
  (a, b) => Number(a.id) - Number(b.id)
);

// Put the most recently decided applications first
const sortedDecidedApplications = [...decidedApplications].sort(
  (a, b) => Number(b.id) - Number(a.id)
);

// All Applications:
// pending applications first, then approved/rejected applications
const sortedApplications = [
  ...sortedPendingApplications,
  ...sortedDecidedApplications,
];

// Show the first 3 applications still waiting for a decision
const recentApplications = sortedPendingApplications.slice(0, 3);

  // Approve or reject a specific application
  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const response = await api.patch(
        `/applications/${applicationId}`,
        {
          status: status,
        }
      );

      console.log(
        `Application ${status.toLowerCase()}:`,
        response.data
      );

      // Update only the application that was changed
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? response.data
            : application
        )
      );
    } catch (error) {
      console.error(
        `Error updating application status:`,
        error
      );

      alert("Unable to update application status.");
    }
  };

  // No applications exist
  if (applications.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">

          <div className="mb-8">
            <p className="font-semibold uppercase tracking-wide text-blue-700">
              Admin Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>

          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              No Applications Found
            </h2>

            <p className="mt-3 text-gray-600">
              There are currently no submitted applications to review.
            </p>

            <Link
              to="/"
              className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Back to Home
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="font-semibold uppercase tracking-wide text-blue-700">
            Admin Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Application Management
          </h1>

          <p className="mt-3 text-gray-600">
            Review and manage submitted admission applications.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            title="Total Applications"
            value={totalApplications}
          />

          <AdminStatCard
            title="Under Review"
            value={underReviewCount}
          />

          <AdminStatCard
            title="Approved"
            value={approvedCount}
          />

          <AdminStatCard
  title="Rejected"
  value={rejectedCount}
/>

               </div>

        {/* Recent Applications */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
  Applications Awaiting Review
</h2>

<p className="mt-2 text-gray-600">
  Applications waiting for an admission decision.
</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Applicant
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Application ID
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Course
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Submitted
                  </th>

                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
  {recentApplications.length === 0 ? (
    <tr>
      <td
        colSpan="5"
        className="p-8 text-center text-gray-500"
      >
        No applications are currently waiting for review.
      </td>
    </tr>
  ) : (
    recentApplications.map((application) => {
                  const applicantName =
                    `${application.firstName || ""} ${
                      application.lastName || ""
                    }`.trim() || "Applicant";

                  return (
                    <tr
                      key={application.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="p-4 font-semibold text-gray-900">
                        {applicantName}
                      </td>

                      <td className="p-4 text-gray-600">
                        {application.applicationId}
                      </td>

                      <td className="p-4 text-gray-600">
                        {application.course}
                      </td>

                      <td className="p-4 text-gray-600">
                        {application.submittedDate || "Not available"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                            application.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : application.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
            )}
              </tbody>

            </table>
          </div>

        </div>

        {/* All Applications */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            All Applications
          </h2>

          <p className="mt-2 text-gray-600">
            Review applicant information and make admission decisions.
          </p>
        </div>

        <div className="space-y-8">
       

          {sortedApplications.map((application) => {
            const isApproved =
              application.status === "Approved";

            const isRejected =
              application.status === "Rejected";

            const applicantName =
              `${application.firstName || ""} ${
                application.lastName || ""
              }`.trim() || "Applicant";

            return (
              <div
                key={application.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >

                {/* Application Header */}
                <div className="border-b border-gray-200 p-6">

                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {applicantName}
                      </h2>

                      <p className="mt-2 text-gray-600">
                        Application ID:{" "}
                        <span className="font-semibold text-gray-900">
                          {application.applicationId}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                        isApproved
                          ? "bg-green-100 text-green-700"
                          : isRejected
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {application.status}
                    </span>

                  </div>

                  <p className="mt-4 text-gray-600">
                    Review the applicant&apos;s information before
                    making an admission decision.
                  </p>

                </div>

                {/* Applicant Information */}
                <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">

                  <AdminDetail
                    label="Applicant Name"
                    value={applicantName}
                  />

                  <AdminDetail
                    label="Application ID"
                    value={application.applicationId}
                  />

                  <AdminDetail
                    label="Course"
                    value={application.course}
                  />

                  <AdminDetail
                    label="Email"
                    value={application.email}
                  />

                  <AdminDetail
                    label="Phone"
                    value={application.phone}
                  />

                  <AdminDetail
                    label="JAMB Score"
                    value={application.jambScore}
                  />

                  <AdminDetail
                    label="Examination"
                    value={application.examType}
                  />

                  <AdminDetail
                    label="Exam Year"
                    value={application.examYear}
                  />

                  <AdminDetail
                    label="Application Status"
                    value={application.status}
                  />

                </div>

                {/* O'Level Results */}
                <div className="border-t border-gray-200 p-6">

                  <h3 className="mb-5 text-xl font-bold text-gray-900">
                    O&apos;Level Results
                  </h3>

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

                        {application.oLevelSubjects?.map(
                          (subject, index) => (
                            <tr key={index}>

                              <td className="border p-3">
                                {subject.subject}
                              </td>

                              <td className="border p-3 font-semibold">
                                {subject.grade}
                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

                {/* Decision Area */}
                <div className="border-t border-gray-200 bg-gray-50 p-6">

                  <h3 className="text-xl font-bold text-gray-900">
                    Admission Decision
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Review the application and choose an appropriate
                    status.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(
                          application.id,
                          "Approved"
                        )
                      }
                      disabled={isApproved}
                      className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isApproved
                        ? "Application Approved"
                        : "Approve Application"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(
                          application.id,
                          "Rejected"
                        )
                      }
                      disabled={isRejected}
                      className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isRejected
                        ? "Application Rejected"
                        : "Reject Application"}
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap gap-4">

          <Link
            to="/"
            className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            Back to Home
          </Link>

          <Link
            to="/dashboard"
            className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            View Applicant Dashboard
          </Link>

        </div>

      </div>
    </main>
  );
}

/* Reusable admin statistic card */
function AdminStatCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
}

/* Reusable admin detail component */
function AdminDetail({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {value || "Not provided"}
      </p>

    </div>
  );
}

export default Admin;