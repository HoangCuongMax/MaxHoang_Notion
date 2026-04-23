import Link from "next/link";

const tools = [
  {
    name: "Business Hours Calculation",
    slug: "business-hours-calculation",
    summary:
      "A simple calculator for estimating daily, weekly, and monthly business hours from your working schedule."
  },
  {
    name: "Email Signature Generator",
    slug: "email-signature-generator",
    summary:
      "Create a polished email signature from a photo URL, contact details, and personal links, then copy the final HTML."
  }
];

export const metadata = {
  title: "Tools"
};

export default function ToolsPage() {
  return (
    <section className="section page-intro page-intro--tools">
      <div className="container editorial-shell">
        <p className="eyebrow">Tools</p>
        <h1>Useful online tools built as part of the product stack.</h1>
        <p className="page-intro__lede">
          This section is where I publish focused utilities, calculators, and small
          digital products that solve practical problems.
        </p>

        <div className="tools-grid">
          {tools.map((tool) => (
            <article key={tool.slug} className="tool-card">
              <p className="tool-card__label">Online tool</p>
              <h2>{tool.name}</h2>
              <p>{tool.summary}</p>
              <Link href={`/tools/${tool.slug}`} className="text-link">
                Open tool
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
