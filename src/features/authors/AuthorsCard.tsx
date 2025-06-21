import avatar from './avatar.svg';

interface AuthorsCarProp {
  name: string;
  description: string;
  avatar: string;
}

const AuthorsCard = (props: AuthorsCarProp) => {
  return (
    <li className={'list-none text-center'}>
      <div
        className={
          'max-w-24 max-h-24 md:max-w-50 md:max-h-50 md:p-8 mx-auto overflow-hidden bg-gray-50 shadow drop-shadow-sm rounded-full'
        }
      >
        <img className={'scale-75 md:scale-100'} alt={'avatar'} src={avatar}></img>
      </div>
      <div>
        <div className={'first-letter:uppercase text-xl font-bold pt-4'}>{props.name}</div>
        <p className={'inline-block my-1.5 badge badge--member uppercase font-light text-sm'}>
          Membre
        </p>
        <div className={'text-sm font-light italic max-w-[25ch]'}>{props.description}</div>
      </div>
    </li>
  );
};

export default AuthorsCard;
