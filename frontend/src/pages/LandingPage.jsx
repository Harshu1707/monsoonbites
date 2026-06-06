import { CloudRain, Umbrella, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-monsoon-blue via-[#17659d] to-monsoon-green text-white">
      <div className="rain">
        {Array.from({ length: 70 }).map((_, i) => (
          <span
            key={i}
            className="drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.8 + Math.random() * 1.4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      <section className="relative mx-auto grid max-w-7xl gap-10 px-6 py-28 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 flex items-center gap-2 font-bold text-blue-100"><CloudRain /> Monsoon cravings delivered fast</p>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">Warm Indian bites for rainy nights.</h1>
          <p className="mt-6 text-xl text-blue-50">Discover top restaurants, track orders live, and enjoy a glassy rain-inspired Zomato-style experience.</p>
          <div className="mt-8 flex gap-4">
            <Link className="btn !bg-white !text-monsoon-blue" to="/home">Order now</Link>
            <Link className="btn !bg-monsoon-green" to="/restaurants">Explore restaurants</Link>
          </div>
        </div>
        <div className="glass rounded-[2rem] p-8 text-monsoon-blue shadow-glass">
          <Umbrella className="h-16 w-16 text-monsoon-green" />
          <h2 className="mt-6 text-3xl font-black">Rain-safe delivery</h2>
          <p className="mt-3 text-gray-700">Live status updates, curated comfort food, and delicious menus from the city’s best kitchens.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Stat icon={<Utensils />} label="50+ dishes" />
            <Stat icon={<CloudRain />} label="Monsoon deals" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ icon, label }) {
  return <div className="rounded-2xl bg-white/70 p-4 font-bold">{icon}<p>{label}</p></div>;
}
