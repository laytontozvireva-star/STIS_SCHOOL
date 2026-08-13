import { useEffect, useState } from "react";
import { getContactMessages, updateContactMessageStatus } from "../../../services/contactMessagesService";

const statusLabels = { new: "New", in_progress: "In progress", resolved: "Resolved" };

const ManageContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState("Loading messages...");

  const loadMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
      setFeedback(data.length ? "" : "No contact messages yet.");
    } catch (error) {
      setFeedback(error.message || "Could not load contact messages.");
    }
  };

  useEffect(() => { loadMessages(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateContactMessageStatus(id, status);
      await loadMessages();
    } catch (error) {
      setFeedback(error.message || "Could not update the message status.");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-textPrimary">Contact Messages</h1>
      <p className="mt-2 font-body text-sm text-textSecondary">Review enquiries sent through the school website.</p>
      {feedback ? <p className="mt-5 font-body text-sm text-textSecondary">{feedback}</p> : (
        <div className="mt-6 space-y-4">
          {messages.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div className="min-w-0">
                  <h2 className="font-heading text-lg font-semibold text-textPrimary">{item.name}</h2>
                  <a href={`mailto:${item.email}`} className="mt-1 inline-block font-body text-sm text-primary hover:underline">{item.email}</a>
                  <p className="mt-3 whitespace-pre-wrap font-body text-sm leading-relaxed text-textSecondary">{item.message}</p>
                  <p className="mt-3 font-body text-xs text-textSecondary">Received {new Date(item.created_at).toLocaleString()}</p>
                </div>
                <select aria-label={`Status for message from ${item.name}`} value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)} className="h-10 shrink-0 rounded-xl border border-border bg-white px-3 font-body text-sm text-textPrimary">
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageContactMessages;