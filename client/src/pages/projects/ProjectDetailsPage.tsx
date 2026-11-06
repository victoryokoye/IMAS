import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import { EmptyState, ErrorAlert, Spinner } from "../../components/common/Feedback";
import { ConfirmDialog } from "../../components/common/Modal";
import AssignInternsModal from "../../components/projects/AssignInternsModal";
import { btnPrimary, btnSecondary, inputClass } from "../../components/common/ui";
import {
  useProject,
  useProjectInterns,
  useRemoveProjectIntern,
  useSetProjectStatus,
} from "../../hooks/useProjects";
import { useCurrentStaff } from "../../hooks/useCurrentStaff";
import { canManageProjects } from "../../utils/permissions";
import { PROJECT_STATUSES } from "../../utils/constants";
import { formatDate } from "../../utils/format";
import type { ProjectIntern, ProjectStatus } from "../../types/api";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { data: staff } = useCurrentStaff();
  const canManage = canManageProjects(staff?.role);

  const project = useProject(id);
  const [page, setPage] = useState(1);
  const interns = useProjectInterns(id, { page, limit: 10 });

  const statusMutation = useSetProjectStatus();
  const removeMutation = useRemoveProjectIntern();

  const [pendingStatus, setPendingStatus] = useState<ProjectStatus | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [toRemove, setToRemove] = useState<ProjectIntern | null>(null);

  if (project.isPending) return <Spinner />;
  if (project.isError) return <ErrorAlert error={project.error} onRetry={() => project.refetch()} />;

  const p = project.data;
  const selectedStatus = pendingStatus ?? p.status;
  const statusChanged = selectedStatus !== p.status;

  return (
    <div>
      <PageHeader
        title={p.name}
        actions={
          <>
            <Link to="/projects" className={btnSecondary}>
              Back to list
            </Link>
            {canManage && (
              <Link to={`/projects/${p.id}/edit`} className={btnSecondary}>
                Edit
              </Link>
            )}
          </>
        }
      />

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">Status</dt>
            <dd className="mt-1">
              <StatusBadge status={p.status} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Department</dt>
            <dd className="mt-0.5 text-sm">{p.department || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Tech area</dt>
            <dd className="mt-0.5 text-sm">{p.techArea || "—"}</dd>
          </div>
          <div className="sm:col-span-3">
            <dt className="text-xs text-slate-500">Description</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-sm">{p.description || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Created</dt>
            <dd className="mt-0.5 text-sm">{formatDate(p.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Last updated</dt>
            <dd className="mt-0.5 text-sm">{formatDate(p.updatedAt)}</dd>
          </div>
        </dl>

        {canManage && (
          <div className="mt-6 flex flex-wrap items-end gap-3 border-t border-slate-200 pt-5">
            <div>
              <label htmlFor="project-status" className="mb-1 block text-sm font-medium text-slate-800">
                Change status
              </label>
              <select
                id="project-status"
                className={`${inputClass()} w-44`}
                value={selectedStatus}
                onChange={(e) => {
                  statusMutation.reset();
                  setPendingStatus(e.target.value as ProjectStatus);
                }}
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className={btnPrimary}
              disabled={!statusChanged || statusMutation.isPending}
              onClick={() =>
                statusMutation.mutate(
                  { id: p.id, status: selectedStatus },
                  { onSuccess: () => setPendingStatus(null) },
                )
              }
            >
              {statusMutation.isPending ? "Saving…" : "Update status"}
            </button>
          </div>
        )}
        {statusMutation.error && (
          <div className="mt-3">
            <ErrorAlert error={statusMutation.error} />
          </div>
        )}
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Interns on this project</h2>
          {canManage && (
            <button type="button" className={btnPrimary} onClick={() => setAssignOpen(true)}>
              Assign interns
            </button>
          )}
        </div>

        {interns.isPending ? (
          <Spinner />
        ) : interns.isError ? (
          <ErrorAlert error={interns.error} onRetry={() => interns.refetch()} />
        ) : interns.data.items.length === 0 ? (
          <EmptyState title="No interns assigned" description="Assign interns to track who is working on this project." />
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Tech area</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Assigned</th>
                    {canManage && <th className="px-4 py-3" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {interns.data.items.map((i) => (
                    <tr key={i.id}>
                      <td className="px-4 py-3">
                        <Link to={`/interns/${i.id}`} className="font-medium text-slate-900 hover:underline">
                          {i.fullName}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{i.techArea || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={i.status} />
                      </td>
                      <td className="px-4 py-3">{formatDate(i.assignedAt)}</td>
                      {canManage && (
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            className="text-sm font-medium text-red-600 hover:underline"
                            onClick={() => setToRemove(i)}
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination meta={interns.data.meta} onPageChange={setPage} disabled={interns.isFetching} />
          </>
        )}
      </section>

      {assignOpen && <AssignInternsModal projectId={p.id} onClose={() => setAssignOpen(false)} />}

      {toRemove && (
        <ConfirmDialog
          title={`Remove ${toRemove.fullName}?`}
          message="They will no longer be listed on this project. Their intern record is not affected."
          confirmLabel="Remove"
          destructive
          loading={removeMutation.isPending}
          error={removeMutation.error ? <ErrorAlert error={removeMutation.error} /> : undefined}
          onCancel={() => {
            removeMutation.reset();
            setToRemove(null);
          }}
          onConfirm={() =>
            removeMutation.mutate(
              { id: p.id, internId: toRemove.id },
              {
                onSuccess: () => {
                  setToRemove(null);
                  // step back a page if we just removed the last row of this page
                  if (interns.data?.items.length === 1 && page > 1) setPage(page - 1);
                },
              },
            )
          }
        />
      )}
    </div>
  );
}
