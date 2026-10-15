# Projekt Lokalbokaren

Lokalbokaren är till för organisationer och deras användare som har olika lokaler (konferensrum o dyl) som de vill ställa till sina medlemmars/anställdas förfogande. Man ska kunna reservera lokaler för möten, antingen enstaka gånger eller återkommande. Mötena ska kunna vara av olika typer, och den som bokar ska kunna bjuda in folk till mötena och dessa ska man kunna besvara. Eventuell integration med kalendersystem (kanske inte MVP). Systemet ska se till att lokaler inte blir dubbelbokade, och man ska kunna sätta tillgänglighetstider på lokalerna.

## Vad som ingår

- Skapa organisationer, användare, och lokaler.
- Boka lokal under viss tid.
- Inbjudningar till bokningar och svar på dessa.
- Ombokningar.
- Återkommande bokningar.
- Se vilka lokaler som är tillgängliga, eventuellt presenterat som schema.

## Vad som inte ingår

- Betalsystem.
- Integration med användares kalendrar.
- Lokalbegränsningar.
- Lokalegenskaper.
- Helgdagar och liknande.

## User Stories

- Epic: Husansvarig
  - Som husansvarig vill jag kunna skapa lokaler i min organisation.
  - Som husansvarig vill jag kunna ändra på lokaler i min organisation.
  - Som husansvarig vill jag kunna ta bort lokaler i min organisation.
  - Som husansvarig vill jag kunna ta bort användare från min organisation.
  - Som husansvarig vill jag kunna ändra på bokningar i min organisation.
- Som användare vill jag kunna boka en lokal i min organisation.
  - I samband med detta vill jag kunna bjuda in andra användare.
  - När jag får en inbjudan vill jag kunna godkänna eller neka den.
  - Jag vill kunna hoppa av ett bokat möte.
- Som användare vill jag kunna se vilka lokaler som finns och deras tillgänglighet.
  - Jag vill därifrån kunna se detaljer för en viss lokal.
- Som användare vill jag kunna skapa en profil.
  - Som användare vill jag kunna redigera och ta bort min profil.
  - Som användare vill jag kunna koppla min profil till en organisation.
