import { T } from "@/components/LanguageProvider";
import { analyticsId } from "../lib/analytics";

// Server-rendered: a disabled integration must not pull the GA script component into this page.
export function AnalyticsPreferences() {
  return analyticsId ? <button type="button" className="text-link" id="analytics-preferences"><T>Analitika seçimlərini dəyiş</T></button> : <p><T>Bu versiyada Google Analytics aktiv deyil.</T></p>;
}
