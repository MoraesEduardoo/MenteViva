export function controlarNavbar(navbarRef, lastScrollTopRef) {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollDelta = 5;

  if (scrollTop <= 100) {
    navbarRef.current.classList.remove('hidden');
    navbarRef.current.classList.add('visible');
    lastScrollTopRef.current = scrollTop;
    return;
  }

  if (Math.abs(lastScrollTopRef.current - scrollTop) <= scrollDelta) return;

  if (scrollTop > lastScrollTopRef.current) {
    navbarRef.current.classList.add('hidden');
    navbarRef.current.classList.remove('visible');
  } else {
    navbarRef.current.classList.remove('hidden');
    navbarRef.current.classList.add('visible');
  }

  lastScrollTopRef.current = scrollTop;
}
