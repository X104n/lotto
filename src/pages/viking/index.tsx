const Viking = () => {
  return (
    <>
      <div className="card">
        <h1>Viking Lotto ⚔️</h1>
        <p>
          Viking Lotto er et nordisk-baltisk lotteri som trekkes hver onsdag.
          6 tall trekkes fra 1–48, pluss ett vikingtall fra 1–5.
          Jackpot krever 6 rette + riktig vikingtall.
        </p>
        <p style={{ margin: 0 }}>
          Spillet drives i fellesskap av ni land: Norge, Sverige, Danmark, Finland,
          Island, Estland, Latvia, Litauen og Kroatia. Premiepoolen deles på tvers av alle land,
          noe som gir store jackpotter.
        </p>
      </div>
      <div className="card coming-soon">
        <span className="icon">🚧</span>
        <p>Statistikk for Viking Lotto kommer snart.</p>
      </div>
    </>
  );
};

export default Viking;
