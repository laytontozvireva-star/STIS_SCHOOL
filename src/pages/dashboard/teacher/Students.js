const Students = () => {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-heading font-bold text-textPrimary">
          Students
        </h1>
        <div className="rounded-xl border border-border bg-surface p-6">
          <ul className="space-y-3 text-sm text-textSecondary">
            <li className="flex items-center justify-between border-b border-border/50 pb-3">
              <span>John Doe</span>
              <span className="text-textPrimary font-medium">Grade 10</span>
            </li>
            <li className="flex items-center justify-between border-b border-border/50 pb-3">
              <span>Jane Smith</span>
              <span className="text-textPrimary font-medium">Grade 10</span>
            </li>
            <li className="flex items-center justify-between pb-3">
              <span>Alex Johnson</span>
              <span className="text-textPrimary font-medium">Grade 10</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Students;