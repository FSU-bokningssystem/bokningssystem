# Databasschema

<!--
  INSTRUKTION
  Utgå från era Must-stories: vilka tabeller och fält behövs för att bygga dem?
  Ni kan antingen
    a) rita schemat i ett verktyg (dbdiagram.io, drawSQL, Excalidraw) och lägga in bilden här, eller
    b) skriva det som ett Mermaid-diagram direkt i den här filen. GitHub ritar upp det automatiskt.
  Uppdatera schemat när det ändras. Större ändringar skrivs också in i beslutsloggen.
-->

## Diagram

<!-- Alternativ a: lägg bilden i docs/bilder/ och länka den så här: -->
<!-- ![Databasschema](bilder/databasschema.png) -->

<!-- Alternativ b: Mermaid. Exemplet nedan är Sysslo. Ersätt det med ert eget schema. -->

```mermaid
erDiagram
    users {
        bigint id PK
        varchar(100) first_name
        varchar(100) last_name
        varchar(100) email UK
        varchar(45) phone
        varchar(64) time_zone
    }
    credentials {
        bigint user_id PK,FK
        varchar(72) password
        varchar(45) role
    }
    organizations {
        bigint id PK
        varchar(100) name
    }
    memberships {
        bigint id PK
        bigint user_id PK,FK
        bigint organization_id PK,FK
        enum(MEMBER,ADMIN,OWNER) member_role
    }
    houses {
        bigint id PK
        varchar(45) name
        varchar(45) street
        varchar(10) street_number
        varchar(10) zipcode
        varchar(45) city
        varchar(64) time_zone
        bigint organization_id FK
    }
    rooms {
        bigint id PK
        varchar(10) room_number
        int floor
        varchar(45) name
        text description
        bigint house_id FK
        tinyint available
    }
    bookings {
        bigint id PK
        varchar(45) title
        text description
        timestamp start_time
        bigint room_id FK
        int duration
        bigint owner FK
    }
    participants {
        bigint user_id PK,FK
        bigint booking_id PK,FK
    }
    houseowners {
        bigint user_id PK,FK
        bigint house_id PK,FK
    }
    users ||--o{ credentials : "user_id"
    users ||--o{ memberships : "user_id"
    organizations ||--o{ memberships : "organization_id"
    organizations ||--o{ houses : "organization_id"
    houses ||--o{ rooms : "house_id"
    rooms ||--o{ bookings : "room_id"
    users ||--o{ bookings : "owner"
    users ||--o{ participants : "user_id"
    bookings ||--o{ participants : "booking_id"
    users ||--o{ houseowners : "user_id"
    houses ||--o{ houseowners : "house_id"

```

## Tabeller

<!-- Kort förklaring av varje tabell: vad den innehåller och varför den finns. -->

| Tabell          | Innehåll                                                          |
| --------------- | ----------------------------------------------------------------- |
| `users`         | En enskild användare.                                             |
| `credentials`   | Lösen för användare plus roll i systemet (ej i organisation).     |
| `memberships`   | En användares förhållande till en organisation.                   |
| `organizations` | En organisation som kan ha medlemmar och hus.                     |
| `house`         | En samling lokaler på en viss adress.                             |
| `room`          | En specifik lokal                                                 |
| `bookings`      | En bokning av en lokal                                            |
| `participants`  | Deltagare i ett möte.                                             |
| `houseowners`   | Användare som har rätt att lägga till och redigera lokaler i hus. |
