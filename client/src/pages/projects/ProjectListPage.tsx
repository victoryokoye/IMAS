import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import { useAuth } from "../../hooks/useAuth";
import {
  EmptyState,
  ErrorAlert,
  Spinner,
} from "../../components/common/Feedback";
import { btnPrimary, inputClass } from "../../components/common/ui";
import { useProjects } from "../../hooks/useProjects";
import { useDebounce } from "../../hooks/useDebounce";
import { canManageProjects } from "../../utils/permissions";
import { PROJECT_STATUSES } from "../../utils/constants";
import type { ProjectStatus } from "../../types/api";

const PAGE_SIZE = 10;

export default function ProjectListPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const search = params.get("search") ?? "";
  const status = (params.get("status") ?? "") as ProjectStatus | "";

  const [term, setTerm] = useState(search);
  const debounced = useDebounce(term, 400);
  const { staff } = useAuth();
  const canManage = canManageProjects(staff?.role);

  const update = (patch: Record<string, string | number>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "") next.delete(k);
      else next.set(k, String(v));
    });
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (debounced !== search) update({ search: debounced, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const { data, isPending, isError, error, refetch, isFetching } = useProjects({
    page,
    limit: PAGE_SIZE,
    search,
    status,
  });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Projects interns are working on."
        actions={
          // canManage &&
          <Link to="/projects/new" className={btnPrimary}>
            Create project
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          aria-label="Search projects"
          placeholder="Search projects"
          className={`${inputClass()} sm:max-w-sm`}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <select
          aria-label="Filter by status"
          className={`${inputClass()} sm:w-44`}
          value={status}
          onChange={(e) => update({ status: e.target.value, page: 1 })}
        >
          <option value="">All statuses</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {isFetching && !isPending && (
          <span className="self-center text-xs text-slate-500">Updating…</span>
        )}
      </div>

      {isPending ? (
        <Spinner />
      ) : isError ? (
        <ErrorAlert error={error} onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={
            search || status
              ? "Try a different search or filter."
              : "No projects have been recorded yet."
          }
          action={
            canManage && !search && !status ? (
              <Link to="/projects/new" className={btnPrimary}>
                Create project
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Tech area</th>
                  <th className="px-4 py-3 font-medium">Interns</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/projects/${p.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{p.department || "—"}</td>
                    <td className="px-4 py-3">{p.techArea || "—"}</td>
                    <td className="px-4 py-3">{p.internCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            meta={data.meta}
            onPageChange={(p) => update({ page: p })}
            disabled={isFetching}
          />
        </>
      )}
    </div>
  );
}
