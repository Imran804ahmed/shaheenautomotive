import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import { db, closeDatabase } from "../src/lib/server/database.mjs";
const { PLAYWRIGHT_MODULE, CHROME_PATH } = process.env;
if (!PLAYWRIGHT_MODULE || !CHROME_PATH) throw new Error("Set PLAYWRIGHT_MODULE and CHROME_PATH before running the smoke test.");
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_MODULE).href);

const port = process.env.SMOKE_PORT || "3314";
const origin = `http://localhost:${port}`;
const root = process.cwd();
const testDatabase = process.env.MYSQL_TEST_DATABASE;
if (!testDatabase || !/^shaheen_test_[a-z0-9_]+$/.test(testDatabase)) {
  throw new Error("Set MYSQL_TEST_DATABASE to a disposable database starting with shaheen_test_.");
}
process.env.MYSQL_DATABASE = testDatabase;
try {
  const existing = await db().prepare("SELECT (SELECT COUNT(*) FROM administrators)+(SELECT COUNT(*) FROM cms)+(SELECT COUNT(*) FROM inquiries)+(SELECT COUNT(*) FROM media)+(SELECT COUNT(*) FROM audit) AS total").get();
  assert.equal(Number(existing.total), 0, "Use an empty test database");
} finally {
  await closeDatabase();
}
function startServer() {
  return spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", port], {
    cwd: root, env: { ...process.env, APP_ORIGIN: origin }, stdio: "inherit",
  });
}

async function stopServer(server) {
  if (server.exitCode !== null || server.signalCode !== null) return;
  await new Promise((resolve) => {
    server.once("exit", resolve);
    server.kill();
  });
}

