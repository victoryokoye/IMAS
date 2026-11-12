import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import {
  EmptyState,
  ErrorAlert,
  Spinner,
} from "../../components/common/Feedback";
import { btnPrimary, inputClass } from "../../components/common/ui";
import { useInterns } from "../../hooks/useInterns";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDate } from "../../utils/format";
import type { ActiveStatus } from "../../types/api";

const PAGE_SIZE = 10;

export default function InternListPage() {
  // Filters live in the URL so they survive refresh/back and can be shared
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const search = params.get("search") ?? "";
  const status = (params.get("status") ?? "") as ActiveStatus | "";

  const [term, setTerm] = useState(search);
  const debounced = useDebounce(term, 400);

  const update = (patch: Record<string, string | number>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (debounced !== search) update({ search: debounced, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const { data, isPending, isError, error, refetch, isFetching } = useInterns({
    page,
    limit: PAGE_SIZE,
    search,
    status,
  });

  return (
    <div>
      <PageHeader
        title="Interns"
        description="Search, view and manage intern records."
        actions={
          <Link to="/interns/new" className={btnPrimary}>
            Add intern
          </Link>
        }
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          aria-label="Search interns"
          placeholder="Search by name, phone, email, group or tech area"
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
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
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
          title="No interns found"
          description={
            search || status
              ? "Try a different search or filter."
              : "Add the first intern to get started."
          }
          action={
            !search && !status ? (
              <Link to="/interns/new" className={btnPrimary}>
                Add intern
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
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Group</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Internship</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/interns/${i.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {i.name}
                      </Link>
                      <div className="text-xs text-slate-500">{i.email}</div>
                    </td>
                    <td className="px-4 py-3">{i.group}</td>
                    <td className="px-4 py-3">{i.course}</td>
                    <td className="px-4 py-3">{i.department}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(i.startDate)} – {formatDate(i.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={i.status} />
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
