import { useState } from "react";
import { Modal } from "../common/Modal";
import { ErrorAlert, Spinner } from "../common/Feedback";
import Pagination from "../common/Pagination";
import { btnPrimary, btnSecondary, inputClass } from "../common/ui";
import { useDebounce } from "../../hooks/useDebounce";
import { useInterns } from "../../hooks/useInterns";
import { useAssignInterns, useProjectInterns } from "../../hooks/useProjects";

export default function AssignInternsModal({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const search = useDebounce(term, 400);

  // Only ACTIVE interns can be assigned
  const interns = useInterns({ page, limit: 8, search, status: "ACTIVE" });
  // Everyone already on the project (cached; shared with the details page invalidation)
  const assigned = useProjectInterns(projectId, { page: 1, limit: 100 });
  const assignedIds = new Set((assigned.data?.items ?? []).map((i) => i.id));
  const mutation = useAssignInterns();

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const submit = () =>
    mutation.mutate({ id: projectId, internIds: [...selected] }, { onSuccess: onClose });

  return (
    <Modal title="Assign interns" onClose={onClose}>
      <input
        type="search"
        placeholder="Search active interns by name, email, group…"
        aria-label="Search interns"
        className={inputClass()}
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setPage(1);
        }}
      />

      <div className="mt-4 min-h-[8rem]">
        {interns.isPending ? (
          <Spinner />
        ) : interns.isError ? (
          <ErrorAlert error={interns.error} onRetry={() => interns.refetch()} />
        ) : interns.data.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-600">No active interns found.</p>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-md border border-slate-200">
            {interns.data.items.map((i) => {
              const already = assignedIds.has(i.id);
              return (
                <li key={i.id}>
                  <label
                    className={`flex items-center gap-3 px-3 py-2 text-sm ${
                      already ? "cursor-not-allowed bg-slate-50 text-slate-500" : "cursor-pointer hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={already}
                      checked={already || selected.has(i.id)}
                      onChange={() => toggle(i.id)}
                    />
                    <span className="flex-1">
                      <span className="font-medium text-slate-900">{i.fullName}</span>
                      <span className="ml-2 text-slate-500">{i.techArea}</span>
                    </span>
                    {already && <span className="text-xs">Already assigned</span>}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Pagination meta={interns.data?.meta} onPageChange={setPage} disabled={interns.isFetching} />

      {mutation.error && (
        <div className="mt-4">
          <ErrorAlert error={mutation.error} />
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-slate-600">{selected.size} selected</span>
        <div className="flex gap-2">
          <button type="button" className={btnSecondary} onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={submit}
            disabled={selected.size === 0 || mutation.isPending}
          >
            {mutation.isPending ? "Assigning…" : "Assign selected"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
