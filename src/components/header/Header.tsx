import logo from '../../assets/logo.svg';

const Header = () => {
  return (
    <header className={'grid place-content-center'}>
      <nav
        className={
          'grid grid-cols-[auto_1fr] place-items-center shadow-md rounded-2xl px-2.5 py-1.5'
        }
      >
        <img src={logo} alt={'aaah logo'} width={'128px'} />
        <ul className={'flex gap-4 text-xl/12'}>
          <li>
            <a>Accueil</a>
          </li>
          <li>
            <a>Auteurs</a>
          </li>
          <li>
            <a>Blog</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
