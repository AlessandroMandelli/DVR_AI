# V.I.S.T.A. — PWA versione 2.3

**Visione Intelligente per la Sicurezza e la Tutela degli Ambienti**  
*Ogni prospettiva conta. Ogni rischio merita attenzione.*

PWA installabile e utilizzabile offline per esplorare un percorso di analisi fotografica degli ambienti universitari, associazione di controlli, validazione tecnica e produzione di un report.

## Schermate e comandi

1. **V.I.S.T.A.** — Schermata iniziale con icona a occhio e pulsante Inizia.
2. **Spazio / PoliMaps** — Selezione di ufficio 012, aula o laboratorio. Il disegno di pianta, senza cornice grigia esterna, è illustrativo: ogni locale selezionabile corrisponde alla propria stanza disegnata. Pulsante **Conferma spazio**.
3. **Acquisizione** — Foto scattata o caricata dall'utente, senza immagini preimpostate. Le fotografie equirettangolari con proporzioni circa 2:1 vengono mostrate con visualizzazione sferica a 360°. Pulsante **Analisi AI**.
4. **Analisi AI** — Per circa **4 secondi** un diagramma animato rappresenta «Fotografia + Documentazione → Analisi e confronto → Elementi da verificare». Si apre poi la vista della fotografia e dei controlli, con riquadri generati automaticamente e modificabili. Pulsante **Validazione**.
5. **Validazione** — Per ogni controllo: Conferma, Escludi, Integra, note multilinea, priorità e stato dell'intervento. I controlli creati da nuovi riquadri possono essere compilati testualmente. Pulsante **Registra validazione**.
6. **Report** — Elenco di segnalazioni ed esiti, senza ripetere la foto. Il pulsante unico **Salva report** mostra per circa **4 secondi** un'animazione di archiviazione in sovraimpressione e scarica lo ZIP contenente PDF, JSON e fotografia.

Il pulsante **Indietro** è nella parte inferiore sinistra di ogni schermata successiva alla prima; i dati già inseriti vengono mantenuti.

## Immagini panoramiche e riquadri

Per un'immagine equirettangolare a 360°:

- Trascina con il mouse o con un dito per orientare la vista;
- usa la rotellina o due dita per lo zoom;
- usa il pulsante **Schermo intero** per espandere la panoramica.

Nella schermata Analisi, la barra sopra la fotografia offre cinque azioni:

- **Esplora**: ruota la vista panoramica; clicca su un rettangolo per selezionarlo;
- **Aggiungi**: trascina per disegnare un rettangolo. Si apre un popup per inserire il nome: solo confermando vengono creati il rettangolo e la voce corrispondente nell'elenco a destra;
- **Sposta**: trascina un rettangolo esistente;
- **Ridimensiona**: trascina su un rettangolo per modificarne la larghezza e l'altezza;
- **Elimina**: cancella il rettangolo selezionato, insieme al controllo associato, previa conferma.

I riquadri iniziali si distribuiscono nella fascia centrale della foto. Il nome di un controllo creato manualmente può essere modificato dalla lista sulla destra tramite **Rinomina**. La validazione non contiene più il comando duplicato "Aggiungi criticità".

I riquadri restano memorizzati nelle coordinate normalizzate dell'immagine e mantengono la posizione quando la panoramica ruota o viene ingrandita. Scegliere un controllo nell'elenco orienta la panoramica verso la sua area. Le annotazioni appaiono anche sulla fotografia inclusa nel PDF.

Per le fotografie ordinarie, le stesse azioni di annotazione sono disponibili su una vista piana.

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub (per esempio `vista`).
2. Estrai **il contenuto** dello ZIP e carica nella radice del repository `index.html`, `styles.css`, `app.js`, `pano-viewer.js`, `service-worker.js`, `manifest.webmanifest`, `README.md` e la cartella `assets`.
3. Apri **Settings → Pages**, seleziona **Deploy from a branch**, scegli `main` e `/ (root)`.
4. Accedi all'indirizzo `https://TUOACCOUNT.github.io/vista/`.
5. Per installare la PWA, usa il comando di installazione del browser oppure, su Safari iOS, **Condividi → Aggiungi alla schermata Home**.

Il service worker salva offline i file principali dell'app dopo il primo caricamento. Per installarla serve HTTPS o localhost. La versione 2.3 utilizza una cache nuova, in modo da non riproporre file della versione precedente.

## Archiviazione locale

- Fotografia corrente: IndexedDB del browser.
- Controlli, rettangoli, osservazioni, stati e navigazione: localStorage.
- Report esportato: un solo file ZIP con `.pdf`, `.json` e `_foto.jpg`.
- Il PDF include la fotografia con i riquadri numerati, senza alterarne le proporzioni.
- L'animazione finale rappresenta un flusso verso un archivio; **non invia alcun dato a un server o database online**.

## Ambito effettivo del prototipo

Le aree iniziali sono calcolate con un algoritmo locale che ricerca regioni ad alto contrasto. **Non è un modello AI che riconosce semanticamente pericoli**. Le checklist iniziali dipendono dal tipo di spazio selezionato; l'associazione fra rettangoli e controlli serve alla revisione e non costituisce una diagnosi tecnica. L'animazione che mostra il confronto con DVR, PoliMaps e requisiti rappresenta un'architettura futura: **non legge documenti né interroga sistemi di Ateneo**.

I risultati richiedono sempre verifica professionale. La PWA non aggiorna un DVR ufficiale e non effettua una reale validazione da remoto.

## File

- `index.html`: avvio della PWA.
- `styles.css`: grafica responsive, layout e annotazioni.
- `app.js`: percorso operativo, logica e archivio PDF/JSON/ZIP.
- `pano-viewer.js`: proiezione sferica WebGL, panoramica, comandi touch/mouse e annotazioni geometriche.
- `manifest.webmanifest`, `service-worker.js`: installazione e cache offline.
- `assets/icon-192.png`, `assets/icon-512.png`: icone V.I.S.T.A.

**Versione 2.3 — 18 novembre 2026.**
