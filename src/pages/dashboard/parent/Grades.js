import { useOutletContext } from "react-router-dom";

const Grades = () => {
  const { selectedChild } = useOutletContext();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-textPrimary">Grades</h1>
      <p className="mt-2 font-body text-sm text-textSecondary">
        {selectedChild
          ? `${selectedChild.name}'s grades will appear here once connected to real data.`
          : "No child selected."}
      </p>
    </div>
  );
};

export default Grades;