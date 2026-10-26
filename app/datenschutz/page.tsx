import type { Metadata } from "next";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LegalBlock as Block } from "@/components/LegalBlock";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz - AI Society Vienna",
  description: "Privacy policy of AI Society Vienna (Datenschutzerklärung according to the GDPR).",
};

const STAND = "Oktober 2026";

/**
 * Privacy policy (GDPR / DSGVO). It describes what the site actually does:
 * no cookies, no tracking, self-hosted fonts; personal data only through
 * the membership form (-> Google Sheet + emails via Google, WhatsApp
 * community) and email contact (Zoho). Update it when that changes.
 */
export default function DatenschutzPage() {
  const l = site.legal;
  const mail = (
    <a href={`mailto:${site.email}`} className="text-neon transition-colors hover:text-ink">
      {site.email}
    </a>
  );
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Backdrop />
      <Navbar />

      <article className="mx-auto max-w-2xl px-5 pt-36 pb-20 md:px-8">
        <p className="font-mono text-[11px] tracking-[0.25em] text-neon">[ PRIVACY POLICY ]</p>
        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-ink md:text-5xl">Datenschutzerklärung</h1>
        <p className="mt-4 text-sm text-mist">
          Wie wir mit personenbezogenen Daten umgehen, gemäß Datenschutz-Grundverordnung (DSGVO) und
          österreichischem Datenschutzgesetz (DSG). Stand: {STAND}.
        </p>

        <div className="mt-10">
          <Block title="VERANTWORTLICHER">
            <p>
              {l.name}
              <br />
              {l.address.join(", ")}
              <br />
              ZVR-Zahl {l.zvr} · {mail}
            </p>
            <p>Für alle Fragen zum Datenschutz und zur Ausübung Ihrer Rechte erreichen Sie uns unter dieser Adresse.</p>
          </Block>

          <Block title="BESUCH DER WEBSITE">
            <p>
              Diese Website verwendet <b>keine Cookies</b>, keine Analyse- oder Tracking-Dienste und keine
              eingebetteten Inhalte Dritter. Schriftarten werden von unserem eigenen Server geladen, nicht von
              Google. Links zu Instagram, LinkedIn und Notion sind einfache Links: Daten fließen erst an diese
              Anbieter, wenn Sie den Link anklicken.
            </p>
            <p>
              Die Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige
              Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browsertyp) in Server-Logs, um die Seite
              auszuliefern und gegen Missbrauch zu schützen. Rechtsgrundlage ist unser berechtigtes Interesse an
              einem sicheren, funktionierenden Webauftritt (Art. 6 Abs. 1 lit. f DSGVO). Die Übermittlung in die
              USA erfolgt auf Grundlage geeigneter Garantien (EU-US Data Privacy Framework bzw.
              EU-Standardvertragsklauseln).
            </p>
          </Block>

          <Block title="MITGLIEDSCHAFT ÜBER DAS ANMELDEFORMULAR">
            <p>
              Wenn Sie sich unter <Link href="/join" className="text-neon hover:text-ink">/join</Link> anmelden,
              verarbeiten wir Ihren <b>Namen, Ihre E-Mail-Adresse, Ihre Telefonnummer und Ihre Studienrichtung</b>.
            </p>
            <p>
              Zweck: Verwaltung Ihrer Mitgliedschaft, die Willkommens-E-Mail mit den Zugängen, Informationen über
              Veranstaltungen sowie die Aufnahme in unsere WhatsApp-Community. Rechtsgrundlagen sind die
              Mitgliedschaft im Verein (Art. 6 Abs. 1 lit. b DSGVO) und Ihre Einwilligung bei der Anmeldung
              (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit widerrufen können.
            </p>
            <p>
              Die Angaben werden in einer Mitgliederliste in Google Sheets gespeichert, und die E-Mails werden über
              Google versendet (Google Ireland Ltd., Dublin; eine Verarbeitung durch Google LLC in den USA ist auf
              Grundlage des EU-US Data Privacy Framework möglich). Zugriff haben nur Vorstandsmitglieder, die die
              Mitgliederverwaltung betreuen.
            </p>
          </Block>

          <Block title="WHATSAPP-COMMUNITY">
            <p>
              Für die WhatsApp-Community verwenden wir Ihre Telefonnummer. In der Community ist Ihre Nummer für die
              anderen Teilnehmenden sichtbar. Der Dienst wird von WhatsApp Ireland Ltd. (Meta) betrieben, für die
              Nutzung gelten zusätzlich dessen Datenschutzbestimmungen. Sie können die Community jederzeit selbst
              verlassen.
            </p>
          </Block>

          <Block title="MEMBER PORTAL">
            <p>
              Unser Member Portal ist eine Seite bei Notion Labs Inc. (USA). Wenn Sie es öffnen, gelten die
              Datenschutzbestimmungen von Notion. Für den Zugang kann Ihre E-Mail-Adresse an Notion übermittelt
              werden.
            </p>
          </Block>

          <Block title="KONTAKT PER E-MAIL">
            <p>
              Wenn Sie uns schreiben, verarbeiten wir Ihre Nachricht und Kontaktdaten, um Ihre Anfrage zu
              beantworten (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Unser E-Mail-Postfach wird von Zoho Corporation B.V.
              in deren europäischem Rechenzentrum betrieben. Bewerbungen für das Core Team (inklusive Lebenslauf)
              verwenden wir ausschließlich für die Auswahl und löschen sie nach Abschluss, sofern Sie nicht ins
              Team aufgenommen werden.
            </p>
          </Block>

          <Block title="SPEICHERDAUER">
            <p>
              Wir speichern Mitgliedsdaten für die Dauer der Mitgliedschaft. Nach dem Austritt oder auf Ihren
              Wunsch löschen wir sie, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </Block>

          <Block title="IHRE RECHTE">
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung, auf
              Datenübertragbarkeit, auf Widerspruch sowie auf Widerruf einer erteilten Einwilligung mit Wirkung für
              die Zukunft. Schreiben Sie uns dazu an {mail}.
            </p>
            <p>
              Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt,
              können Sie sich bei der Österreichischen Datenschutzbehörde beschweren (Barichgasse 40-42, 1030 Wien,{" "}
              <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-neon hover:text-ink">
                dsb.gv.at
              </a>
              ).
            </p>
          </Block>
        </div>

        <p className="mt-6">
          <Link href="/" className="text-sm text-mist transition-colors duration-200 hover:text-ink">
            ← Back to homepage
          </Link>
        </p>
      </article>

      <Footer />
    </main>
  );
}
