const Overview = () => {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-heading font-bold text-textPrimary">
          Teacher Dashboard
        </h1>
        <div className="mb-6 rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-heading font-semibold text-textPrimary">
            Upcoming Classes
          </h2>
          <ul className="space-y-2 text-sm text-textSecondary">
            <li>Mathematics - Grade 10 - 9:00 AM - Room 203</li>
            <li>Science - Grade 10 - 10:30 AM - Lab 1</li>
            <li>English Literature - Grade 10 - 1:00 PM - Room 105</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-heading font-semibold text-textPrimary">
            Recent Assignments
          </h2>
          <ul className="space-y-2 text-sm text-textSecondary">
            <li>Math Homework - Due: Aug 5, 2025</li>
            <li>Science Lab Report - Due: Aug 7, 2025</li>
            <li>English Essay - Due: Aug 10, 2025</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;