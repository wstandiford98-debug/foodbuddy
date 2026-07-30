import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pages = ["index.html", "news.html"];
const scannerUrl = "https://food-buddy-food-ingredient-analysis-engine.ai.studio";
const qrUrl = "https://foodbuddywa-svf96ugp.manus.space/manus-storage/food-scanner-qr_7d187499.png";

for (const page of pages) {
  const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
  assert.match(html, /food-scanner-card/, `${page} must include the Food Scanner card`);
  assert.match(html, /FREE\. AD-FREE\. ALWAYS\./, `${page} must communicate the free ad-free promise`);
  assert.match(html, new RegExp(scannerUrl.replaceAll(".", "\\.")), `${page} must link to the Food Scanner app`);
  assert.match(html, new RegExp(qrUrl.replaceAll(".", "\\.")), `${page} must embed the supplied QR asset`);
  assert.match(html, /alt="QR code linking to the Food Scanner app"/, `${page} must provide QR alt text`);
}

console.log("Food Scanner static promotion contract passed for index.html and news.html.");
