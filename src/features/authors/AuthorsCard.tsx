import avatar from './avatar.svg';

interface AuthorsCarProp {
  name: string;
  description: string;
  avatar: string;
}

const AuthorsCard = (props: AuthorsCarProp) => {
  return (
    <li
      className={
        'flex flex-col items-center list-none text-center grow-1 md:grow-0 md:basis-[20%] mb-8 px-4'
      }
    >
      <div
        className={
          'max-w-24 max-h-24 md:max-w-50 md:max-h-50 md:p-8 mx-auto overflow-hidden bg-gray-50 shadow drop-shadow-sm rounded-full'
        }
      >
        <img className={'scale-75 md:scale-100'} alt={'avatar'} src={avatar}></img>
      </div>
      <div className={'first-letter:uppercase text-xl font-bold pt-4'}>{props.name}</div>
      <p className={'inline-block  my-1.5 badge badge--member uppercase font-light text-sm'}>
        Membre
      </p>
      <div className={'inline-block text-sm font-light italic'}>
        <span className={'max-w-[25ch]'}>{props.description}</span>
      </div>
    </li>
  );
};

export default AuthorsCard;
