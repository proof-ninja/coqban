export function jsCoqInject() {
  document.body.classList.add("toggled");
  document.body.id = "ide-wrapper";
}

const jsCoqShow = localStorage.jsCoqShow !== "false";

const jscoq_ids = [".coq-code"];
const jscoq_opts = {
  show: jsCoqShow,
  focus: false,
  replace: true,
  base_path: "./node_modules/jscoq/",
  editor: { mode: { "company-coq": true }, keyMap: "default" },
  all_pkgs: ["coq", "mathcomp"],
  init_pkgs: ["init"],
  init_import: ["utf8"],
  implicit_libs: true,
};

declare const JsCoq: any;

export async function jsCoqLoad() {
  const coq = await JsCoq.start(
    jscoq_opts.base_path,
    "./node_modules",
    jscoq_ids,
    jscoq_opts
  );
  (window as any).coq = coq;
  window.addEventListener("beforeunload", () => {
    localStorage.jsCoqShow = coq.layout.isVisible();
  });
  const page = document.querySelector<HTMLElement>("#page");
  if (page) {
    page.focus();
  }

  if (jscoq_opts.show) {
    document.body.classList.add("jscoq-launched");
  }
}
