function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Create Your Application",
      description:
        "Provide your personal, academic, and guardian information through our guided application form.",
    },
    {
      number: "02",
      title: "Submit for Review",
      description:
        "Review your information carefully and submit your completed application for admission review.",
    },
    {
      number: "03",
      title: "Track Your Application",
      description:
        "Monitor your application status from your dashboard and stay updated throughout the process.",
    },
  ];

  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-700">
            Simple Application Process
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How ApplyNow Works
          </h2>

          <p className="mt-4 text-gray-600">
            Our application process is designed to make applying for
            admission simple, clear, and convenient.
          </p>
        </div>

        {/* Process Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Number */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-3 leading-7 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;