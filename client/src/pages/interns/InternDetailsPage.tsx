import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { ErrorAlert, Spinner } from "../../components/common/Feedback";
import { ConfirmDialog } from "../../components/common/Modal";
import SetPinModal from "../../components/interns/SetPinModal";
import { btnPrimary, btnSecondary } from "../../components/common/ui";
import { useIntern, useSetInternStatus } from "../../hooks/useInterns";
import { useCurrentStaff } from "../../hooks/useCurrentStaff";
import { canDeactivateIntern, canSetPin } from "../../utils/permissions";
import { formatDate } from "../../utils/format";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-900">{children || "—"}</dd>
    </div>
  );
}

export default function InternDetailsPage() {
  const { id } = useParams();
  const { data: intern, isPending, isError, error, refetch } = useIntern(id);
  const { data: staff } = useCurrentStaff();
  const statusMutation = useSetInternStatus();

  const [pinOpen, setPinOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isPending) return <Spinner />;
  if (isError) return <ErrorAlert error={error} onRetry={() => refetch()} />;

  const isActive = intern.status === "ACTIVE";
  const nextStatus = isActive ? "INACTIVE" : "ACTIVE";

  return (
    <div>
      <PageHeader
        title={intern.fullName}
        description={intern.email}
        actions={
          <>
            <Link to="/interns" className={btnSecondary}>
              Back to list
            </Link>
            <Link to={`/interns/${intern.id}/edit`} className={btnSecondary}>
              Edit
            </Link>
            {canSetPin(staff?.role) && (
              <button type="button" className={btnSecondary} onClick={() => setPinOpen(true)}>
                Set / reset PIN
              </button>
            )}
            {canDeactivateIntern(staff?.role) && (
              <button type="button" className={btnPrimary} onClick={() => setConfirmOpen(true)}>
                {isActive ? "Deactivate" : "Activate"}
              </button>
            )}
          </>
        }
      />

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Status">
            <StatusBadge status={intern.status} />
          </Detail>
          <Detail label="Phone">{intern.phone}</Detail>
          <Detail label="Group">{intern.group}</Detail>
          <Detail label="Tech area">{intern.techArea}</Detail>
          <Detail label="Course / program">{intern.course}</Detail>
          <Detail label="Internship period">
            {formatDate(intern.startDate)} – {formatDate(intern.endDate)}
          </Detail>
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-xs text-slate-500">Skills</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {intern.skills?.length ? (
                intern.skills.map((s) => (
                  <span key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-sm">—</span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {pinOpen && (
        <SetPinModal internId={intern.id} internName={intern.fullName} onClose={() => setPinOpen(false)} />
      )}

      {confirmOpen && (
        <ConfirmDialog
          title={`${isActive ? "Deactivate" : "Activate"} ${intern.fullName}?`}
          message={
            isActive
              ? "Inactive interns cannot sign in or out. You can activate them again at any time."
              : "This intern will be able to sign in and out again."
          }
          confirmLabel={isActive ? "Deactivate" : "Activate"}
          destructive={isActive}
          loading={statusMutation.isPending}
          error={statusMutation.error ? <ErrorAlert error={statusMutation.error} /> : undefined}
          onCancel={() => {
            statusMutation.reset();
            setConfirmOpen(false);
          }}
          onConfirm={() =>
            statusMutation.mutate({ id: intern.id, status: nextStatus }, { onSuccess: () => setConfirmOpen(false) })
          }
        />
      )}
    </div>
  );
}
