import { useEffect, useRef, useState } from "react";
import { Modal } from "../../components/common/Modal";
import { ErrorAlert } from "../../components/common/Feedback";
import {
  btnPrimary,
  btnSecondary,
  inputClass,
} from "../../components/common/ui";
import { useSignIn, useSignOut } from "../../hooks/useAttendance";
import { PIN_LENGTH } from "../../utils/constants";

/**
 * Props:
 *  intern  : { id, fullName }
 *  action  : "SIGN_IN" | "SIGN_OUT"
 *  onClose : () => void
 *  onDone  : (record) => void   // called after the API confirms the action
 */
export default function PinDialog({ intern, action, onClose, onDone }) {
  const isSignIn = action === "SIGN_IN";
  const signIn = useSignIn();
  const signOut = useSignOut();
  const mutation = isSignIn ? signIn : signOut;

  const [pin, setPin] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const close = () => {
    if (!mutation.isPending) onClose();
  };

  const handleChange = (e) => {
    if (mutation.error) mutation.reset(); // clear the old "Invalid PIN" once they retype
    setPin(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH));
  };

  const submit = (e) => {
    e.preventDefault();
    if (pin.length !== PIN_LENGTH) return;
    mutation.mutate(
      { internId: intern.id, pin },
      {
        onSuccess: (record) => onDone?.(record),
        onError: () => {
          setPin(""); // never leave a wrong PIN on screen
          inputRef.current?.focus();
        },
      },
    );
  };

  return (
    <Modal
      title={`${isSignIn ? "Sign in" : "Sign out"}: ${intern.fullName}`}
      onClose={close}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <p className="text-sm text-slate-600">
          Hand the device to {intern.fullName} to enter their {PIN_LENGTH}-digit
          PIN.
        </p>

        <div>
          <label
            htmlFor="attendance-pin"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            PIN
          </label>
          <input
            id="attendance-pin"
            ref={inputRef}
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={PIN_LENGTH}
            className={`${inputClass(Boolean(mutation.error))} text-center text-lg tracking-[0.5em]`}
            value={pin}
            onChange={handleChange}
            disabled={mutation.isPending}
          />
        </div>

        {mutation.error && <ErrorAlert error={mutation.error} />}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className={btnSecondary}
            onClick={close}
            disabled={mutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={btnPrimary}
            disabled={pin.length !== PIN_LENGTH || mutation.isPending}
          >
            {mutation.isPending
              ? "Verifying…"
              : isSignIn
                ? "Sign in"
                : "Sign out"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
