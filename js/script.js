const video = document.getElementById('vid');
const menu = document.getElementById('menu');
const xmbMain = document.getElementById('xmb-main');
const navSound = document.getElementById('nav');
const mobileJoystick = document.getElementById('mobile-joystick');

const MOBILE_MEDIA_QUERY = '(max-width: 900px), (pointer: coarse)';

let sections = [];
let sectionIndex = 0;
let subsectionIndex = 0;
let mobileShiftX = 0;
let isMobileView = false;

const SECTION_TO_SUBMENU_GAP = 12;
const MIN_SELECTED_TOP = 0;
const SUBMENU_INDEX_CLASSES = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const MENU_BASE_SHIFT_X = -120;
const MENU_STEP_SHIFT_X = 190;

const playNavSound = () => {
  navSound.currentTime = 0;
  navSound.play().catch(() => {});
};

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const moveMenu = (index) => {
  const shift = MENU_BASE_SHIFT_X - (index * MENU_STEP_SHIFT_X) + mobileShiftX;
  xmbMain.style.marginRight = '0';
  xmbMain.style.transform = `translateX(${shift}px)`;
};

const getActiveSubmenu = () => sections[sectionIndex]?.querySelectorAll('.submenu')[subsectionIndex] ?? null;

const openEnterableFromSubmenu = (submenu) => {
  if (!submenu) return false;

  const url = submenu.dataset.enterUrl || submenu.querySelector('a[href]')?.href;
  if (!url) return false;

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
};

const syncActiveSubmenuAlignment = () => {
  const activeSection = sections[sectionIndex];
  if (!activeSection) return;

  const sectionIcon = activeSection.querySelector(':scope > img');
  const firstSubmenuIcon = activeSection.querySelector('.submenu img');
  if (!sectionIcon || !firstSubmenuIcon) return;

  const deltaX = sectionIcon.getBoundingClientRect().left - firstSubmenuIcon.getBoundingClientRect().left;
  activeSection.style.setProperty('--submenu-align-shift', `${deltaX}px`);
};

const resetSubmenuStackLayout = (section) => {
  const contents = section.querySelector('.xmb-contents');
  if (contents) contents.style.minHeight = '';

  section.querySelectorAll('.submenu').forEach((submenu) => {
    submenu.style.position = '';
    submenu.style.left = '';
    submenu.style.top = '';
    submenu.style.marginTop = '';
    submenu.style.zIndex = '';
    submenu.style.opacity = '';
  });
};

const stackActiveSubmenus = () => {
  sections.forEach((section, idx) => {
    const contents = section.querySelector('.xmb-contents');
    const submenus = Array.from(section.querySelectorAll('.submenu'));

    if (!contents || submenus.length === 0 || idx !== sectionIndex) {
      resetSubmenuStackLayout(section);
      return;
    }

    const sectionIcon = section.querySelector(':scope > img');
    const activeRect = submenus[subsectionIndex].getBoundingClientRect();
    const contentsRect = contents.getBoundingClientRect();
    const iconRect = sectionIcon?.getBoundingClientRect();

    const iconAnchoredTop = iconRect
      ? Math.round(iconRect.bottom - contentsRect.top) + SECTION_TO_SUBMENU_GAP
      : MIN_SELECTED_TOP;
    const pinnedTop = Math.max(MIN_SELECTED_TOP, iconAnchoredTop);

    const tallestRow = Math.max(...submenus.map((submenu) => submenu.getBoundingClientRect().height));
    const rowStep = Math.max(90, Math.ceil(tallestRow + 16));

    submenus.forEach((submenu, subIdx) => {
      const submenuRect = submenu.getBoundingClientRect();
      let top = pinnedTop + ((subIdx - subsectionIndex) * rowStep);

      if (subIdx < subsectionIndex && iconRect) {
        const nearestSafeTop = iconRect.top - contentsRect.top - submenuRect.height - 14;
        const slotsAbove = subsectionIndex - 1 - subIdx;
        top = nearestSafeTop - (slotsAbove * rowStep);
      }

      submenu.style.position = 'absolute';
      submenu.style.left = '0';
      submenu.style.top = `${Math.round(top)}px`;
      submenu.style.marginTop = '0';
      submenu.style.zIndex = subIdx === subsectionIndex ? '3' : '2';
      submenu.style.opacity = subIdx < subsectionIndex ? '0.65' : '1';
    });

    const lastSubmenu = submenus[submenus.length - 1];
    const lastTop = parseFloat(lastSubmenu.style.top || '0');
    contents.style.minHeight = `${Math.ceil(lastTop + activeRect.height + 28)}px`;
  });
};

