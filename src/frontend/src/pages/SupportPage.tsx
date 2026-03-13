import { ChevronDown, ChevronUp, LifeBuoy, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { type SupportTicket, TicketStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function SupportPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!actor || !identity) return;
    actor.getUserTickets(identity.getPrincipal()).then(setTickets);
  }, [actor, identity]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSubmit = async () => {
    if (!actor || !subject || !message) return;
    setSubmitting(true);
    try {
      await actor.createSupportTicket(subject, message);
      setSuccess(true);
      setSubject("");
      setMessage("");
      refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch {}
    setSubmitting(false);
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Support</h1>
        <p className="text-slate-400 text-sm mt-1">
          Create a ticket and get help from our team
        </p>
      </div>

      {/* New ticket */}
      <div className="smm-card p-6 max-w-lg">
        <h2 className="text-lg font-semibold text-white mb-4">New Ticket</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="support-subject"
              className="block text-sm text-slate-300 mb-1"
            >
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Describe the issue briefly"
              id="support-subject"
              data-ocid="support.subject.input"
              className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="support-message"
              className="block text-sm text-slate-300 mb-1"
            >
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Explain in detail..."
              id="support-message"
              data-ocid="support.message.textarea"
              className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          {success && (
            <p
              className="text-green-400 text-sm"
              data-ocid="support.create.success_state"
            >
              Ticket submitted successfully!
            </p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !subject || !message}
            data-ocid="support.create.submit_button"
            className="smm-btn-primary flex items-center gap-2 py-2.5 px-6 disabled:opacity-50"
          >
            <Send size={16} />
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </div>

      {/* Tickets list */}
      <div className="smm-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">My Tickets</h2>
        {tickets.length === 0 ? (
          <div
            className="text-center py-10 text-slate-500"
            data-ocid="support.tickets.empty_state"
          >
            <LifeBuoy size={40} className="mx-auto mb-2 opacity-30" />
            <p>No tickets yet</p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="support.tickets.list">
            {tickets.map((t, i) => (
              <div
                key={String(t.id)}
                className="border border-blue-900/30 rounded-lg overflow-hidden"
                data-ocid={`support.ticket.item.${i + 1}`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-900/10 transition-colors"
                  onClick={() =>
                    setExpanded(expanded === String(t.id) ? null : String(t.id))
                  }
                  data-ocid={`support.ticket.toggle.${i + 1}`}
                >
                  <div>
                    <div className="text-white font-medium text-sm">
                      {t.subject}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {new Date(
                        Number(t.timestamp) / 1_000_000,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === TicketStatus.open ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}`}
                    >
                      {t.status}
                    </span>
                    {expanded === String(t.id) ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </div>
                </button>
                {expanded === String(t.id) && (
                  <div className="px-4 pb-4 space-y-3 border-t border-blue-900/30 pt-3">
                    <p className="text-slate-300 text-sm">{t.message}</p>
                    {t.adminReply && (
                      <div className="bg-blue-900/20 rounded-lg p-3">
                        <div className="text-xs text-blue-400 font-medium mb-1">
                          Admin Reply
                        </div>
                        <p className="text-slate-300 text-sm">{t.adminReply}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
