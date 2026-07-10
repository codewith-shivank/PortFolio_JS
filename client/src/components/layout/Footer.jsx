import { PERSONAL, SOCIAL_LINKS, NAV_SECTIONS, SITE } from '@/lib/constants';
import Magnetic from '@/components/ui/Magnetic';

/**
 * Footer — Cynthia Ugwu Style Layout
 * Stark monochrome split columns, uppercase details, magnetic links
 */
export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-white/10 bg-black text-white"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Column 1: Brand & Status */}
          <div>
            <h2 className="font-display font-extrabold text-lg tracking-tighter uppercase mb-3">
              {PERSONAL.name}
            </h2>
            <p className="font-body text-xs text-neutral-500 leading-relaxed max-w-[240px]">
              {PERSONAL.shortBio}
            </p>
          </div>

          {/* Column 2: Quick Nav */}
          <div>
            <h3 className="text-meta mb-4">Navigation</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {NAV_SECTIONS.map((s) => (
                  <li key={s.id}>
                    <Magnetic>
                      <button
                        onClick={() => scrollTo(s.id)}
                        className="font-mono text-xs text-neutral-500 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {s.label}
                      </button>
                    </Magnetic>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Contact Channels */}
          <div>
            <h3 className="text-meta mb-4">Inquiries</h3>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Magnetic>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-neutral-500 hover:text-white uppercase tracking-wider transition-colors"
                      aria-label={`${link.label} channel`}
                    >
                      {link.label} ↗
                    </a>
                  </Magnetic>
                </li>
              ))}
              <li className="pt-2 border-t border-white/5">
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-mono text-xs text-neutral-500 hover:text-white transition-colors"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[0.6rem] tracking-wider text-neutral-600 uppercase">
            © {year} {PERSONAL.name} · All rights reserved.
          </p>
          <p className="font-mono text-[0.6rem] tracking-wider text-neutral-600 uppercase">
            Designed in style of Cynthia Ugwu
          </p>
        </div>
      </div>
    </footer>
  );
}
