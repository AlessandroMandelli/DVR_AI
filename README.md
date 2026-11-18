# V.I.S.T.A. — PWA v2.1

**Visione Intelligente per la Sicurezza e la Tutela degli Ambienti**

*Ogni prospettiva conta. Ogni rischio merita attenzione.*

Una PWA installabile per presentare e sperimentare il processo di acquisizione fotografica, pre-analisi degli spazi, validazione tecnica e redazione di un report strutturato.

## Funzionamento

1. **Avvio:** schermata essenziale con icona a occhio, nome V.I.S.T.A. e payoff.
2. **Spazio:** selezione di ufficio 012, aula o laboratorio tramite elenco e planimetria schematica; pulsante **Conferma spazio**.
3. **Acquisizione:** area inizialmente vuota; carica una fotografia o usa la fotocamera del dispositivo; pulsante **Registra acquisizione**. Non sono proposte immagini iniziali.
4. **Analisi AI:** vengono calcolati automaticamente rettangoli sulla fotografia tramite elaborazione locale dei contrasti; sono proposti controlli legati alla tipologia di spazio. Selezionando un controllo viene evidenziata un’area. Pulsante **Validazione**.
5. **Validazione:** opzioni **Conferma**, **Escludi**, **Integra** con annotazioni multilinea. È possibile aggiungere una nuova criticità e indicare lo stato dell’intervento (**Da verificare**, **Da eseguire**, **Risolto**). Pulsante **Registra validazione**.
6. **Report:** riepilogo, fotografia con aree visive, esiti, interventi e note. Unico pulsante principale **Salva report** con animazione verso un archivio. Produce **un solo ZIP** contenente PDF, JSON e foto, e tenta di conservarlo in IndexedDB.

La navigazione consente di tornare alle schermate precedenti senza perdere il lavoro. La grafica si adatta a tablet, smartphone e desktop.

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub (ad esempio `vista`).
2. Estrai lo ZIP di questa versione e carica i file (`index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `service-worker.js`, `README.md`) e la cartella `assets` nella **radice** del repository.
3. Apri **Settings > Pages > Deploy from a branch**, seleziona `main` e `/ (root)`.
4. Apri l’URL `https://TUOACCOUNT.github.io/vista/` (o il nome del repository scelto).
5. Su iOS, da Safari, **Condividi > Aggiungi alla schermata Home**. Su desktop Chrome/Edge usa la funzione di installazione del browser.

Il service worker consente l’utilizzo offline dei file dell’app dopo il primo caricamento con connessione. Per l'installazione occorrono HTTPS o localhost; l'apertura diretta da file system non è sufficiente.

## Elaborazione delle immagini e limiti

L'app **non utilizza ancora un modello AI reale per il riconoscimento dei pericoli**. Le aree rettangolari vengono **individuate automaticamente** mediante una procedura di analisi locale delle variazioni di luminosità e dei contorni. L'algoritmo trova aree visivamente ricche di dettagli, **non identifica né certifica i rischi**. Le categorie e i controlli proposti provengono da elenchi predefiniti per uffici, aule e laboratori, e non sono inferiti semanticamente dalla foto. La selezione di un controllo evidenzia una regione per la consultazione, non una corrispondenza verificata tra oggetto e rischio.

Il report è una **pre-analisi** e non sostituisce sopralluoghi, misurazioni, verifiche e valutazione da parte delle figure competenti. Non aggiorna alcun DVR. Il progetto non interroga PoliMaps o altri sistemi gestionali.

## Archiviazione e dati

- Fotografia corrente: compressa in JPEG e conservata, quando disponibile, nell'IndexedDB del dispositivo.
- Scelte di revisione e testo: conservati nel `localStorage` del browser.
- Report: un ZIP locale contenente `.pdf` (versione stampabile a pagine A4, resa come immagine), `.json` (dati strutturati) e `_foto.jpg`.
- Il pulsante di salvataggio mostra un'animazione che rappresenta un trasferimento verso l'archivio, **ma non effettua alcun upload verso un database online**. Un backend e adeguati controlli di autorizzazione e protezione dei dati saranno necessari per un invio reale.
- Nessuna fotografia è inviata a servizi esterni o API.

## File del progetto

- `index.html`: struttura e caricamento delle risorse.
- `styles.css`: layout responsive e aspetti grafici.
- `app.js`: tutte le schermate, logica dei rettangoli automatici, validazione, produzione ZIP/PDF/JSON.
- `manifest.webmanifest`: installazione PWA.
- `service-worker.js`: cache locale offline.
- `assets/icon-192.png`, `assets/icon-512.png`: icone a forma di occhio.

**Versione: 2.1 · 18 novembre 2026**
