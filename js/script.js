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
};

const updateSectionState = () => {
  sections.forEach((section, idx) => {
    section.classList.toggle('active', idx === sectionIndex);
    section.style.transform = idx > sectionIndex ? 'translateX(160px)' : 'translateX(0)';
  });
  moveMenu(sectionIndex);
  updateSubmenuState();
};

const setSection = (newIndex) => {
  sectionIndex = Math.max(0, Math.min(newIndex, sections.length - 1));
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
