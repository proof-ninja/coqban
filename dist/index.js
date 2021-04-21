(function () {
  'use strict';

  function jsCoqInject() {
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
      all_pkgs: ["coq"],
      init_pkgs: ["init"],
      init_import: ["utf8"],
      implicit_libs: true,
  };
  async function jsCoqLoad() {
      const coq = await JsCoq.start(jscoq_opts.base_path, "./node_modules", jscoq_ids, jscoq_opts);
      window.coq = coq;
      window.addEventListener("beforeunload", () => {
          localStorage.jsCoqShow = coq.layout.isVisible();
      });
      const page = document.querySelector("#page");
      if (page) {
          page.focus();
      }
      if (jscoq_opts.show) {
          document.body.classList.add("jscoq-launched");
      }
  }

  const gistUrlInput = document.querySelector(".gist-url");
  const alertSection = document.querySelector(".coqban-alert");
  const submitButton = document.querySelector(".gist-submit");
  const coqCodeArea = document.querySelector(".coqban-codearea");
  const coqCode = document.querySelector(".coq-code");
  submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      const url = new URL(window.location.toString());
      url.searchParams.set("gisturl", gistUrlInput.value);
      window.location.href = url.toString();
  });
  function buildUrl(rawUrl) {
      return `${rawUrl.replace("github.", "githubusercontent.")}/raw/`;
  }
  async function main() {
      alertSection.classList.add("uk-hidden");
      const params = new URL(document.location.toString()).searchParams;
      const gistUrl = params.get("gisturl") || "";
      if (!gistUrl) {
          return;
      }
      gistUrlInput.value = gistUrl;
      const targetUrl = buildUrl(gistUrl);
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
      }
      catch (e) {
          console.error(e);
          alertSection.innerHTML = "Invalid url or filename.";
          alertSection.classList.remove("uk-hidden");
      }
  }
  main();

}());
