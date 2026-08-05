import { NeuralField } from "@/components/NeuralField";

/**
 * Site-wide fixed background stack: drifting purple aurora, blueprint
 * grid and the interactive neural network - the "AI substrate" every
 * section sits on.
 */
export function Backdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden"
      aria-hidden="true"
    >
      <div className="bg-aurora absolute -inset-[15%]" />
      <div className="bg-grid absolute inset-0" />
      <NeuralField className="absolute inset-0 h-full w-full opacity-60" />
    </div>
  );
}
