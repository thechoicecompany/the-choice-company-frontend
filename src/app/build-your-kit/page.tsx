"use client";
import { useKitBuilder } from "@/lib/hooks/useKitBuilder";
import StepperNav          from "@/components/sections/kit-builder/StepperNav";
import Step1OccasionBudget from "@/components/sections/kit-builder/Step1OccasionBudget";
import Step2PickProducts   from "@/components/sections/kit-builder/Step2PickProducts";
import Step3LogoUpload     from "@/components/sections/kit-builder/Step3LogoUpload";
import Step4AICombo        from "@/components/sections/kit-builder/Step4AICombo";
import Step5ReviewQuote    from "@/components/sections/kit-builder/Step5ReviewQuote";
import KitSidebar          from "@/components/sections/kit-builder/KitSidebar";
export default function BuildYourKitPage() {
  const kit = useKitBuilder();
  const steps = [<Step1OccasionBudget key={1} kit={kit}/>,<Step2PickProducts key={2} kit={kit}/>,
    <Step3LogoUpload key={3} kit={kit}/>,<Step4AICombo key={4} kit={kit}/>,<Step5ReviewQuote key={5} kit={kit}/>];
  return (
    <div className="min-h-screen" style={{background:"var(--cream)"}}>
      <div className="py-10 text-center text-white" style={{background:"linear-gradient(135deg,var(--navy) 0%,var(--teal) 100%)"}}>
        <p className="section-label text-gold mb-2">AI-POWERED KIT BUILDER</p>
        <h1 className="font-playfair text-3xl font-bold">Build Your <span style={{color:"var(--gold)"}}>Perfect Corporate Kit</span></h1>
      </div>
      <StepperNav currentStep={kit.step} setStep={kit.setStep} />
      <div className="container-site py-8 pb-24 md:pb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0 anim-fade-up">{steps[kit.step-1]}</div>
          <aside className="w-full lg:w-80 flex-shrink-0"><div className="lg:sticky lg:top-24"><KitSidebar kit={kit}/></div></aside>
        </div>
      </div>
    </div>
  );
}
