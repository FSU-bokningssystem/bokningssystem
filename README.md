<!--
  INSTRUKTION
  Det här är projektets startsida. Ersätt allt i den här filen med information om ert projekt.
  Kommentarer som den här syns bara när man redigerar filen, inte på GitHub. Ta bort dem när ni är klara.
-->

# Projektnamn

<!-- En eller två meningar: vad gör applikationen och för vem? -->

> **Exempel (Lokalbokaren):** En webbapp där anställda i en organisation kan boka lokaler som finns tillgängliga i de hus som finns till organisationens förfogande.

## Teamet

| Namn     | GitHub            |
| -------- | ----------------- |
| Staffan  | StaffanBaloo      |
| Axel     | axelkodandersson  |
| Johan    | johansvenssonS    |
| Jonathan | JonathanBrandt560 |
| Anton    | doresteanton7     |

## Teknik

<!-- Frontend, backend, databas och eventuella större bibliotek. Motivera valet i docs/beslutslogg.md. -->

| Del      | Teknik      |
| -------- | ----------- |
| Frontend | React       |
| Backend  | Spring Boot |
| Databas  | MySQL       |

## Kom igång

<!--
  Steg för steg: hur startar man projektet lokalt från ett nytt klonat repo?
  Testa instruktionen själva på en annan dator. Om den inte fungerar där fungerar den inte för läraren heller.
-->

- Klona repositoriet i en IDE, t ex IntelliJ eller med git clone https://github.com/FSU-bokningssystem/bokningssystem
- Vid behov, ladda in beroenden via Maven.
- Se till att databasen som ligger i Aiven är igång.
- Kör projektet via IntelliJ med environment-variabler som anges separat (detta för att inte sprida inlogg vind för våg).
- Än så länge har vi ingen frontend mer än Swagger installerat (http://localhost:8080/swagger-ui.html).
- För att aktivera react, gå in i /frontend och kör npm install för att få alla dependencies, och sedan npm run dev för att starta react. Än så länge är inte detta kopplat till projektet som sådant men finns för att jobba vidare på.

---

## Dokumentation

| Dokument                                         | Innehåll                                        |
| ------------------------------------------------ | ----------------------------------------------- |
| [Gruppkontrakt](docs/gruppkontrakt-projekt.md)   | Hur vi samarbetar                               |
| [Definition of Done](docs/definition-of-done.md) | När en story räknas som klar                    |
| [MVP](docs/mvp.md)                               | Vad som ingår i första versionen                |
| [Databasschema](docs/databasschema.md)           | Tabeller och relationer                         |
| [Beslutslogg](docs/beslutslogg.md)               | Viktiga beslut och varför                       |
| [Sprintar](docs/sprintar/)                       | Planning, standups, review och retro per sprint |
| [Individuella reflektioner](docs/reflektioner/)  | En per person, lämnas in vecka 8                |

## Board

<!-- Länk till ert projekt i GitHub Projects. -->

[Länk till boarden](https://github.com/orgs/FSU-bokningssystem/projects/2/views/1)