const detectMobileView = () => window.matchMedia(MOBILE_MEDIA_QUERY).matches;

const updateMobileMode = () => {
  isMobileView = detectMobileView();
  document.body.classList.toggle('mobile-mode', isMobileView);
  if (!isMobileView) mobileShiftX = 0;
};

const ensureActiveSectionVisible = () => {
  if (!isMobileView || sections.length === 0) return;

  const activeSection = sections[sectionIndex];
  if (!activeSection) return;

  const sectionRect = activeSection.getBoundingClientRect();
  const safePadding = 22;
  const safeLeft = safePadding;
  const safeRight = window.innerWidth - safePadding;

  let correction = 0;
  if (sectionRect.left < safeLeft) {
    correction = safeLeft - sectionRect.left;
  } else if (sectionRect.right > safeRight) {
    correction = safeRight - sectionRect.right;
  }

  if (correction !== 0) {
    mobileShiftX += correction;
    moveMenu(sectionIndex);
  }
};

const triggerEnterAction = () => {
  const activeSubmenu = getActiveSubmenu();
  if (!activeSubmenu) return false;

  if (openEnterableFromSubmenu(activeSubmenu)) {
    playNavSound();
    return true;
  }

  return false;
};

const handleDirectionInput = (direction) => {
  if (sections.length === 0) return;

  if (direction === 'down') {
    playNavSound();
    setSubsection(subsectionIndex + 1);
  } else if (direction === 'up') {
    playNavSound();
    setSubsection(subsectionIndex - 1);
  } else if (direction === 'right') {
    playNavSound();
    setSection(sectionIndex + 1);
  } else if (direction === 'left') {
    playNavSound();
    setSection(sectionIndex - 1);
  } else if (direction === 'enter') {
    triggerEnterAction();
  }
};

const updateSubmenuState = () => {
  const currentSection = sections[sectionIndex];
  if (!currentSection) return;

  const currentSubmenus = Array.from(currentSection.querySelectorAll('.submenu'));
  subsectionIndex = clamp(subsectionIndex, 0, Math.max(0, currentSubmenus.length - 1));

  sections.forEach((section) => {
    section.querySelectorAll('.submenu').forEach((submenu, idx) => {
      submenu.classList.remove('active', 'inactive', 'gotop');
      if (section === currentSection) {
        if (idx === subsectionIndex) submenu.classList.add('active');
        else if (idx < subsectionIndex) submenu.classList.add('inactive');
      }
    });
  });

  requestAnimationFrame(stackActiveSubmenus);
};

const updateSectionState = () => {
  sections.forEach((section, idx) => {
    section.classList.toggle('active', idx === sectionIndex);
    section.style.transform = idx > sectionIndex ? 'translateX(160px)' : 'translateX(0)';
  });

  moveMenu(sectionIndex);
  ensureActiveSectionVisible();
  updateSubmenuState();
  requestAnimationFrame(syncActiveSubmenuAlignment);
};

const setSection = (newIndex) => {
  const boundedIndex = clamp(newIndex, 0, sections.length - 1);
  if (boundedIndex === sectionIndex) return;

  sectionIndex = boundedIndex;
  subsectionIndex = 0;
  updateSectionState();
};

const setSubsection = (newIndex) => {
  const maxSub = sections[sectionIndex].querySelectorAll('.submenu').length - 1;
  subsectionIndex = clamp(newIndex, 0, maxSub);
  updateSubmenuState();
};

const registerPointerNavigation = () => {
  sections.forEach((section, sIndex) => {
    section.addEventListener('click', () => {
      playNavSound();
      setSection(sIndex);
    });

    section.querySelectorAll('.submenu').forEach((submenu, subIndex) => {
      submenu.style.cursor = 'pointer';
      submenu.addEventListener('click', (event) => {
        event.stopPropagation();
        playNavSound();
        setSection(sIndex);
        setSubsection(subIndex);
      });

      submenu.addEventListener('touchstart', (event) => {
        event.stopPropagation();
        playNavSound();
        setSection(sIndex);
        setSubsection(subIndex);
      }, { passive: true });
    });
  });
};


