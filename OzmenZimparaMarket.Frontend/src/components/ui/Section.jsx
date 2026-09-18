const bosluklar = {
  normal: "py-14 md:py-20 lg:py-24 xl:py-28",
  compact: "py-10 md:py-14 lg:py-16",
  none: "",
};

function Section({ children, className = "", spacing = "normal" }) {
  return (
    <section className={`${bosluklar[spacing]} ${className}`}>
      {children}
    </section>
  );
}

export default Section;
