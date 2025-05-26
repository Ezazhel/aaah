import Section from '../components/section/Section.tsx';

const sections = [
  {
    title: "Un groupement d'auteur.ices",
    content: `
  L'AAAH! (Association des Auteur·rice·s Autour et en Hérault) regroupe des créateurs de jeux de société. 
  Nous favorisons l'entraide, la diffusion des prototypes, et l'organisation d'événements pour promouvoir le jeu sous toutes ses formes.`,
  },
  {
    title: 'Basé sur Montpellier',
    content: `Bien que l'association soit majoritairement basé à Montpellier, sa zone d'influence n'est pas limité à cette jolie ville.
    Comme notre nom l'indique, nous acceptons également les auteurs des régions environnantes ! `,
  },
  {
    title: 'Vous avez des idées mais ne savez pas où commencer ?',
    content: `Cela tombe bien ! C'est justement l'objectif de la AAAH! Nous avons tous démarré pratiquement sans connaissance et bien qu'il existe énormement de forum ou livre au sujet du Game Design c'est parfois bien plus intéressant d'avoir l'aide de personne expérimenté !`,
  },
  {
    title: 'Participation à des festivals',
    content: `Quoi de mieux pour présenter son prototype que des lieux dédiés ? 
    La AAAH! est présente sur la majorité des festivals de la région Occitanie. Grâce à notre discord impossible de rater la date de ces évènements. 
    Encore mieux, on se réunit régulièrement pour se présenter l'avancée de notre travail et à chaque journée prototype on essaie au maximum de s'entre-aider pour aller toujours plus loin !`,
  },
];

const Home = () => {
  return (
    <div className={'grid place-items-center'}>
      {sections.map((section, index) => (
        <Section key={index} title={section.title} content={section.content} />
      ))}
    </div>
  );
};

export default Home;