const registerMobileJoystick = () => {
  if (!mobileJoystick) return;

  const buttons = mobileJoystick.querySelectorAll('[data-dir]');
  buttons.forEach((button) => {
    const activate = (event) => {
      event.preventDefault();
      event.stopPropagation();
      handleDirectionInput(button.dataset.dir);
    };

    button.addEventListener('click', activate);
    button.addEventListener('touchstart', activate, { passive: false });
  });
};

const createItemNode = (item, idx) => {
  const submenu = document.createElement('div');
  const idxClass = SUBMENU_INDEX_CLASSES[idx] ?? `item-${idx + 1}`;
  submenu.className = `submenu ${idxClass}`;

  const hasAction = Boolean(item.enterUrl || item.link?.href);
  if (hasAction) submenu.classList.add('enterable');
  if (item.enterUrl) submenu.dataset.enterUrl = item.enterUrl;

  const img = document.createElement('img');
  img.className = item.imageClass || 'abimg';
  img.src = item.image;
  img.alt = item.alt || item.title || 'Item image';
  submenu.appendChild(img);

  const context = document.createElement('div');
  context.className = 'context';

  const title = document.createElement('p');
  title.className = 'item-title';
  title.textContent = item.title || '';
  context.appendChild(title);

  if (item.link?.href) {
    const p = document.createElement('p');
    p.className = 'subtext';

    const a = document.createElement('a');
    a.href = item.link.href;
    a.textContent = item.link.text || item.link.href;

    const isExternal = /^https?:/i.test(item.link.href);
    if (isExternal) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }

    p.appendChild(a);
    context.appendChild(p);
  } else if (item.subtext) {
    const p = document.createElement('p');
    p.className = 'subtext';
    p.textContent = item.subtext;
    context.appendChild(p);
  }

  if (item.subtext2) {
    const p2 = document.createElement('p');
    p2.className = 'subtext2';
    p2.textContent = item.subtext2;
    context.appendChild(p2);
  }

  submenu.appendChild(context);
  return submenu;
};

const renderSections = (data) => {
  xmbMain.innerHTML = '';

  data.sections.forEach((sectionData, index) => {
    const section = document.createElement('div');
    section.className = 'xmb-title xmb-column';
    if (sectionData.active || index === 0) section.classList.add('active');
    if (sectionData.id) section.dataset.section = sectionData.id;

    const icon = document.createElement('img');
    icon.className = sectionData.iconClass || 'messages';
    icon.src = sectionData.icon;
    icon.alt = sectionData.title;

    const title = document.createElement('p');
    title.className = 'titletext';
    title.textContent = sectionData.title;

    const contents = document.createElement('div');
    contents.className = 'xmb-contents';

    (sectionData.items || []).forEach((item, idx) => {
      contents.appendChild(createItemNode(item, idx));
    });

    section.append(icon, title, contents);
    xmbMain.appendChild(section);
  });

  sections = Array.from(document.querySelectorAll('.xmb-column'));
  sectionIndex = Math.max(0, sections.findIndex((section) => section.classList.contains('active')));
  subsectionIndex = 0;
};

const loadPortfolioData = async () => {
  const response = await fetch('data/portfolio.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load portfolio data (${response.status})`);
  return response.json();
};

document.body.addEventListener('keydown', (e) => {
  if (sections.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    handleDirectionInput('down');
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    handleDirectionInput('up');
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    handleDirectionInput('right');
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    handleDirectionInput('left');
  } else if (e.key === 'Enter') {
    e.preventDefault();
    handleDirectionInput('enter');
  }
});

window.addEventListener('load', async () => {
  try {
    const data = await loadPortfolioData();
    renderSections(data);

    updateMobileMode();
    updateSectionState();
    registerPointerNavigation();
    registerMobileJoystick();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  video.play().catch(() => {});
  video.style.opacity = '1';
  menu.style.opacity = '1';
  document.body.classList.add('app-ready');
});

window.addEventListener('resize', () => {
  updateMobileMode();
  if (sections.length === 0) return;
  requestAnimationFrame(() => {
    moveMenu(sectionIndex);
    ensureActiveSectionVisible();
    syncActiveSubmenuAlignment();
    stackActiveSubmenus();
  });
});
