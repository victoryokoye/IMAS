import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/common/FormField";
import { ErrorAlert, Spinner } from "../../components/common/Feedback";
import {
  btnPrimary,
  btnSecondary,
  inputClass,
} from "../../components/common/ui";
import {
  useCreateProject,
  useProject,
  useUpdateProject,
} from "../../hooks/useProjects";
import { toAppError } from "../../utils/errors";
import { PROJECT_STATUSES } from "../../utils/constants";
import type { ProjectStatus } from "../../types/api";

const EMPTY = {
  name: "",
  description: "",
  department: "",
  status: "OPEN" as ProjectStatus,
  startDate: "",
  endDate: "",
};
type FormState = typeof EMPTY;
type Errors = Partial<Record<keyof FormState, string>>;

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const projectQuery = useProject(id);
  const create = useCreateProject();
  const update = useUpdateProject();
  const mutation = isEdit ? update : create;

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const p = projectQuery.data;
    if (p) {
      setForm({
        name: p.name,
        description: p.description ?? "",
        department: p.department ?? "",
        status: p.status,
        startDate: p.startDate,
        endDate: p.endDate,
      });
    }
  }, [projectQuery.data]);

  const serverFieldErrors = mutation.error
    ? (toAppError(mutation.error).fieldErrors as Errors)
    : {};
  const err = (k: keyof FormState) => errors[k] ?? serverFieldErrors[k];

  const set = (k: keyof FormState) => (e: { target: { value: string } }) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v: Errors = {};
    if (!form.name.trim()) v.name = "Project name is required.";
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const base = {
      name: form.name.trim(),
      description: form.description.trim(),
      department: form.department.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
    };
    if (isEdit && id) {
      update.mutate(
        { id, input: base },
        { onSuccess: () => navigate(`/projects/${id}`) },
      );
    } else {
      create.mutate(
        { ...base, status: form.status },
        {
          onSuccess: (created) =>
            navigate(created?.id ? `/projects/${created.id}` : "/projects"),
        },
      );
    }
  };

  if (isEdit && projectQuery.isPending) return <Spinner />;
  if (isEdit && projectQuery.isError)
    return (
      <ErrorAlert
        error={projectQuery.error}
        onRetry={() => projectQuery.refetch()}
      />
    );

  return (
    <div className="max-w-2xl">
      <PageHeader title={isEdit ? "Edit project" : "Create project"} />
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5 rounded-lg border border-slate-200 bg-white p-6"
      >
        <FormField
          label="Project name"
          htmlFor="name"
          error={err("name")}
          required
        >
          <input
            id="name"
            className={inputClass(!!err("name"))}
            value={form.name}
            onChange={set("name")}
          />
        </FormField>
        <FormField
          label="Description"
          htmlFor="description"
          error={err("description")}
        >
          <textarea
            id="description"
            rows={4}
            className={inputClass(!!err("description"))}
            value={form.description}
            onChange={set("description")}
          />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Department"
            htmlFor="department"
            error={err("department")}
            hint="Where applicable"
          >
            <input
              id="department"
              className={inputClass(!!err("department"))}
              value={form.department}
              onChange={set("department")}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Start Date
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]"
            />
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              End Date
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              min={form.startDate || undefined}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]"
            />
          </div>
        </div>

        {!isEdit && (
          <FormField label="Status" htmlFor="status" error={err("status")}>
            <select
              id="status"
              className={inputClass(!!err("status"))}
              value={form.status}
              onChange={set("status")}
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </FormField>
        )}

        {mutation.error && <ErrorAlert error={mutation.error} />}

        <div className="flex justify-end gap-2">
          <Link
            to={isEdit ? `/projects/${id}` : "/projects"}
            className={btnSecondary}
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={btnPrimary}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving…"
              : isEdit
                ? "Save changes"
                : "Create project"}
          </button>
        </div>
      </form>
    </div>
  );
}
