import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { states, lgasByState } from "../data/nigeriaLocations";

const gradeOptions = [
  "A1",
  "B2",
  "B3",
  "C4",
  "C5",
  "C6",
  "D7",
  "E8",
  "F9",
];

const subjectOptions = [
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Government",
  "Literature in English",
  "Geography",
  "Agricultural Science",
  "Computer Studies",
  "Civic Education",
  "Commerce",
  "Accounting",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Further Mathematics",
  "Technical Drawing",
  "Home Economics",
  "Food and Nutrition",
  "Data Processing",
  "French",
  "Yoruba",
  "Hausa",
  "Igbo",
];

const createInitialSubjects = () =>
  Array.from({ length: 9 }, () => ({
    subject: "",
    grade: "",
  }));

function ApplicationForm() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

 const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  nin: "",
  state: "",
  lga: "",
  address: "",


    schoolName: "",
    examType: "",
    examYear: "",
    course: "",
    jambScore: "",
    oLevelSubjects: createInitialSubjects(),

    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianRelationship: "",
    guardianAddress: "",
  });

  const [errors, setErrors] = useState({});

  // Update normal input fields
  const updateFormData = (field, value) => {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [field]: "",
    }));
  };

  // Update O'Level subject and grade
  const updateSubject = (index, field, value) => {
    setFormData((previousData) => {
      const updatedSubjects = [...previousData.oLevelSubjects];

      updatedSubjects[index] = {
        ...updatedSubjects[index],
        [field]: value,
      };

      return {
        ...previousData,
        oLevelSubjects: updatedSubjects,
      };
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      [`subject-${index}`]: "",
      [`grade-${index}`]: "",
    }));
  };

  // Validate the current step
  const validateStep = () => {
    const newErrors = {};

    // STEP 1
    if (currentStep === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required.";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required.";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required.";
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required.";
      }

      if (!formData.nin.trim()) {
  newErrors.nin = "NIN is required.";
} else if (!/^\d{11}$/.test(formData.nin)) {
  newErrors.nin = "NIN must contain exactly 11 digits.";
}

if (!formData.state) {
  newErrors.state = "Please select your state.";
}

if (!formData.lga) {
  newErrors.lga = "Please select your local government area.";
}

      if (!formData.address.trim()) {
        newErrors.address = "Address is required.";
      }
    }

    // STEP 2
    if (currentStep === 2) {
      if (!formData.schoolName.trim()) {
        newErrors.schoolName = "School name is required.";
      }

      if (!formData.examType) {
        newErrors.examType = "Please select your examination type.";
      }

      if (!formData.examYear) {
        newErrors.examYear = "Exam year is required.";
      }

      if (!formData.course.trim()) {
        newErrors.course = "Course is required.";
      }

      if (
        formData.jambScore === "" ||
        Number(formData.jambScore) < 0 ||
        Number(formData.jambScore) > 400
      ) {
        newErrors.jambScore = "JAMB score must be between 0 and 400.";
      }

      const selectedSubjects = [];

      formData.oLevelSubjects.forEach((item, index) => {
        if (!item.subject) {
          newErrors[`subject-${index}`] = "Select a subject.";
        }

        if (!item.grade) {
          newErrors[`grade-${index}`] = "Select a grade.";
        }

        if (item.subject) {
          if (selectedSubjects.includes(item.subject)) {
            newErrors[`subject-${index}`] = "This subject has already been selected.";
          } else {
            selectedSubjects.push(item.subject);
          }
        }
      });
    }

    // STEP 3
    if (currentStep === 3) {
      if (!formData.guardianName.trim()) {
        newErrors.guardianName = "Guardian name is required.";
      }

      if (!formData.guardianPhone.trim()) {
        newErrors.guardianPhone = "Guardian phone is required.";
      }

      if (!formData.guardianEmail.trim()) {
        newErrors.guardianEmail = "Guardian email is required.";
      }

      if (!formData.guardianRelationship.trim()) {
        newErrors.guardianRelationship =
          "Guardian relationship is required.";
      }

      if (!formData.guardianAddress.trim()) {
        newErrors.guardianAddress = "Guardian address is required.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Go to the next step
  const handleNext = (event) => {
    event.preventDefault();

    console.log("NEXT CLICKED");
    console.log("Current step:", currentStep);

    const isValid = validateStep();

    if (!isValid) {
      console.log("Validation failed");
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((previousStep) => previousStep + 1);
    }
  };

  // Go to previous step
  const handlePrevious = (event) => {
    event.preventDefault();

    if (currentStep > 1) {
      setCurrentStep((previousStep) => previousStep - 1);
    }
  };

  // Submit application
  const handleSubmit = async (event) => {
  event.preventDefault();

  console.log("SUBMIT CLICKED");
  console.log("Current step:", currentStep);

  // Prevent submission unless the user is on the review step
  if (currentStep !== 4) {
    console.log("Submission blocked.");
    return;
  }

  console.log("Application Data:", formData);

  const applicationData = {
    ...formData,
   applicationId: `APP-2026-${Date.now()}`,
    status: "Under Review",
    submittedDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  try {
    // Send the application to JSON Server
    const response = await api.post("/applications", applicationData);

    console.log("Application saved successfully:", response.data);

    // Keep a local copy temporarily for the dashboard and confirmation page
    localStorage.setItem(
      "applyNowApplication",
      JSON.stringify(response.data)
    );

    // Move to the confirmation page
    navigate("/confirmation");
  } catch (error) {
    console.error("Error submitting application:", error);
    alert("Unable to submit application. Please try again.");
  }
};

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Page Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Apply for Admission
          </h1>

          <p className="mt-2 text-gray-600">
            Complete your application step by step.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-1 items-center">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                  currentStep >= step
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>

              {step !== 4 && (
                <div
                  className={`mx-2 h-1 flex-1 ${
                    currentStep > step
                      ? "bg-blue-700"
                      : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <p className="mb-6 text-center font-semibold text-gray-600">
          Step {currentStep} of 4
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-lg md:p-10"
        >

          {/* STEP 1 */}
          {currentStep === 1 && (
            <section>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Personal Information
              </h2>

              <p className="mb-6 text-gray-600">
                Tell us about yourself.
              </p>

              <div className="grid gap-5 md:grid-cols-2">

                <FormField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) =>
                    updateFormData("firstName", value)
                  }
                  error={errors.firstName}
                />

                <FormField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) =>
                    updateFormData("lastName", value)
                  }
                  error={errors.lastName}
                />

                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) =>
                    updateFormData("email", value)
                  }
                  error={errors.email}
                />

                <FormField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(value) =>
                    updateFormData("phone", value)
                  }
                  error={errors.phone}
                />

                <FormField
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(value) =>
                    updateFormData("dateOfBirth", value)
                  }
                  error={errors.dateOfBirth}
                />

                <FormField
  label="NIN"
  type="text"
  value={formData.nin}
  onChange={(value) =>
    updateFormData("nin", value)
  }
  error={errors.nin}
/>

<SelectField
  label="State"
  value={formData.state}
  onChange={(value) => {
    setFormData((previousData) => ({
      ...previousData,
      state: value,
      lga: "",
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      state: "",
      lga: "",
    }));
  }}
  options={states}
  error={errors.state}
/>

<SelectField
  label="Local Government Area"
  value={formData.lga}
  onChange={(value) =>
    updateFormData("lga", value)
  }
  options={formData.state ? lgasByState[formData.state] || [] : []}
  error={errors.lga}
/>

                <div className="md:col-span-2">
                  <FormField
                    label="Address"
                    value={formData.address}
                    onChange={(value) =>
                      updateFormData("address", value)
                    }
                    error={errors.address}
                  />
                </div>

              </div>
            </section>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <section>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Academic Information
              </h2>

              <p className="mb-6 text-gray-600">
                Provide your academic and O&apos;Level information.
              </p>

              <div className="grid gap-5 md:grid-cols-2">

                <FormField
                  label="Secondary School Name"
                  value={formData.schoolName}
                  onChange={(value) =>
                    updateFormData("schoolName", value)
                  }
                  error={errors.schoolName}
                />

                <SelectField
                  label="Examination Type"
                  value={formData.examType}
                  onChange={(value) =>
                    updateFormData("examType", value)
                  }
                  options={["WAEC", "NECO", "NABTEB"]}
                  error={errors.examType}
                />

                <FormField
                  label="Examination Year"
                  type="number"
                  value={formData.examYear}
                  onChange={(value) =>
                    updateFormData("examYear", value)
                  }
                  error={errors.examYear}
                />

                <FormField
                  label="Preferred Course"
                  value={formData.course}
                  onChange={(value) =>
                    updateFormData("course", value)
                  }
                  error={errors.course}
                />

                <FormField
                  label="JAMB Score"
                  type="number"
                  value={formData.jambScore}
                  onChange={(value) =>
                    updateFormData("jambScore", value)
                  }
                  error={errors.jambScore}
                />

              </div>

              {/* O'LEVEL SUBJECTS */}
              <div className="mt-8">
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  O&apos;Level Results
                </h3>

                <p className="mb-5 text-sm text-gray-600">
                  Select 9 subjects and their corresponding grades.
                </p>

                <div className="space-y-4">
                  {formData.oLevelSubjects.map((item, index) => (
                    <SubjectGradeRow
                      key={index}
                      index={index}
                      subject={item.subject}
                      grade={item.grade}
                      onChange={updateSubject}
                      subjectOptions={subjectOptions}
                      gradeOptions={gradeOptions}
                      subjectError={errors[`subject-${index}`]}
                      gradeError={errors[`grade-${index}`]}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <section>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Guardian Information
              </h2>

              <p className="mb-6 text-gray-600">
                Provide the details of your parent or guardian.
              </p>

              <div className="grid gap-5 md:grid-cols-2">

                <FormField
                  label="Guardian Name"
                  value={formData.guardianName}
                  onChange={(value) =>
                    updateFormData("guardianName", value)
                  }
                  error={errors.guardianName}
                />

                <FormField
                  label="Guardian Phone"
                  value={formData.guardianPhone}
                  onChange={(value) =>
                    updateFormData("guardianPhone", value)
                  }
                  error={errors.guardianPhone}
                />

                <FormField
                  label="Guardian Email"
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(value) =>
                    updateFormData("guardianEmail", value)
                  }
                  error={errors.guardianEmail}
                />

                <FormField
                  label="Relationship"
                  value={formData.guardianRelationship}
                  onChange={(value) =>
                    updateFormData(
                      "guardianRelationship",
                      value
                    )
                  }
                  error={errors.guardianRelationship}
                />

                <div className="md:col-span-2">
                  <FormField
                    label="Guardian Address"
                    value={formData.guardianAddress}
                    onChange={(value) =>
                      updateFormData("guardianAddress", value)
                    }
                    error={errors.guardianAddress}
                  />
                </div>

              </div>
            </section>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <section>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Review & Submit
              </h2>

              <p className="mb-8 text-gray-600">
                Review your information before submitting your application.
              </p>

              <ReviewSection title="Personal Information">
                <ReviewItem
                  label="Name"
                  value={`${formData.firstName} ${formData.lastName}`}
                />

                <ReviewItem
                  label="Email"
                  value={formData.email}
                />

                <ReviewItem
                  label="Phone"
                  value={formData.phone}
                />

                <ReviewItem
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                />

                <ReviewItem
  label="NIN"
  value={formData.nin}
/>

<ReviewItem
  label="State"
  value={formData.state}
/>

<ReviewItem
  label="Local Government Area"
  value={formData.lga}
/>

                <ReviewItem
                  label="Address"
                  value={formData.address}
                />
              </ReviewSection>

              <ReviewSection title="Academic Information">
                <ReviewItem
                  label="Secondary School"
                  value={formData.schoolName}
                />

                <ReviewItem
                  label="Exam Type"
                  value={formData.examType}
                />

                <ReviewItem
                  label="Exam Year"
                  value={formData.examYear}
                />

                <ReviewItem
                  label="Preferred Course"
                  value={formData.course}
                />

                <ReviewItem
                  label="JAMB Score"
                  value={formData.jambScore}
                />
              </ReviewSection>

              <ReviewSection title="O'Level Results">
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
                      {formData.oLevelSubjects.map(
                        (item, index) => (
                          <tr key={index}>
                            <td className="border p-3">
                              {item.subject}
                            </td>

                            <td className="border p-3 font-semibold">
                              {item.grade}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </ReviewSection>

              <ReviewSection title="Guardian Information">
                <ReviewItem
                  label="Guardian Name"
                  value={formData.guardianName}
                />

                <ReviewItem
                  label="Phone"
                  value={formData.guardianPhone}
                />

                <ReviewItem
                  label="Email"
                  value={formData.guardianEmail}
                />

                <ReviewItem
                  label="Relationship"
                  value={formData.guardianRelationship}
                />

                <ReviewItem
                  label="Address"
                  value={formData.guardianAddress}
                />
              </ReviewSection>
            </section>
          )}

          {/* NAVIGATION */}
          <div className="mt-10 flex items-center justify-between border-t pt-6">

            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Submit Application
              </button>
            )}

          </div>
        </form>
      </div>
    </main>
  );
}

/* Reusable text input component */
function FormField({
  label,
  type = "text",
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* Reusable select component */
function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select an option</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* Reusable subject and grade component */
function SubjectGradeRow({
  index,
  subject,
  grade,
  onChange,
  subjectOptions,
  gradeOptions,
  subjectError,
  gradeError,
}) {
  return (
    <div className="grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 md:grid-cols-2">

      <div>
        <label className="mb-2 block font-medium text-gray-700">
          Subject {index + 1}
        </label>

        <select
          value={subject}
          onChange={(event) =>
            onChange(index, "subject", event.target.value)
          }
          className={`w-full rounded-lg border bg-white px-4 py-3 ${
            subjectError
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select Subject</option>

          {subjectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {subjectError && (
          <p className="mt-1 text-sm text-red-600">
            {subjectError}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">
          Grade
        </label>

        <select
          value={grade}
          onChange={(event) =>
            onChange(index, "grade", event.target.value)
          }
          className={`w-full rounded-lg border bg-white px-4 py-3 ${
            gradeError
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select Grade</option>

          {gradeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {gradeError && (
          <p className="mt-1 text-sm text-red-600">
            {gradeError}
          </p>
        )}
      </div>

    </div>
  );
}

/* Reusable review section */
function ReviewSection({ title, children }) {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 p-5">
      <h3 className="mb-4 text-lg font-bold text-gray-900">
        {title}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

/* Reusable review item */
function ReviewItem({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default ApplicationForm;