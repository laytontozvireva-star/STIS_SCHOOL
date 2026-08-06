const Classes = () => {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-heading font-bold text-textPrimary">
          Classes
        </h1>
        <div className="rounded-xl border border-border bg-surface p-6">
          <ul className="space-y-3 text-sm text-textSecondary">
            <li className="flex items-center justify-between border-b border-border/50 pb-3">
              <span>Mathematics - Grade 10</span>
              <span>Room 203</span>
            </li>
            <li className="flex items-center justify-between border-b border-border/50 pb-3">
              <span>Science - Grade 10</span>
              <span>Lab 1</span>
            </li>
            <li className="flex items-center justify-between pb-3">
              <span>English Literature - Grade 10</span>
              <span>Room 105</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Classes;