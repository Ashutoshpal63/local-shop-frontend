const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-slate-400">
        <p>© {new Date().getFullYear()} BazarYo. All Rights Reserved.</p>
        <p className="text-sm mt-1">Delivering Happiness, One Order at a Time.</p>
      </div>
    </footer>
  );
};

export default Footer;