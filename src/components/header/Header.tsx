import logo from '../../assets/logo.png';
import { Link } from 'wouter';

const Header = () => {
  return (
    <header className={'sticky z-40 top-0 grid place-content-center'}>
      <nav
        className={
          'grid grid-cols-[auto_1fr] bg-white place-items-end shadow-md rounded-4xl px-8 py-1.5'
        }
      >
        <img src={logo} alt={'aaah logo'} width={'128px'} />
        <ul className={'flex gap-4 text-xl/12'}>
          <li>
            <Link href="/">Accueil</Link>
          </li>
          <li>
            <Link href="/members">Membres</Link>
          </li>
          <li>
            <Link href="/actus">Actualités</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
