import { useState, type FormEvent } from "react";
import { Modal } from "../common/Modal";
import FormField from "../common/FormField";
import { ErrorAlert } from "../common/Feedback";
import { btnPrimary, btnSecondary, inputClass } from "../common/ui";
import { useSetInternPin } from "../../hooks/useInterns";
import { PIN_LENGTH } from "../../utils/constants";

export default function SetPinModal({
  internId,
  internName,
  onClose,
}: {
  internId: string;
  internName: string;
  onClose: () => void;
}) {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState("");
  const [saved, setSaved] = useState(false);
  const mutation = useSetInternPin();

  const digitsOnly = (v: string) => v.replace(/\D/g, "").slice(0, PIN_LENGTH);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (pin.length !== PIN_LENGTH) return setLocalError(`PIN must be exactly ${PIN_LENGTH} digits.`);
    if (pin !== confirm) return setLocalError("The two PINs do not match.");
    setLocalError("");
    mutation.mutate({ id: internId, pin }, { onSuccess: () => setSaved(true) });
  };

  if (saved) {
    return (
      <Modal title="PIN saved" onClose={onClose}>
        <p className="text-sm text-slate-700">
          {internName}'s attendance PIN has been set. Let them know to remember it.
        </p>
        <div className="mt-6 flex justify-end">
          <button type="button" className={btnPrimary} onClick={onClose}>
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={`Set PIN for ${internName}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <FormField label="New PIN" htmlFor="pin" hint={`${PIN_LENGTH} digits`} required>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            className={inputClass(Boolean(localError))}
            value={pin}
            onChange={(e) => setPin(digitsOnly(e.target.value))}
          />
        </FormField>
        <FormField label="Confirm PIN" htmlFor="pin-confirm" error={localError} required>
          <input
            id="pin-confirm"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            className={inputClass(Boolean(localError))}
            value={confirm}
            onChange={(e) => setConfirm(digitsOnly(e.target.value))}
          />
        </FormField>
        {mutation.error && <ErrorAlert error={mutation.error} />}
        <div className="flex justify-end gap-2">
          <button type="button" className={btnSecondary} onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Save PIN"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
