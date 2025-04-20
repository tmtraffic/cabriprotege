
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t py-4 bg-background">
      <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between text-sm">
        <p>
          &copy; {currentYear} Cabricop Traffic Resources. Todos os direitos reservados.
        </p>
        <p className="text-muted-foreground">
          Desenvolvido por TM Traffic
        </p>
      </div>
    </footer>
  );
};

export default Footer;
