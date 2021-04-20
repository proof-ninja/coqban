import { jsCoqInject, jsCoqLoad } from "./jscoq";

const gistUrlInput = document.querySelector(".gist-url") as HTMLInputElement;
const gistFilenameInput = document.querySelector(
  ".gist-filename"
) as HTMLInputElement;
const alertSection = document.querySelector(".coqban-alert") as HTMLElement;
const submitButton = document.querySelector(".gist-submit") as HTMLElement;
const coqCodeArea = document.querySelector(".coqban-codearea") as HTMLElement;
const coqCode = document.querySelector(".coq-code") as HTMLElement;

submitButton.addEventListener("click", (event) => {
  event.preventDefault();

  const url = new URL(window.location.toString());
  url.searchParams.set("gisturl", gistUrlInput.value);
  url.searchParams.set("gistfilename", gistFilenameInput.value);
  window.location.href = url.toString();
});

function buildGistUrl(url: string, filename: string) {
  return `${url.replace("github.", "githubusercontent.")}/raw/${filename}`;
}

async function main() {
  alertSection.classList.add("uk-hidden");

  const params = new URL(document.location.toString()).searchParams;
  const gistUrl = params.get("gisturl") || "";
  if (!gistUrl) {
    return;
  }
  gistUrlInput.value = gistUrl;
  const gistFileName = params.get("gistfilename") || "";
  gistFilenameInput.value = gistFileName;
  const targetUrl = buildGistUrl(gistUrl, gistFileName);

  if (!targetUrl) {
    return;
  }

  try {
    const response = await fetch(targetUrl);

    if (response.status != 200) {
      throw `Invalid request. status: ${response.status}`;
    }

    const source = await response.text();

    coqCodeArea.classList.remove("uk-hidden");
    coqCode.innerHTML = source;

    jsCoqInject();
    jsCoqLoad();
  } catch (e) {
    console.error(e);
    alertSection.innerHTML = "Invalid url or filename.";
    alertSection.classList.remove("uk-hidden");
  }
}
main();
