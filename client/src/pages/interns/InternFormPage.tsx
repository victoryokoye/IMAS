import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import FormField from "../../components/common/FormField";
import { ErrorAlert, Spinner } from "../../components/common/Feedback";
import { btnPrimary, btnSecondary, inputClass } from "../../components/common/ui";
import { useCreateIntern, useIntern, useUpdateIntern } from "../../hooks/useInterns";
import { toAppError } from "../../utils/errors";
import { toDateInput } from "../../utils/format";
import type { InternInput } from "../../types/api";

const EMPTY = {
  fullName: "",
  phone: "",
  email: "",
  group: "",
  techArea: "",
  course: "",
  skills: "", // comma-separated in the UI, string[] in the API
  startDate: "",
  endDate: "",
};
type FormState = typeof EMPTY;
type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.fullName.trim()) e.fullName = "Full name is required.";
  if (!f.phone.trim()) e.phone = "Phone number is required.";
  if (!f.email.trim()) e.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!f.group.trim()) e.group = "Group is required.";
  if (!f.techArea.trim()) e.techArea = "Tech area is required.";
  if (!f.startDate) e.startDate = "Start date is required.";
  if (!f.endDate) e.endDate = "End date is required.";
  else if (f.startDate && f.endDate < f.startDate) e.endDate = "End date cannot be before the start date.";
  return e;
}

function toInput(f: FormState): InternInput {
  return {
    fullName: f.fullName.trim(),
    phone: f.phone.trim(),
    email: f.email.trim(),
    group: f.group.trim(),
    techArea: f.techArea.trim(),
    ...(f.course.trim() ? { course: f.course.trim() } : {}),
    skills: f.skills.split(",").map((s) => s.trim()).filter(Boolean),
    startDate: f.startDate,
    endDate: f.endDate,
  };
}

export default function InternFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const internQuery = useIntern(id);
  const create = useCreateIntern();
  const update = useUpdateIntern();
  const mutation = isEdit ? update : create;

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const i = internQuery.data;
    if (i) {
      setForm({
        fullName: i.fullName,
        phone: i.phone,
        email: i.email,
        group: i.group,
        techArea: i.techArea,
        course: i.course ?? "",
        skills: (i.skills ?? []).join(", "),
        startDate: toDateInput(i.startDate),
        endDate: toDateInput(i.endDate),
      });
    }
  }, [internQuery.data]);

  const serverFieldErrors = mutation.error ? (toAppError(mutation.error).fieldErrors as Errors) : {};
  const err = (k: keyof FormState) => errors[k] ?? serverFieldErrors[k];

  const set = (k: keyof FormState) => (e: { target: { value: string } }) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const input = toInput(form);
    if (isEdit && id) {
      update.mutate({ id, input }, { onSuccess: () => navigate(`/interns/${id}`) });
    } else {
      create.mutate(input, {
        onSuccess: (created) => navigate(created?.id ? `/interns/${created.id}` : "/interns"),
      });
    }
  };

  if (isEdit && internQuery.isPending) return <Spinner />;
  if (isEdit && internQuery.isError)
    return <ErrorAlert error={internQuery.error} onRetry={() => internQuery.refetch()} />;

  const cancelTo = isEdit ? `/interns/${id}` : "/interns";

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={isEdit ? "Edit intern" : "Add intern"}
        description={isEdit ? undefined : "You can set the attendance PIN from the intern's page after saving."}
      />
      <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-lg border border-slate-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="fullName" error={err("fullName")} required>
            <input id="fullName" className={inputClass(!!err("fullName"))} value={form.fullName} onChange={set("fullName")} />
          </FormField>
          <FormField label="Phone" htmlFor="phone" error={err("phone")} required>
            <input id="phone" type="tel" className={inputClass(!!err("phone"))} value={form.phone} onChange={set("phone")} />
          </FormField>
          <FormField label="Email" htmlFor="email" error={err("email")} required>
            <input id="email" type="email" className={inputClass(!!err("email"))} value={form.email} onChange={set("email")} />
          </FormField>
          <FormField label="Group" htmlFor="group" error={err("group")} required>
            <input id="group" className={inputClass(!!err("group"))} value={form.group} onChange={set("group")} />
          </FormField>
          <FormField label="Tech area" htmlFor="techArea" error={err("techArea")} required>
            <input id="techArea" className={inputClass(!!err("techArea"))} value={form.techArea} onChange={set("techArea")} />
          </FormField>
          <FormField label="Course / program" htmlFor="course" error={err("course")}>
            <input id="course" className={inputClass(!!err("course"))} value={form.course} onChange={set("course")} />
          </FormField>
          <FormField label="Start date" htmlFor="startDate" error={err("startDate")} required>
            <input id="startDate" type="date" className={inputClass(!!err("startDate"))} value={form.startDate} onChange={set("startDate")} />
          </FormField>
          <FormField label="End date" htmlFor="endDate" error={err("endDate")} required>
            <input id="endDate" type="date" className={inputClass(!!err("endDate"))} value={form.endDate} onChange={set("endDate")} />
          </FormField>
        </div>
        <FormField label="Skills" htmlFor="skills" error={err("skills")} hint="Separate skills with commas, e.g. JavaScript, React">
          <input id="skills" className={inputClass(!!err("skills"))} value={form.skills} onChange={set("skills")} />
        </FormField>

        {mutation.error && <ErrorAlert error={mutation.error} />}

        <div className="flex justify-end gap-2">
          <Link to={cancelTo} className={btnSecondary}>
            Cancel
          </Link>
          <button type="submit" className={btnPrimary} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : isEdit ? "Save changes" : "Add intern"}
          </button>
        </div>
      </form>
    </div>
  );
}
