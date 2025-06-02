import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A simple <nav> bar with links to Home and Create.
 * Using <Link> from react-router-dom creates a true SPA behavior.
 */
export default function Navigation() {
  return (
    <nav className="App-nav">
      <Link to="/">Home</Link>
      <Link to="/add">Add Exercise</Link>
    </nav>
  );
}
