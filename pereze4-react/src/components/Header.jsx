import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/">
          <img src="/white-cat.png" alt="White Cat Logo" className="white-cat-image" />
        </Link>
        <div className="header-text">
          <h1>White Cat Workout Tracker</h1>
          <p>Fitness with Feline Finesse</p>
        </div>
      </div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/add">Add Exercise</Link>
      </nav>
    </header>
  );
}
