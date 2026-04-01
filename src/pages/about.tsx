const About = () => {
  return (
    <>
      <div className="card">
        <h1>Om Lottostat</h1>
        <p>
          Lottostat er en uoffisiell statistikkside for Norsk Tipping-lotterier.
          Siden viser historiske trekningstall, tallfrekvenser, premiestatistikk
          og vinneroversikter for Lotto, Viking Lotto og Euro Jackpot.
        </p>
        <p style={{ margin: 0 }}>
          Prosjektet ble opprinnelig laget for å utforske og lære om webutvikling,
          API-integrasjon og datavisualisering.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Datakilden</h2>
        <p>
          All data hentes fra Norsk Tippings åpne API. APIet returnerer
          trekningstall, premieinfo og vinneroversikter per trekning.
        </p>
        <p style={{ margin: 0 }}>
          APIet begrenser spørringer til maksimalt 15 uker av gangen.
          Ved lengre perioder hentes data i flere omganger — fremdriftslinjen
          viser hvor langt innlastingen har kommet.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Viktig merknad</h2>
        <p style={{ margin: 0 }}>
          Statistikken på denne siden er ment som informasjon og underholdning.
          Tidligere trekningstall gir ingen indikasjon på fremtidige resultater —
          hvert lotteritrekk er uavhengig og tilfeldig.
          Bruk informasjonen på eget ansvar.
        </p>
      </div>
    </>
  );
};

export default About;
