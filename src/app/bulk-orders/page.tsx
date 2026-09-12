import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import BulkInquiryForm from "@/components/forms/BulkInquiryForm";
export const metadata: Metadata = { title:"Bulk Corporate Gift Orders", description:"Submit bulk gifting requirements. MOQ from 50 units. Get quote in 24 hours." };
export default function BulkOrdersPage() {
  return (<><PageHero title="Bulk Order Solutions" subtitle="Submit your requirement — our team responds within 24 hours"
    breadcrumbs={[{label:"Home",href:"/"},{label:"Bulk Orders"}]} />
    <section className="section-py"><div className="container-site max-w-3xl mx-auto" id="inquiry-form">
      <div className="text-center mb-10"><span className="section-label">GET A QUOTE</span>
        <h2 className="section-title">Submit Your Bulk Requirement</h2></div>
      <BulkInquiryForm />
    </div></section></>);
}
