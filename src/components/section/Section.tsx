import './section.css';

interface SectionProps {
  title: string;
  content: string;
}

const Section = (props: SectionProps) => {
  return (
    <section className={'section max-w-[75ch] py-8 px-4'}>
      <h1 className={'text-4xl font-bold mb-3'}>{props.title}</h1>
      <p className={'text-xl/9 text-justify'}>{props.content}</p>
    </section>
  );
};

export default Section;
