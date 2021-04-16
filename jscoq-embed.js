/**
 * Injects jsCoq into an existing page.
 * This script has to be at the end of the body so that it runs after
 * the page DOM has loaded.
 */

function jsCoqInject() {
  document.body.classList.add('toggled');
  document.body.id = 'ide-wrapper';
}

const jsCoqShow = (localStorage.jsCoqShow !== 'false');

const jscoq_ids  = ['.coq-code'];
const jscoq_opts = {
  show:      jsCoqShow,
  focus:     false,
  replace:   true,
  base_path: './node_modules/jscoq/',
  editor:    { mode: { 'company-coq': true }, keyMap: 'default' },
  all_pkgs:  ['coq'],
  init_pkgs: ['init'],
  init_import: ['utf8'],
  implicit_libs: true
};

async function jsCoqLoad() {
  const coq = await JsCoq.start(jscoq_opts.base_path, './node_modules', jscoq_ids, jscoq_opts);
  window.coq = coq;
  window.addEventListener('beforeunload', () => { localStorage.jsCoqShow = coq.layout.isVisible(); });
  document.querySelector('#page').focus();

  if (jscoq_opts.show) {
    document.body.classList.add('jscoq-launched');
  }
}

function buildGistUrl(url, filename) {
  return `${url.replace('github.', 'githubusercontent.')}/raw/${filename}`;
}

const gistUrlInput = document.querySelector('.gist-url');
const gistFilenameInput = document.querySelector('.gist-filename');
const alertSection = document.querySelector('.coqban-alert');
const submitButton = document.querySelector('.gist-submit');
const coqCodeArea = document.querySelector('.coqban-codearea');
const coqCode = document.querySelector('.coq-code');

async function fetchFile(event) {
  event.preventDefault();
  alertSection.classList.add('uk-hidden');

  const targetUrl = buildGistUrl(gistUrlInput.value, gistFilenameInput.value);
  try {
    const response = await fetch(targetUrl);

    if (response.status != 200) {
      throw `Invalid request. status: ${response.status}`;
    }

    const source = await response.text();

    submitButton.disabled = true;
    coqCodeArea.classList.remove('uk-hidden');
    coqCode.innerHTML = source;

    jsCoqInject();
    jsCoqLoad();
  } catch (e) {
    console.error(e);
    alertSection.innerHTML = '指定された URL かファイル名が正しくありません。';
    alertSection.classList.remove('uk-hidden');
  }
}

submitButton.addEventListener('click', fetchFile);