async function waitForServer(server) {
  for (let i = 0; i < 50 && server.exitCode === null; i++) {
    try { if ((await fetch(origin)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error("Production test server did not start");
}

let server = startServer();
const email = "qa@example.test";
const password = randomBytes(24).toString("hex");
const changedPassword = randomBytes(3).toString("hex");
const regularPassword = randomBytes(3).toString("hex");
let browser;
const ok = (name) => console.log("PASS", name);

try {
  await waitForServer(server);
  const provision = spawn(process.execPath, ["scripts/provision-admin.mjs", email, "QA Super Administrator"], {
    env: process.env, stdio: ["pipe", "inherit", "inherit"],
  });
  provision.stdin.end(password);
  assert.equal(await new Promise((resolve) => provision.on("exit", resolve)), 0);
  browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errorLog = [];
  page.on("pageerror", (error) => errorLog.push(String(error)));
  const put = (label, value) => page.getByLabel(label, { exact: true }).fill(value);
  const click = (name) => page.getByRole("button", { name, exact: true }).click();
  const see = (label) => page.getByText(label, { exact: true }).first().waitFor();
  page.on("dialog", (dialog) => dialog.accept());

  for (const route of ["/", "/about/", "/capabilities/", "/facility/", "/products/", "/products/jack-assemblies/", "/products/sheet-metal-parts/", "/products/bent-rod-parts/", "/products/formed-pipe-parts/", "/quality/", "/csr/", "/gallery/", "/contact/", "/robots.txt", "/sitemap.xml"]) {
    const response = await context.request.get(origin + route);
    assert.equal(response.status(), 200, route);
    if (route === "/sitemap.xml") assert.match(await response.text(), /https:\/\/shaheenautomotive.com.pk\/products\/jack-assemblies\//);
  }
  assert.equal((await context.request.get(origin + "/products/missing/")).status(), 404);
  await page.goto(origin + "/admin/");
  assert.match(page.url(), /\/admin\/login/);
  assert.equal((await context.request.get(origin + "/admin/inquiries/export/")).status(), 401);
  assert.equal((await context.request.get(origin + "/admin/inquiries/1/attachment/")).status(), 401);
  ok("public routes, sitemap, missing product, unauthenticated redirects and downloads");

  await put("Email", email); await put("Password", "incorrect password fixture");
  await click("Sign in"); await see("The email or password is incorrect.");
  await put("Email", email); await put("Password", password);
  await page.getByLabel("Remember me").check();
  await click("Sign in");
  await page.waitForURL("**/admin/dashboard/");
  await see("Inquiries over the last seven days");
  const dashboardImages = page.getByRole("region", { name: "Website images by page" });
  assert.equal(await dashboardImages.getByRole("link", { name: "About Us", exact: true }).getAttribute("href"), "/admin/website/images/about/");
  assert.equal(await dashboardImages.getByRole("link", { name: "Jack and Hinges", exact: true }).getAttribute("href"), "/admin/website/images/product-jack-assemblies/");
  const sidebar = page.getByRole("navigation", { name: "Admin", exact: true });
  await sidebar.getByText("Website management", { exact: true }).click();
  await sidebar.getByText("About Us", { exact: true }).click();
  await sidebar.locator('a[href="/admin/website/images/about/"]').click();
  await page.waitForURL("**/admin/website/images/about/");
  await page.getByRole("heading", { name: "Image management", exact: true }).waitFor();
  ok("dashboard and sidebar page-specific image navigation");
  const cookie = (await context.cookies()).find(({ name }) => name === "shaheen_admin");
  assert.ok(cookie?.secure && cookie.httpOnly && cookie.sameSite === "Lax" && cookie.expires > Date.now() / 1000);
  ok("invalid login, valid login, persistent secure cookie");

  await page.goto(origin + "/admin/content/");
  await put("Title", "QA draft homepage headline");
  await click("Save draft"); await see("Draft saved.");
  const draftPage = await context.newPage();
  await draftPage.goto(origin + "/admin/content/preview/?section=hero");
  assert.ok((await draftPage.locator(".admin-public-preview h1").innerText()).includes("QA draft homepage headline"));
  await draftPage.close();
  const publicPage = await context.newPage();
  await publicPage.goto(origin);
  assert.ok(!(await publicPage.locator("h1").innerText()).includes("QA draft homepage headline"));
  await click("Publish changes"); await see("Changes published.");
  await publicPage.reload();
  assert.ok((await publicPage.locator("h1").innerText()).includes("QA draft homepage headline"));
  await publicPage.close();
  await page.goto(origin + "/admin/content/?section=productGalleryPhotos");
  await see("Page 1 of 4");
  await click("Next"); await see("Page 2 of 4");
  await put("Find in fields", "cross member");
  assert.equal(await page.getByText("No items match these filters.", { exact: true }).count(), 0);
  await page.goto(origin + "/admin/content/?section=seo");
  await page.getByText("/about", { exact: true }).click();
  await page.locator(".admin-editor-item[open]").getByLabel("Title", { exact: true }).fill("QA page metadata");
  await click("Publish changes"); await see("Changes published.");
  const metadata = await (await context.request.get(origin + "/about/")).text();
  assert.ok(metadata.includes("<title>QA page metadata | Shaheen Automotive</title>"));
  ok("draft isolation, public publishing, CMS pagination and dynamic SEO");

  await page.goto(origin + "/admin/media/");
  await page.getByLabel("JPEG, PNG or WebP · up to 8 MB").setInputFiles(root + "/public/images/brand/sapl-mark.png");
  await put("Alternative text", "QA alternate text");
  await click("Upload image"); await see("Image uploaded.");
  const url = await page.getByLabel("Image URL").inputValue();
  assert.equal((await context.request.get(origin + url)).headers()["content-type"], "image/webp");
  await page.goto(origin + "/admin/content/");
  await put("Image", url);
  await click("Publish changes"); await see("Changes published.");
  await page.goto(origin + "/admin/media/");
  await page.getByText("Edit image", { exact: true }).click();
  await click("Delete image"); await see("Remove this image from hero before deleting it.");
  await page.getByLabel("Replace image").setInputFiles(root + "/public/images/brand/sapl-mark-light.png");
  await click("Save image"); await see("Image updated.");
  await page.goto(origin + "/admin/content/");
  await put("Image", "/images/facility/exterior/sapl-plant-front.jpg");
  await click("Publish changes"); await see("Changes published.");
  await page.goto(origin + "/admin/media/");
  await page.getByText("Edit image", { exact: true }).click();
  await click("Delete image"); await see("No images match this search.");
  assert.equal((await context.request.get(origin + url)).status(), 404);
  ok("image upload, publish reference, replacement, dependency guard and deletion");

  const guest = await browser.newContext();
  assert.equal((await guest.request.post(origin + "/api/admin/homepage-images/")).status(), 401);
  await guest.close();
  await page.goto(origin + "/admin/homepage/images/");
  await put("Search images by name or section", "Hero background");
  const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Hero background", exact: true }) });
  const openImage = () => card.getByRole("button", { name: "Replace image", exact: true }).click();
  const upload = (file) => page.locator("dialog input[type=file]").setInputFiles(file);
  async function saveHomeImage(button, message = "Homepage image saved.") {
    const response = page.waitForResponse((result) => result.url().endsWith("/api/admin/homepage-images/") && result.request().method() === "POST");
    await click(button);
    const saved = await response;
    assert.ok(saved.ok(), await saved.text());
    await see(message);
  }
  await openImage();
  await upload({ name: "bad.jpg", mimeType: "image/jpeg", buffer: Buffer.from("invalid image") });
  await click("Save changes");
  await page.getByRole("alert").filter({ hasText: "could not be decoded" }).waitFor();
  await upload(root + "/public/images/video/shop-floor-poster.jpg");
  await page.getByAltText("Selected replacement").waitFor();
  await saveHomeImage("Save changes");
  const publicImagePage = await context.newPage();
  await publicImagePage.goto(origin);
  const heroImage = publicImagePage.locator('img[fetchpriority="high"]').first();
  const firstImage = await heroImage.getAttribute("src");
  assert.match(firstImage, /\/home-image\//);
  const firstBytes = await context.request.get(origin + firstImage);
  assert.equal(firstBytes.headers()["content-type"], "image/webp");
  assert.match(firstBytes.headers()["cache-control"], /immutable/);
  await stopServer(server);
  server = startServer();
  await waitForServer(server);
  await publicImagePage.reload();
  assert.equal(await heroImage.getAttribute("src"), firstImage);
  await openImage();
  await upload(root + "/public/images/facility/exterior/sapl-plant-front.jpg");
  await page.getByLabel("Center crop to the recommended ratio").check();
  await saveHomeImage("Save changes");
  await publicImagePage.reload();
  assert.notEqual(await heroImage.getAttribute("src"), firstImage);
  await openImage();
  await page.getByText("Replacement history", { exact: true }).click();
  await saveHomeImage("Restore version");
  await publicImagePage.reload();
  assert.equal(await heroImage.getAttribute("src"), firstImage);
  await openImage();
  await saveHomeImage("Restore original image");
  await publicImagePage.reload();
  assert.match(await heroImage.getAttribute("src"), /sapl-plant-front/);
  await put("Search images by name or section", "Toyota");
  const logo = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Toyota", exact: true }) });
  await logo.getByRole("button", { name: "Replace image", exact: true }).click();
  await upload(root + "/public/images/clients/honda.png");
  await put("Alternative text", "QA Client Logo");
  await saveHomeImage("Save changes");
  await publicImagePage.reload();
  const replacedLogo = publicImagePage.getByAltText("QA Client Logo", { exact: true });
  assert.match(await replacedLogo.getAttribute("src"), /\/home-image\//);
  await publicImagePage.goto(origin + "/products/");
  assert.equal(await publicImagePage.getByAltText("QA Client Logo", { exact: true }).count(), 0);
  await publicImagePage.close();
  ok("homepage image authorization, file validation, replacement, cache versioning and both restore paths");

  await page.goto(origin + "/admin/website/images/");
  await page.getByRole("heading", { name: "Website images" }).waitFor();
  assert.equal(await page.getByRole("link", { name: "Manage images", exact: true }).count(), 14);
  const aboutCard = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "About Us", exact: true }) });
  await aboutCard.getByRole("link", { name: "Manage images" }).click();
  const banner = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Page banner", exact: true }) });
  await banner.getByRole("button", { name: "Replace image" }).click();
  await upload(root + "/public/images/video/shop-floor-poster.jpg");
  await page.getByLabel("Center crop to the recommended ratio").check();
  await saveHomeImage("Save changes", "Website image saved.");
  const otherPage = await context.newPage();
  await otherPage.goto(origin + "/about/");
  const aboutImage = await otherPage.locator('img[fetchpriority="high"]').first().getAttribute("src");
  assert.match(aboutImage, /\/home-image\//);
  await otherPage.goto(origin + "/contact/");
  assert.notEqual(await otherPage.locator('img[fetchpriority="high"]').first().getAttribute("src"), aboutImage);
  await banner.getByRole("button", { name: "Replace image" }).click();
  await saveHomeImage("Restore original image", "Website image saved.");
  await otherPage.goto(origin + "/about/");
  assert.notEqual(await otherPage.locator('img[fetchpriority="high"]').first().getAttribute("src"), aboutImage);
  await page.goto(origin + "/admin/website/images/product-jack-assemblies/");
  assert.ok(await page.getByRole("article").count() > 2);

  await page.goto(origin + "/admin/website/images/global/");
  const header = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Header wordmark", exact: true }) });
  await header.getByRole("button", { name: "Replace image" }).click();
  await upload(root + "/public/images/brand/sapl-logo-full.png");
  await saveHomeImage("Save changes", "Website image saved.");
  for (const path of ["/", "/about/", "/products/jack-assemblies/"]) {
    await otherPage.goto(origin + path);
    assert.match(await otherPage.locator("header .logo-duo").getAttribute("style"), /\/home-image\//);
  }
  await otherPage.close();
  ok("website overview, nested image page, page-specific replacement and restore, and global branding propagation");

  await page.goto(origin + "/contact/?category=jack-assemblies");
  await page.locator("#rfq-name").fill("QA Contact");
  await page.locator("#rfq-company").fill("QA Company");
  await page.locator("#rfq-email").fill("customer@example.test");
  await page.locator("#rfq-description").fill("A zinc-plated component");
  await page.locator("#rfq-attachment").setInputFiles({ name: "drawing.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n") });
  await click("Send RFQ"); await see("Your RFQ has been sent");
  await page.goto(origin + "/admin/inquiries/");
  await page.getByRole("link", { name: "QA Contact" }).click();
  await page.waitForURL("**/admin/inquiries/1/");
  const status = page.locator("select[name=status]");
  await status.selectOption("closed");
  assert.equal(await status.inputValue(), "closed");
  const updateRequest = page.waitForRequest((request) => request.method() === "POST" && request.url().endsWith("/admin/inquiries/1/"));
  await click("Update status"); await see("Inquiry updated.");
  assert.match((await updateRequest).postData() || "", /closed/);
  await page.reload();
  assert.equal(await status.inputValue(), "closed");
  const attachment = await page.getByRole("link", { name: "Download drawing.pdf" }).getAttribute("href");
  assert.equal((await context.request.get(origin + attachment)).status(), 200);
  const csv = await context.request.get(origin + "/admin/inquiries/export/?state=closed");
  assert.equal(csv.status(), 200);
  assert.match(await csv.text(), /QA Company/);
  ok("public RFQ, private attachment, status and filtered CSV");

  await page.goto(origin + "/admin/administrators/");
  await put("Name", "QA Editor");
  await put("Email", "editor@example.test");
  await put("Initial password", regularPassword);
  await click("Add user"); await see("Administrator created.");
  const editor = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const editorPage = await editor.newPage();
  await editorPage.goto(origin + "/admin/login/");
  await editorPage.getByLabel("Email", { exact: true }).fill("editor@example.test");
  await editorPage.getByLabel("Password", { exact: true }).fill(regularPassword);
  await editorPage.getByRole("button", { name: "Sign in" }).click();
  await editorPage.waitForURL("**/admin/dashboard/");
  await editorPage.goto(origin + "/admin/administrators/");
  await editorPage.waitForURL("**/admin/dashboard/");
  assert.equal(await editorPage.evaluate(() => document.documentElement.scrollWidth), 390);
  await editorPage.goto(origin + "/admin/content/");
  assert.equal(await editorPage.evaluate(() => document.documentElement.scrollWidth), 390);
  ok("role enforcement and mobile workspace widths");
  await editorPage.goto(origin + "/admin/dashboard/");
  assert.equal(await editorPage.getByRole("link", { name: "Manage users", exact: true }).count(), 0);
  await page.goto(origin + "/admin/dashboard/");
  await page.getByRole("link", { name: "Manage users", exact: true }).click();
  const editorAccount = page.getByRole("listitem").filter({ hasText: "editor@example.test" });
  await editorAccount.getByRole("button", { name: "Remove access", exact: true }).click();
  await see("User access removed.");
  await editorPage.goto(origin + "/admin/dashboard/");
  await editorPage.waitForURL("**/admin/login/");
  await editorPage.getByLabel("Email", { exact: true }).fill("editor@example.test");
  await editorPage.getByLabel("Password", { exact: true }).fill(regularPassword);
  await editorPage.getByRole("button", { name: "Sign in", exact: true }).click();
  await editorPage.getByText("The email or password is incorrect.", { exact: true }).waitFor();
  ok("Super Admin user creation and removal, session revocation and blocked sign-in");


  await page.goto(origin + "/admin/account/");
  await page.getByText("QA Super Administrator", { exact: true }).click();
  await click("Sign out");
  await page.waitForURL("**/admin/login/");
  assert.ok(!(await context.cookies()).some(({ name }) => name === "shaheen_admin"));
  const resetToken = randomBytes(32).toString("base64url");
  await db().prepare("INSERT INTO reset_tokens SELECT ?,id,UNIX_TIMESTAMP()+300 FROM administrators WHERE email=?")
    .run(createHash("sha256").update(resetToken).digest("hex"), email);
  await closeDatabase();
  await page.goto(origin + "/admin/reset/?token=" + resetToken);
  await put("New password", changedPassword); await put("Confirm password", changedPassword);
  await click("Reset password"); await see("Password updated. Sign in with your new password.");
  await page.goto(origin + "/admin/reset/?token=" + resetToken);
  await put("New password", changedPassword); await put("Confirm password", changedPassword);
  await click("Reset password"); await see("This reset link is invalid or expired.");
  await page.goto(origin + "/admin/login/");
  await put("Email", email); await put("Password", changedPassword);
  await click("Sign in"); await page.waitForURL("**/admin/dashboard/");
  assert.deepEqual(errorLog, []);
  ok("logout, single-use password reset, and reauthentication with the changed password");
} finally {
  await browser?.close();
  await stopServer(server);
  await closeDatabase();
}
