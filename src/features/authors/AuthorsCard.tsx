import avatar from './avatar.svg';

interface AuthorsCarProp {
  name: string;
  description: string;
  avatar: string;
}

const AuthorsCard = (props: AuthorsCarProp) => {
  return (
    <li className={'list-none'}>
      <div
        className={'w-50 h-50 overflow-hidden p-12 bg-gray-50 shadow drop-shadow-sm rounded-full'}
      >
        <img alt={'avatar'} src={avatar}></img>
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
