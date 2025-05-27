import AuthorsCard from '../features/authors/AuthorsCard.tsx';

const authors = [
  'FERRARON Paul',
  'CASTANO Sébastien',
  'ANTONY Matthieu',
  'BOUMÉDINE Ilies',
  'PROUVOT vivien',
  'BEYSSAC pierre',
  'REBOUL Léon',
  'PARIS Pierre',
  'FARGUES Frédéric',
  'Couderc Franz',
  'COURONNAUD Charles-Hector',
  'LAURAS Christophe',
  'FABRIS Lisa',
  'MOYANO Gabriel',
  'GOTTY Baptiste',
  'CARON Cyrille',
  'SIRIEIX Florian',
  'ROTHENBERG Agnès',
  'DUPILLE Florian',
  'DESCY Nathan',
  'REDAL Stephane',
  'RODRIGUEZ juan',
  'HEYWANG Alex',
  'PARIS Pierre',
  'FALLAIT Guillaume',
  'BONDURAND Audrey',
  'ROUYRE jean-sebastien',
  'KOBEL Laurent',
  'FRANIATTE Marine',
  'SOUTOU Rodolphe',
  'REBOUL Léon',
  'MONAGO Grégory',
  'RUBIELLA Christian',
  'NOUGARET Thomas',
  'COMBES Stéphane',
  'JEANNE Steven',
  'BRANDON Corentin',
  'VIALA Romain',
  'ALIHADEF abdelkader',
  'REVERBEL Sandrine',
  'DE FRANCQUEVILLE Yves Philippe',
];
const Authors = () => {
  return (
    <ul className={'grid grid-cols-2 md:grid-cols-3 gap-12'}>
      {authors.map((fullName) => (
        <AuthorsCard
          name={fullName.split(' ')[1]}
          description={"Courte description sur l'auteur"}
          avatar={''}
        />
      ))}
    </ul>
  );
};

export default Authors;
