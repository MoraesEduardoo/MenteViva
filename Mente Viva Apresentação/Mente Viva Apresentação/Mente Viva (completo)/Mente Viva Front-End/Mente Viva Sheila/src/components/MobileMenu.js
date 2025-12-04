import { useEffect } from 'react';

export default function MobileMenu() {
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById('mobile-menu-content');
      if (menu && !menu.contains(event.target)) {
        menu.classList.remove('show');
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    const menu = document.getElementById('mobile-menu-content');
    menu.classList.toggle('show');
  };

  return (
    <div className="mobile-menu">
      <button className="hamburger-btn" onClick={toggleMenu}>☰</button>
      <div id="mobile-menu-content" className="menu-content">...</div>
    </div>
  );
}
