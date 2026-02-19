const contentUrl = 'assets/data/content.json';

let links = {};
let translations = {};
let languages = [];

const textElements = {
  pageTitle: document.querySelector('title'),
  brandText: document.getElementById('brandText'),
  footerBrandName: document.getElementById('footerBrandName'),
  languageLabel: document.getElementById('language-label'),
  navParticipationLink: document.getElementById('navParticipationLink'),
  heroEyebrow: document.getElementById('heroEyebrow'),
  heroTitle: document.getElementById('heroTitle'),
  heroLead: document.getElementById('heroLead'),
  heroProjectLink: document.getElementById('heroProjectLink'),
  projectTitle: document.getElementById('projectTitle'),
  projectText: document.getElementById('projectText'),
  solutionsTitle: document.getElementById('solutionsTitle'),
  solutionsIntro: document.getElementById('solutionsIntro'),
  municipoTitle: document.getElementById('municipoTitle'),
  municipoText: document.getElementById('municipoText'),
  municipoLink: document.getElementById('municipoLink'),
  indexTitle: document.getElementById('indexTitle'),
  indexText: document.getElementById('indexText'),
  indexLink: document.getElementById('indexLink'),
  ctaTitle: document.getElementById('ctaTitle'),
  ctaText: document.getElementById('ctaText'),
  ctaContactLink: document.getElementById('ctaContactLink'),
  partnerPina: document.getElementById('partnerPina'),
  partnerNvias: document.getElementById('partnerNvias'),
  partnerDelna: document.getElementById('partnerDelna'),
  footerText: document.getElementById('footerText'),
  footerDisclaimer: document.getElementById('footerDisclaimer')
};

const linkConfig = {
  navParticipationLink: 'participationIndex',
  municipoLink: 'app',
  indexLink: 'participationIndex',
  ctaContactLink: 'contact'
};

const languageSwitcher = document.getElementById('language-switcher');

const fetchContent = async () => {
  const response = await fetch(contentUrl);
  if (!response.ok) {
    throw new Error(`Failed to load content: ${response.status}`);
  }
  return response.json();
};

const updateLanguage = (language) => {
  const copy = translations[language] ?? translations.en ?? {};
  Object.entries(textElements).forEach(([key, element]) => {
    if (!element || copy[key] === undefined) return;
    if (key === 'pageTitle') {
      document.title = copy[key];
      return;
    }
    element.textContent = copy[key];
  });
};

const applyLinks = () => {
  Object.entries(linkConfig).forEach(([elementId, linkKey]) => {
    const element = document.getElementById(elementId);
    if (!element || !links[linkKey]) return;
    element.href = links[linkKey];
  });
};

const populateLanguages = () => {
  if (!languageSwitcher) return;
  languageSwitcher.innerHTML = '';
  languages.forEach(({ code, label }) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = label;
    languageSwitcher.appendChild(option);
  });
};

const init = async () => {
  try {
    const content = await fetchContent();
    links = content.links ?? {};
    translations = content.translations ?? {};
    languages = content.languages ?? [];
  } catch (error) {
    console.error(error);
    return;
  }

  applyLinks();
  populateLanguages();

  const stored = localStorage.getItem('municipio-lang');
  const fallback = languages[0]?.code ?? 'en';
  const initial = stored && translations[stored] ? stored : fallback;
  if (languageSwitcher) {
    languageSwitcher.value = initial;
    languageSwitcher.addEventListener('change', (event) => {
      const selected = event.target.value;
      updateLanguage(selected);
      localStorage.setItem('municipio-lang', selected);
      document.documentElement.lang = selected;
    });
  }
  updateLanguage(initial);
  document.documentElement.lang = initial;
};

document.addEventListener('DOMContentLoaded', () => {
  init();
});
