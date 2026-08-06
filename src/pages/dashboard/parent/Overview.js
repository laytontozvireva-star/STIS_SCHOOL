import { useOutletContext } from "react-router-dom";

const Overview = () => {
  const { selectedChild } = useOutletContext();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-textPrimary">Overview</h1>
      <p className="mt-2 font-body text-sm text-textSecondary">
        {selectedChild
          ? `A summary of ${selectedChild.name}'s recent activity will appear here.`
          : "No child selected."}
      </p>
    </div>
  );
};

export default Overview;