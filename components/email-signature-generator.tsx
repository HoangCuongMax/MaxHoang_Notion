"use client";

import { useMemo, useState } from "react";

type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderContactLine(item: ContactItem) {
  const safeLabel = escapeHtml(item.label);
  const safeValue = escapeHtml(item.value);

  if (!item.href) {
    return `<tr>
      <td style="padding:0 14px 6px 0;color:#6b7280;font-size:18px;line-height:1.2;font-family:Arial,sans-serif;">${safeLabel}</td>
      <td style="padding:0 0 6px 0;color:#1f2937;font-size:18px;line-height:1.2;font-family:Arial,sans-serif;">${safeValue}</td>
    </tr>`;
  }

  const safeHref = escapeHtml(item.href);

  return `<tr>
    <td style="padding:0 14px 6px 0;color:#6b7280;font-size:18px;line-height:1.2;font-family:Arial,sans-serif;">${safeLabel}</td>
    <td style="padding:0 0 6px 0;font-size:18px;line-height:1.2;font-family:Arial,sans-serif;">
      <a href="${safeHref}" style="color:#0a66c2;text-decoration:underline;">${safeValue}</a>
    </td>
  </tr>`;
}

export function EmailSignatureGenerator() {
  const [photoUrl, setPhotoUrl] = useState("https://maxhoang.com.au/max-hoang-logo.jpg");
  const [fullName, setFullName] = useState("Max Hoang");
  const [jobTitle, setJobTitle] = useState("Service Improvement Analyst | NEC Australia");
  const [headline, setHeadline] = useState("AI & Data Analytics | ITIL 4 Certified | Salesforce Certified");
  const [awards, setAwards] = useState(
    "Multi-Award Winner: GovHack, RIMPA, CDU Code Fair x5, NT Digital Excellence"
  );
  const [location, setLocation] = useState("Darwin, NT, Australia | English & Vietnamese");
  const [mobile, setMobile] = useState("+61 040 527 2278");
  const [personalEmail, setPersonalEmail] = useState("hoangngoccuong1414@gmail.com");
  const [workEmail, setWorkEmail] = useState("NgocCuong.Hoang@nt.gov.au");
  const [websitePrimary, setWebsitePrimary] = useState("maxhoang.com.au");
  const [websiteSecondary, setWebsiteSecondary] = useState("nthackers.dev");
  const [linkedinUrl, setLinkedinUrl] = useState("https://www.linkedin.com/in/maxhoangau/");
  const [portfolioUrl, setPortfolioUrl] = useState("https://maxhoang.com.au");
  const [footerNote, setFooterNote] = useState(
    "Let’s connect to share ideas and opportunities in AI, digital transformation, and innovation."
  );
  const [copyStatus, setCopyStatus] = useState("Copy signature HTML");

  const contactItems = useMemo(() => {
    const items: ContactItem[] = [];

    if (mobile.trim()) {
      items.push({ label: "Mobile", value: mobile.trim(), href: `tel:${mobile.trim()}` });
    }

    if (personalEmail.trim()) {
      items.push({
        label: "Personal",
        value: personalEmail.trim(),
        href: `mailto:${personalEmail.trim()}`
      });
    }

    if (workEmail.trim()) {
      items.push({
        label: "Work",
        value: workEmail.trim(),
        href: `mailto:${workEmail.trim()}`
      });
    }

    const websites = [websitePrimary.trim(), websiteSecondary.trim()].filter(Boolean);
    if (websites.length > 0) {
      items.push({
        label: "Website",
        value: websites.join(" | "),
        href: `https://${websites[0].replace(/^https?:\/\//, "")}`
      });
    }

    return items;
  }, [mobile, personalEmail, workEmail, websitePrimary, websiteSecondary]);

  const signatureHtml = useMemo(() => {
    const photo = photoUrl.trim() || "https://placehold.co/220x220";
    const websites = [websitePrimary.trim(), websiteSecondary.trim()].filter(Boolean);
    const secondWebsiteHtml =
      websites[1] && websites[1] !== websites[0]
        ? ` | <a href="https://${escapeHtml(
            websites[1].replace(/^https?:\/\//, "")
          )}" style="color:#0a66c2;text-decoration:underline;">${escapeHtml(websites[1])}</a>`
        : "";

    const websiteRow =
      websites.length > 0
        ? `<tr>
      <td style="padding:0 14px 6px 0;color:#6b7280;font-size:18px;line-height:1.2;font-family:Arial,sans-serif;">Website</td>
      <td style="padding:0 0 6px 0;font-size:18px;line-height:1.2;font-family:Arial,sans-serif;">
        <a href="https://${escapeHtml(
          websites[0].replace(/^https?:\/\//, "")
        )}" style="color:#0a66c2;text-decoration:underline;">${escapeHtml(websites[0])}</a>${secondWebsiteHtml}
      </td>
    </tr>`
        : "";

    const basicRows = contactItems
      .filter((item) => item.label !== "Website")
      .map(renderContactLine)
      .join("");

    return `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:1100px;font-family:Arial,sans-serif;color:#1f2937;">
  <tr>
    <td style="vertical-align:top;width:260px;padding-right:28px;">
      <img src="${escapeHtml(photo)}" alt="${escapeHtml(
      fullName
    )}" width="220" height="220" style="display:block;width:220px;height:220px;border-radius:24px;object-fit:cover;" />
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;width:220px;">
        <tr>
          <td style="padding-bottom:14px;">
            <a href="${escapeHtml(
              linkedinUrl.trim() || "#"
            )}" style="display:block;background:#0a66c2;color:#ffffff;text-align:center;padding:18px 14px;border-radius:16px;font-size:18px;font-weight:700;text-decoration:underline;">Connect on LinkedIn</a>
          </td>
        </tr>
        <tr>
          <td>
            <a href="${escapeHtml(
              portfolioUrl.trim() || "#"
            )}" style="display:block;background:#111827;color:#ffffff;text-align:center;padding:18px 14px;border-radius:16px;font-size:18px;font-weight:700;text-decoration:underline;">View Portfolio</a>
          </td>
        </tr>
      </table>
    </td>
    <td style="vertical-align:top;border-left:1px solid #d1d5db;padding-left:38px;">
      <div style="font-size:46px;line-height:1;font-weight:800;color:#0f172a;margin-bottom:14px;">${escapeHtml(
        fullName
      )}</div>
      <div style="font-size:24px;line-height:1.35;font-weight:700;color:#4b5563;margin-bottom:14px;">${escapeHtml(
        jobTitle
      )}</div>
      <div style="font-size:24px;line-height:1.35;color:#374151;margin-bottom:18px;">${escapeHtml(
        headline
      )}</div>
      <div style="font-size:18px;line-height:1.5;color:#6b7280;margin-bottom:22px;">${escapeHtml(
        awards
      )}</div>
      <div style="font-size:18px;line-height:1.5;color:#374151;margin-bottom:22px;">${escapeHtml(
        location
      )}</div>
      <table cellpadding="0" cellspacing="0" border="0">${basicRows}${websiteRow}</table>
      <div style="margin-top:26px;padding-top:22px;border-top:1px solid #d1d5db;font-size:18px;line-height:1.6;color:#6b7280;">${escapeHtml(
        footerNote
      )}</div>
    </td>
  </tr>
</table>`;
  }, [
    awards,
    contactItems,
    footerNote,
    fullName,
    headline,
    jobTitle,
    linkedinUrl,
    location,
    photoUrl,
    portfolioUrl,
    websitePrimary,
    websiteSecondary
  ]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(signatureHtml);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus("Copy signature HTML"), 1800);
    } catch {
      setCopyStatus("Copy failed");
      window.setTimeout(() => setCopyStatus("Copy signature HTML"), 1800);
    }
  }

  return (
    <section className="signature-builder">
      <div className="tool-calculator__panel signature-builder__form">
        <p className="tool-calculator__label">Signature details</p>
        <div className="tool-form">
          <label className="tool-field">
            <span>Photo URL</span>
            <input value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} />
          </label>
          <label className="tool-field">
            <span>Full name</span>
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </label>
          <label className="tool-field">
            <span>Job title</span>
            <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} />
          </label>
          <label className="tool-field">
            <span>Headline</span>
            <input value={headline} onChange={(event) => setHeadline(event.target.value)} />
          </label>
          <label className="tool-field">
            <span>Awards or highlights</span>
            <input value={awards} onChange={(event) => setAwards(event.target.value)} />
          </label>
          <label className="tool-field">
            <span>Location and language</span>
            <input value={location} onChange={(event) => setLocation(event.target.value)} />
          </label>
          <label className="tool-field">
            <span>Mobile</span>
            <input value={mobile} onChange={(event) => setMobile(event.target.value)} />
          </label>
          <label className="tool-field">
            <span>Personal email</span>
            <input
              value={personalEmail}
              onChange={(event) => setPersonalEmail(event.target.value)}
            />
          </label>
          <label className="tool-field">
            <span>Work email</span>
            <input value={workEmail} onChange={(event) => setWorkEmail(event.target.value)} />
          </label>
          <label className="tool-field">
            <span>Primary website</span>
            <input
              value={websitePrimary}
              onChange={(event) => setWebsitePrimary(event.target.value)}
            />
          </label>
          <label className="tool-field">
            <span>Secondary website</span>
            <input
              value={websiteSecondary}
              onChange={(event) => setWebsiteSecondary(event.target.value)}
            />
          </label>
          <label className="tool-field">
            <span>LinkedIn URL</span>
            <input
              value={linkedinUrl}
              onChange={(event) => setLinkedinUrl(event.target.value)}
            />
          </label>
          <label className="tool-field">
            <span>Portfolio URL</span>
            <input
              value={portfolioUrl}
              onChange={(event) => setPortfolioUrl(event.target.value)}
            />
          </label>
          <label className="tool-field">
            <span>Footer note</span>
            <input value={footerNote} onChange={(event) => setFooterNote(event.target.value)} />
          </label>
        </div>
      </div>

      <div className="tool-calculator__panel signature-builder__preview">
        <div className="signature-builder__topbar">
          <p className="tool-calculator__label">Live preview</p>
          <button type="button" className="button button--primary" onClick={handleCopy}>
            {copyStatus}
          </button>
        </div>

        <div className="signature-preview">
          <div className="signature-preview__left">
            <img src={photoUrl} alt={fullName} className="signature-preview__photo" />
            <a href={linkedinUrl} className="signature-preview__cta signature-preview__cta--linkedin">
              Connect on LinkedIn
            </a>
            <a href={portfolioUrl} className="signature-preview__cta signature-preview__cta--dark">
              View Portfolio
            </a>
          </div>

          <div className="signature-preview__right">
            <h2>{fullName}</h2>
            <p className="signature-preview__job">{jobTitle}</p>
            <p className="signature-preview__headline">{headline}</p>
            <p className="signature-preview__meta">{awards}</p>
            <p className="signature-preview__location">{location}</p>

            <div className="signature-preview__contacts">
              {mobile ? (
                <p>
                  <span>Mobile</span>
                  <a href={`tel:${mobile}`}>{mobile}</a>
                </p>
              ) : null}
              {personalEmail ? (
                <p>
                  <span>Personal</span>
                  <a href={`mailto:${personalEmail}`}>{personalEmail}</a>
                </p>
              ) : null}
              {workEmail ? (
                <p>
                  <span>Work</span>
                  <a href={`mailto:${workEmail}`}>{workEmail}</a>
                </p>
              ) : null}
              {websitePrimary || websiteSecondary ? (
                <p>
                  <span>Website</span>
                  <span className="signature-preview__websites">
                    {websitePrimary ? (
                      <a href={`https://${websitePrimary.replace(/^https?:\/\//, "")}`}>
                        {websitePrimary}
                      </a>
                    ) : null}
                    {websitePrimary && websiteSecondary ? " | " : null}
                    {websiteSecondary ? (
                      <a href={`https://${websiteSecondary.replace(/^https?:\/\//, "")}`}>
                        {websiteSecondary}
                      </a>
                    ) : null}
                  </span>
                </p>
              ) : null}
            </div>

            <p className="signature-preview__footer">{footerNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
