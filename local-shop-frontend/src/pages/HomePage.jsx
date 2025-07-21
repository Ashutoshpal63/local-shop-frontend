import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTruck } from 'react-icons/fi';

const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div 
          className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
        >
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
          Your Local Market, Delivered.
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-400 mb-8">
          Fresh groceries, delicious food, and essential goods from your favorite local shops, delivered to your doorstep in minutes.
        </p>
        <Link to="/products" className="glow-button inline-flex items-center text-lg">
          Start Shopping <FiArrowRight className="ml-2" />
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 text-center">
        <div className="glass-card p-8">
          <FiShoppingBag className="mx-auto text-5xl text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-2">Vast Selection</h3>
          <p className="text-slate-400">Browse thousands of products from a variety of local stores.</p>
        </div>
        <div className="glass-card p-8">
          <FiTruck className="mx-auto text-5xl text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-2">Ultra-Fast Delivery</h3>
          <p className="text-slate-400">Get your order delivered with our lightning-fast delivery agents.</p>
        </div>
        <div className="glass-card p-8">
            <div className="mx-auto h-[52px] w-[52px] flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          <h3 className="text-2xl font-bold mb-2">Secure Payments</h3>
          <p className="text-slate-400">Pay with confidence using our secure and reliable payment system.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;