const contentUrl = 'assets/data/content.json';

let links = {};
let translations = {};
let languages = [];

const textElements = {
  pageTitle: document.querySelector('title'),
  brandName: document.getElementById('brandName'),
  footerBrandName: document.getElementById('footerBrandName'),
  cardTitle: document.getElementById('cardTitle'),
  cardSubtitle: document.getElementById('cardSubtitle'),
  languageLabel: document.getElementById('language-label'),
  navAppLink: document.getElementById('navAppLink'),
  navDownloadLink: document.getElementById('navDownloadLink'),
  tagline: document.getElementById('tagline'),
  heroEyebrow: document.getElementById('heroEyebrow'),
  heroTitle: document.getElementById('heroTitle'),
  heroLead: document.getElementById('heroLead'),
  heroAppLink: document.getElementById('heroAppLink'),
  heroDownloadLink: document.getElementById('heroDownloadLink'),
  aboutTitle: document.getElementById('aboutTitle'),
  aboutText: document.getElementById('aboutText'),
  pillarOneTitle: document.getElementById('pillarOneTitle'),
  pillarOneText: document.getElementById('pillarOneText'),
  pillarTwoTitle: document.getElementById('pillarTwoTitle'),
  pillarTwoText: document.getElementById('pillarTwoText'),
  pillarThreeTitle: document.getElementById('pillarThreeTitle'),
  pillarThreeText: document.getElementById('pillarThreeText'),
  howTitle: document.getElementById('howTitle'),
  howIntro: document.getElementById('howIntro'),
  stepOneTitle: document.getElementById('stepOneTitle'),
  stepOneText: document.getElementById('stepOneText'),
  stepTwoTitle: document.getElementById('stepTwoTitle'),
  stepTwoText: document.getElementById('stepTwoText'),
  stepThreeTitle: document.getElementById('stepThreeTitle'),
  stepThreeText: document.getElementById('stepThreeText'),
  ctaTitle: document.getElementById('ctaTitle'),
  ctaText: document.getElementById('ctaText'),
  ctaAppLink: document.getElementById('ctaAppLink'),
  ctaDownloadLink: document.getElementById('ctaDownloadLink'),
  footerText: document.getElementById('footerText'),
  footerAppLink: document.getElementById('footerAppLink'),
  footerDownloadLink: document.getElementById('footerDownloadLink'),
  footerContactLink: document.getElementById('footerContactLink'),
};

const linkElements = [
  document.getElementById('navAppLink'),
  document.getElementById('navDownloadLink'),
  document.getElementById('heroAppLink'),
  document.getElementById('heroDownloadLink'),
  document.getElementById('ctaAppLink'),
  document.getElementById('ctaDownloadLink'),
  document.getElementById('footerAppLink'),
  document.getElementById('footerDownloadLink'),
  document.getElementById('footerContactLink'),
];

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
  linkElements.forEach((element) => {
    if (!element) return;
    const id = element.id.toLowerCase();
    if (id.includes('app')) {
      element.href = links.app ?? element.href;
    } else if (id.includes('download')) {
      element.href = links.downloads ?? element.href;
    } else if (id.includes('contact')) {
      element.href = links.contact ?? element.href;
    }
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
