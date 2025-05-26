interface AuthorsCarProp {
  name: string;
  description: string;
  avatar: string;
}

const AuthorsCard = (props: AuthorsCarProp) => {
  return (
    <li className={'w-96 max-w-96 grid grid-cols-[auto_1fr] list-none shadow-xl p-4 rounded-2xl'}>
      <div className={'w-24 h-24 border rounded-full'}></div>
      <div className={'ml-8'}>
        <div className={'text-left font-bold'}>{props.name}</div>
        <div className={'text-justify font-light italic w-full'}>{props.description}</div>
      </div>
    </li>
  );
};

export default AuthorsCard;
