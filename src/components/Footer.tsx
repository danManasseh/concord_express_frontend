import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 sm:px-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Concord Express. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
