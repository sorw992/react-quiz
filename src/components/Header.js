//presentational component (it doesn't even receive any props and doesn't have any states)
function Header() {
  return (
    <header className="app-header">
      <img src="logo512.png" alt="React logo" />
      <h1>The React Quiz</h1>
    </header>
  );
}

export default Header;
