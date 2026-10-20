import Link from 'next/link';

type Section = { title: string; paragraphs: string[]; bullets?: string[] };
export function LegalDocument({ title, intro, sections }: { title: string; intro: string; sections: Section[] }) {
  return <article className="legal-wrap"><div className="breadcrumbs legal-breadcrumbs"><Link href="/">Home</Link><span>/</span><span>{title}</span></div><span className="eyebrow">Boaz Drive, Nairobi, Kenya</span><h1>{title}</h1><p className="legal-updated">Last updated: 19 October 2026</p><div className="legal-body"><p>{intro}</p>{sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}<p>Questions about this document? Contact us at <a href="mailto:hello@boazdrive.co.ke">hello@boazdrive.co.ke</a> or WhatsApp <a href="https://wa.me/254112272061">+254 112 272 061</a>.</p></div></article>;
}
