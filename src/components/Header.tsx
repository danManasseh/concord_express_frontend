import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-8 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-foreground">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Concord Express</h1>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-8">
            <Link
              to="/login"
              className="text-foreground font-normal transition-colors duration-200 ease-in hover:text-primary"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-foreground font-normal transition-colors duration-200 ease-in hover:text-primary"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
