import { Award } from "lucide-react";

import { certifications } from "@/lib/site";

export function CertificationsStrip() {
  return (
    <section className="cert-strip" aria-label="Certifications and compliance">
      <div className="page-shell cert-strip-inner">
        {certifications.map((cert) => (
          <span key={cert} className="cert-badge">
            <Award className="h-3.5 w-3.5 text-primary" />
            {cert}
          </span>
        ))}
      </div>
    </section>
  );
}
