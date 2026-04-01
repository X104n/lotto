const Euro = () => {
  return (
    <>
      <div className="card">
        <h1>Euro Jackpot 💶</h1>
        <p>
          Euro Jackpot er et pan-europeisk lotteri med trekning hver tirsdag og fredag.
          5 tall trekkes fra 1–50, pluss 2 eurotall fra 1–12.
          Jackpot krever 5 rette + 2 riktige eurotall.
        </p>
        <p style={{ margin: 0 }}>
          Spillet tilbys i over 18 europeiske land. Jackpoten starter på 10 millioner euro
          og ruller opp til maksimalt 120 millioner euro. Premiepotten deles mellom alle
          deltakende land, noe som gir noen av Europas høyeste lotterijackpotter.
        </p>
      </div>
      <div className="card coming-soon">
        <span className="icon">🚧</span>
        <p>Statistikk for Euro Jackpot kommer snart.</p>
      </div>
    </>
  );
};

export default Euro;
