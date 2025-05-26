interface SectionProps {
  title: string;
  content: string;
}
const Section = (props: SectionProps) => {
  return (
    <section className={'max-w-[65ch] py-8'}>
      <h1 className={'text-xl font-bold mb-2'}>{props.title}</h1>
      <p className={'text-lg text-justify'}>{props.content}</p>
    </section>
  );
};

export default Section;
