# Sprint review: sprint 3

<!--
  INSTRUKTION
  Del 1 fylls i INNAN reviewn, senast söndag kväll. Det är ert manus.
  Del 2 fylls i UNDER eller DIREKT EFTER reviewn.

  Reviewn med läraren är ungefär 20 minuter:
  - Sprintmål och vad som blev klart (2 min)
  - Demo av fungerande mjukvara (10 min)
  - Feedback och frågor (8 min)

  Visa bara stories som uppfyller Definition of Done. Halvfärdigt redovisas under "Blev inte klart".
  Demot ska köras på riktigt, inte med skärmdumpar. Testa det innan.
-->

**Datum:** 2026-11-16
**Deltagare:** Staffan, Jonathan, Anton, Axel

## Del 1: Förberedelse

### Sprintmål

- Fungerande inlogg på sidan.
- Intern organisering (DTOs/types).

**Uppnåddes sprintmålet?** Nej.

### Blev klart

| Issue | Story                                 | Visas av |
| ----- | ------------------------------------- | -------- |
| 62    | Lägg till organisation och admin-roll | Anton    |
| 54    | Dynamisk uppdateringar av bokningar   | Staffan  |
| 12    | Ta bort användare ur organisation     | Johan    |

### Blev inte klart

<!-- Vad och varför? Det är inget misslyckande, men det ska förklaras. -->

> **Exempel:** #9 Projektskelett blev klart, men databasen körs bara lokalt hos Amir. Vi underskattade hur lång tid Docker-uppsättningen tog.

| Issue   | Story                                | Varför inte klar                           | Vad händer med den? |
| ------- | ------------------------------------ | ------------------------------------------ | ------------------- |
| 63      | Presentations- och inloggningssida   | Axel är inte på reviewen och kan säga      |                     |
| 64 + 65 | Organisera typer och organisera DTOs | Anton fick lite annat att göra             | Ska fixa idag       |
| 61      | Inlogg                               | Backend klar, behöver fixa med token också |
| 63      | Presentation och inloggningssida     | Avvaktar att inlogg är på plats            |

### Demoplan

<!-- I vilken ordning visar ni? Vem gör vad? Berätta det som en användares väg genom appen, inte story för story. -->

> **Exempel:**
>
> 1. Sara skapar hushållet "Korridor 4B".
> 2. Lina lägger till tre sysslor.
> 3. Jonas visar att sysslorna finns kvar efter omladdning.

1. Staffan lägger till en bokning och visar att den sedan även läggs till i "mina bokningar"
2. Anton visar hur man lägger till en organisation.

### Frågor till läraren

<!-- Något ni vill ha feedback på eller är osäkra på? -->

-

## Del 2: Efter reviewn

### Feedback

> **Exempel:** Läraren frågade hur man vet vem som ska göra nästa disk. I deras kollektiv turas man om varje vecka i stället för att tilldela.

-
-

### Ändringar i backloggen

- Nya user stories: Lägg till/ta bort deltagare på möte, Lägg till deltagare i samband med att bokning skapas, Organisationsbaserad användarvy, Utloggning, Ta bort sig själv som deltagare på möte.
- Ny task: tidszon-lista.
