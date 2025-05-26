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
        'max-w-92 grid grid-rows-2 place-items-center list-none p-8 py-2 border rounded-2xl'
      }
    >
      <div className={'w-32 h-32 overflow-hidden p-4 border rounded-full'}>
        <img alt={'avatar'} src={avatar}></img>
      </div>
      <div>
        <div className={'first-letter:uppercase text-xl font-bold'}>{props.name}</div>
        <div className={'text-lg font-light italic w-full'}>{props.description}</div>
      </div>
    </li>
  );
};

export default AuthorsCard;
