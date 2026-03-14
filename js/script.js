const video = document.getElementById('vid');
const menu = document.getElementById('menu');
const xmbMain = document.querySelector('.xmb-main');
const sections = Array.from(document.querySelectorAll('.xmb-title'));
const navSound = document.getElementById('nav');

let sectionIndex = 0;
let subsectionIndex = 0;

const playNavSound = () => {
  navSound.currentTime = 0;
  navSound.play().catch(() => {});
};

const moveMenu = (index) => {
  const width = document.body.clientWidth;
  const offsets = [
    ['-26%', '-12%', '-12%'],
    ['-10%', '18%', '18%'],
    ['22%', '32%', '39%'],
    ['50%', '47%', '60%'],
    ['76%', '62%', '77%'],
    ['100%', '77%', '97%']
  ];

  const [hd, ultraHd, fullHd] = offsets[index] ?? offsets[0];
  if (width < 1400) xmbMain.style.marginRight = hd;
  else if (width >= 2560 && width <= 3840) xmbMain.style.marginRight = ultraHd;
  else xmbMain.style.marginRight = fullHd;
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
    const firstRect = submenus[0].getBoundingClientRect();
    const secondRect = submenus[1]?.getBoundingClientRect();
    const activeRect = submenus[subsectionIndex].getBoundingClientRect();
    const contentsRect = contents.getBoundingClientRect();
    const iconRect = sectionIcon?.getBoundingClientRect();

    const naturalTop = firstRect.top - contentsRect.top;
    const topClearanceFromIcon = iconRect ? (iconRect.bottom - contentsRect.top + 12) : naturalTop;
    const pinnedTop = Math.max(naturalTop, topClearanceFromIcon, 42);

    const naturalStep = secondRect ? (secondRect.top - firstRect.top) : (activeRect.height + 16);
    const rowStep = Math.max(90, naturalStep);

    submenus.forEach((submenu, subIdx) => {
      const submenuRect = submenu.getBoundingClientRect();
      let top = pinnedTop + ((subIdx - subsectionIndex) * rowStep);

      if (subIdx < subsectionIndex && iconRect) {
        const safeTop = iconRect.top - contentsRect.top - submenuRect.height - 14;
        const depth = subsectionIndex - subIdx - 1;
        top = Math.min(top, safeTop - (depth * Math.max(36, rowStep * 0.4)));
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

const updateSubmenuState = () => {
  const currentSubmenus = Array.from(sections[sectionIndex].querySelectorAll('.submenu'));
  subsectionIndex = Math.min(subsectionIndex, currentSubmenus.length - 1);

  sections.forEach((section) => {
    section.querySelectorAll('.submenu').forEach((submenu, idx) => {
      submenu.classList.remove('active', 'inactive', 'gotop');
      if (section === sections[sectionIndex]) {
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
  updateSubmenuState();
  requestAnimationFrame(syncActiveSubmenuAlignment);
};

const setSection = (newIndex) => {
  const boundedIndex = Math.max(0, Math.min(newIndex, sections.length - 1));
  if (boundedIndex === sectionIndex) return;

  sectionIndex = boundedIndex;
  subsectionIndex = 0;
  updateSectionState();
};

const setSubsection = (newIndex) => {
  const maxSub = sections[sectionIndex].querySelectorAll('.submenu').length - 1;
  subsectionIndex = Math.max(0, Math.min(newIndex, maxSub));
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

document.body.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    playNavSound();
    setSubsection(subsectionIndex + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    playNavSound();
    setSubsection(subsectionIndex - 1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    playNavSound();
    setSection(sectionIndex + 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    playNavSound();
    setSection(sectionIndex - 1);
  } else if (e.key === 'Enter') {
    const activeSubmenu = getActiveSubmenu();
    if (!activeSubmenu) return;

    if (openEnterableFromSubmenu(activeSubmenu)) {
      e.preventDefault();
      playNavSound();
    }
  }
});

window.addEventListener('load', () => {
  video.play().catch(() => {});
  video.style.opacity = '1';
  menu.style.opacity = '1';
  document.body.classList.add('app-ready');

  updateSectionState();
  registerPointerNavigation();
});

window.addEventListener('resize', () => {
  requestAnimationFrame(() => {
    syncActiveSubmenuAlignment();
    stackActiveSubmenus();
  });
});
