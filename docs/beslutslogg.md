# Beslutslogg

<!--
  INSTRUKTION
  Här skriver ni ner större beslut och varför ni tog dem. Det är inte en lista över allt ni gör,
  utan över de val som påverkar projektet och som någon senare kan undra över.

  Exempel på beslut som ska hit:
  - Val av stack, ramverk eller större bibliotek
  - Hur ni strukturerar koden (mappar, lager, API-design)
  - Större ändringar i MVP:n eller databasschemat
  - Saker ni medvetet valt bort

  Skriv beslutet när det tas, inte i efterhand. Lägg nyaste beslutet överst.
  Ett beslut kan ersättas av ett senare. Skriv då "Ersatt av #N" på det gamla i stället för att ta bort det.
-->

## Mall

Kopiera den här för varje nytt beslut:

```markdown
## #N Rubrik

**Datum:**
**Status:** Gäller / Ersatt av #N

**Bakgrund:** Vad behövde vi bestämma, och varför?

**Alternativ:**
- Alternativ A
- Alternativ B

**Beslut:** Vad valde vi?

**Varför:** Varför valde vi det, och vad valde vi bort?

**Konsekvenser:** Vad betyder beslutet för projektet framåt?

```
## #3 Main protection

**Datum:** 2026-10-20
**Status:** Gäller

**Bakgrund:** Vi behövde besluta om skydd för main.

**Beslut:** Vi valde standarden: inga merges till main utan pull request, pull requesten måste godkännas av minst en annan person, och ägare har inte rätt att köra över den regeln.

**Varför:** För att hindra ogenomtänkta ändringar av main och för att få gemensamt "ägande" av koden.

**Konsekvenser:** Tanken är att main blir skyddad.

```

```
## #2 Repositories

**Datum:** 2026-10-20
**Status:** Gäller

**Bakgrund:** Vi behövde avgöra om vi skulle ha backend och frontend i samma repository eller två olika.

**Alternativ:**
- FE och BE i samma repository.
- Två olika repositories för FE och BE.

**Beslut:** Vi valde att lägga allt i samma repository. 

**Varför:** För att det blir krångel med dokumentationen och boarden i två olika repos, vi slipper hålla reda på vilket som ska hamna var.

**Konsekvenser:** Vi får vara noggranna med filstrukturen i projektet så inte de olika ramverken kolliderar med varandra.

---

## #1 Stack: React, Java/SpringBoot, och MySQL
**Datum:** 2026-10-16
**Status:** Gäller

**Bakgrund:** Vi behövde välja teknik innan vi satte upp projektet.
**Alternativ:**
Vi hade inte mycket att fundera på när det gäller frontendbiten utan kom fram till att den skulle vara React med Typescript.
Som backend hade vi valen mellan Node/Express och Java/SpringBoot och valde Java/Springboot då man då får mycket "gratis".
Som databas valde vi till att börja med MySQL då vi är vana vid den sedan tidigare. Vi har dock sagt att vi ska undersöka möjligheten till att ha databasen online och kanske då reviderar valet.
**Beslut:** React, Java/SpringBoot, MySQL

**Varför:** Vi har jobbat med dessa verktyg tidigare och är tillräckligt bekväma med dessa, och vill inte lägga arbete på att lära oss nya tekniska verktyg samtidigt som vi lär oss arbetssätt.

**Konsekvenser:** Inga för tillfället.

---

<!-- Era beslut nedan, nyaste överst. -->
