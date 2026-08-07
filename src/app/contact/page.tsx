import type { Metadata } from "next";
import PageHero    from "@/components/layout/PageHero";
import ContactForm from "@/components/sections/about/ContactForm";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title:"Contact Us", description:"Contact The Choice Company for bulk gifting enquiries." };
export default function ContactPage() {
  return (
    <>
      <PageHero title="Let's Talk Gifting" subtitle="Our team responds within 2 business hours"
        breadcrumbs={[{label:"Home",href:"/"},{label:"Contact Us"}]} />
      <section className="section-py">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="section-label">SEND A MESSAGE</span>
              <h2 className="section-title mb-2">Get in Touch</h2>
              <span className="gold-rule" />
              <ContactForm />
            </div>
            <div>
              <span className="section-label">CONTACT DETAILS</span>
              <h2 className="section-title mb-2">Find Us</h2>
              <span className="gold-rule" />
              <div className="space-y-4 mb-8">
                {[{icon:"📞",label:"Phone",value:"+91 81090 00100",href:"tel:+918109000100"},{icon:"✉",label:"Email",value:"info@thechoicecompany.in",href:"mailto:info@thechoicecompany.in"},{icon:"💬",label:"WhatsApp",value:"Chat instantly",href:"https://wa.me/918109000100"},{icon:"📍",label:"Office",value:"Indore, Madhya Pradesh",href:null}].map(({icon,label,value,href})=>(
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                    <div><div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
                    {href?<a href={href} className="text-navy font-medium text-sm hover:text-gold">{value}</a>:<span className="text-navy font-medium text-sm">{value}</span>}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <a href="/bulk-orders#inquiry-form" className="btn-navy">📋 Bulk Inquiry</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
