"use client";
const STEPS = [
  { n:1, label:"Occasion & Budget" },
  { n:2, label:"Pick Products" },
  { n:3, label:"Your Logo" },
  { n:4, label:"AI Combo" },
  { n:5, label:"Review & Quote" },
];

interface Props { currentStep: number; setStep: (s: 1|2|3|4|5) => void; }

export default function StepperNav({ currentStep, setStep }: Props) {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-[70px] z-50">
      <div className="container-site py-4">
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
          {STEPS.map(({ n, label }, i) => {
            const done   = n < currentStep;
            const active = n === currentStep;
            return (
              <div key={n} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => done && setStep(n as 1|2|3|4|5)}
                  disabled={!done}
                  className={`flex flex-col items-center gap-1.5 px-3 md:px-4 ${done ? "cursor-pointer" : "cursor-default"}`}
                >
                  {/* Circle */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    done   ? "bg-teal text-white" :
                    active ? "bg-navy text-white ring-4 ring-navy/20" :
                             "bg-gray-100 text-gray-400 border-2 border-gray-200"
                  }`}>
                    {done ? "✓" : n}
                  </div>
                  {/* Label */}
                  <span className={`text-[10px] font-medium whitespace-nowrap transition-colors ${
                    active ? "text-navy font-semibold" : done ? "text-teal" : "text-gray-400"
                  }`}>
                    {label}
                  </span>
                </button>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="h-0.5 w-8 md:w-12 flex-shrink-0 transition-all duration-500 mx-1"
                    style={{ background: n < currentStep ? "var(--teal)" : "#E5E7EB" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
