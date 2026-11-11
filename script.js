const root = document.documentElement;
const metaDescription = document.querySelector('meta[name="description"]');
const metaTheme = document.querySelector('meta[name="theme-color"]');
const langButton = document.getElementById("lang-toggle");
const themeButton = document.getElementById("theme-toggle");

const read = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const write = (key, value) => {
  try { localStorage.setItem(key, value); } catch {}
};

// English lives in the HTML (SEO + no-JS fallback); capture it as the "en" dictionary.
const en = { title: document.title, description: metaDescription.content };
const nodes = document.querySelectorAll("[data-i18n]");
nodes.forEach((el) => { en[el.dataset.i18n] ??= el.textContent; });
Object.assign(en, {
  toLight: "Switch to light theme",
  toDark: "Switch to dark theme",
  toLang: "Mudar para português",
});

const ptBR = {
  title: "Otávio Augusto — Desenvolvedor Front-End",
  description: "Portfólio de Otávio Augusto, desenvolvedor front-end e aspirante a designer. Trabalhos open-source selecionados.",
  eyebrow: "Olá, eu sou",
  lead: "Desenvolvedor front-end e designer iniciante. Construo interfaces limpas e acessíveis e as pequenas ferramentas ao redor delas.",
  cta: "Ver meus trabalhos",
  work: "Trabalhos selecionados",
  d1: "Um framework CSS que une as classes utilitárias do TailwindCSS com a semântica e a acessibilidade do PicoCSS, guiado por variáveis CSS.",
  d2: "Helpers de Intersection e Mutation Observer para conteúdo dinâmico e lazy loading. Publicado no npm.",
  d3: "CLI interativa que cria boilerplates front-end limpos, incluindo uma arquitetura Sass 7-em-1.",
  d4: "Uma biblioteca de componentes React simples e sem estilo, construídos com o padrão de composição.",
  d5: "Um app web React usando shadcn/ui, Tailwind, react-hook-form, zod e zustand.",
  d6: "Um site de marketing responsivo feito apenas com HTML e Sass, sem JavaScript.",
  demo: "Demonstração",
  code: "Código",
  of: "de",
  for: "de",
  pkg: "pacote",
  toLight: "Mudar para o tema claro",
  toDark: "Mudar para o tema escuro",
  toLang: "Switch to English",
};

const dictionaries = { en, "pt-BR": ptBR };
const otherLang = { en: "pt-BR", "pt-BR": "en" };
const langBadge = { en: "PT", "pt-BR": "EN" };

let lang = read("lang");
if (!(lang in dictionaries)) {
  lang = navigator.language?.toLowerCase().startsWith("pt") ? "pt-BR" : "en";
}

const getTheme = () => root.dataset.theme;

function renderTheme() {
  const theme = getTheme();
  const t = dictionaries[lang];
  themeButton.setAttribute("aria-label", theme === "dark" ? t.toLight : t.toDark);
  metaTheme.content = getComputedStyle(root).getPropertyValue("--bg").trim();
}

function renderLang() {
  const t = dictionaries[lang];
  root.lang = lang;
  document.title = t.title;
  metaDescription.content = t.description;
  nodes.forEach((el) => { el.textContent = t[el.dataset.i18n]; });
  langButton.textContent = langBadge[lang];
  langButton.lang = otherLang[lang];
  langButton.setAttribute("aria-label", t.toLang);
  renderTheme();
}

langButton.addEventListener("click", () => {
  lang = otherLang[lang];
  write("lang", lang);
  renderLang();
});

themeButton.addEventListener("click", () => {
  root.dataset.theme = getTheme() === "dark" ? "light" : "dark";
  write("theme", getTheme());
  renderTheme();
});

matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
  if (read("theme")) return;
  root.dataset.theme = e.matches ? "light" : "dark";
  renderTheme();
});

renderLang();
