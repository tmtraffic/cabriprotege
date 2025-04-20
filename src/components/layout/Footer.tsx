
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t py-4 bg-background">
      <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between text-sm">
        <p>
          &copy; {currentYear} Cabricop Traffic Resources. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/privacidade" className="text-muted-foreground hover:text-foreground transition-colors">
            Política de Privacidade
          </Link>
          <Link to="/termos" className="text-muted-foreground hover:text-foreground transition-colors">
            Termos de Uso
          </Link>
          <p className="text-muted-foreground">
            Desenvolvido por TM Traffic
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
