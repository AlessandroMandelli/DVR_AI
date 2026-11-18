# AI & Sicurezza — PWA dimostrativa (v1.0.0)

**Prototipo di simulazione interattiva, non strumento ufficiale di valutazione dei rischi.**

Questa PWA è basata sul concept *Change Agent: AI & gestione della sicurezza sul lavoro* (caso pilota Ufficio 012, Dipartimento DABC, Politecnico di Milano) e sui mock-up contenuti nella presentazione di progetto. La simulazione si svolge completamente nel browser, senza API e senza servizi esterni.

## I sette passaggi

1. Il problema: stato attuale e obiettivo del concept.
2. Selezione dello spazio: planimetria in stile PoliMaps, **non collegata a PoliMaps**. È disponibile l'ufficio 012 (caso pilota previsto) oppure un laboratorio **illustrativo** ispirato al mock-up.
3. Acquisizione: vista panoramica illustrativa; caricamento di una fotografia locale o scatto dalla fotocamera del dispositivo. Le immagini equirettangolari 2:1 sono esplorabili nel visore WebGL; le altre immagini sono mostrate in modalità piana. La PWA non comanda direttamente fotocamere Ricoh Theta.
4. Analisi: animazione dei passaggi dell'agente AI. **Nessuna AI reale analizza la fotografia**: pericoli e rischi sono esempi predefiniti per ogni scenario.
5. Report: segnalazioni, possibili azioni, priorità illustrative e informazioni che richiedono verifica ulteriore.
6. Validazione: un revisore seleziona Conferma, Escludi oppure Integra, aggiungendo note.
7. Risultato: riepilogo, esportazione JSON e stampa/salvataggio PDF tramite la funzione di stampa del browser.

Dalla home è disponibile anche **Demo guidata · 60 s**, con il ritmo dei sette passaggi dello storyboard. In questa modalità **anche le scelte di validazione sono simulate**.

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub (per esempio `ai-sicurezza-demo`).
2. Estrai lo ZIP e carica i file e la cartella `assets` **nella radice del repository**. Non caricare soltanto il file ZIP.
3. In **Settings > Pages**, scegli **Deploy from a branch** e seleziona **main / (root)**.
4. Apri l'indirizzo pubblicato, ad esempio `https://<account>.github.io/ai-sicurezza-demo/`.
5. In Chrome/Edge usa il comando `Installa` dell'app; su iPhone apri con Safari e scegli **Condividi > Aggiungi alla schermata Home**.

Tutti i percorsi dell'app sono **relativi** (`./`) e funzionano anche in un repository pubblicato sotto un percorso di progetto.

> Nota: per l'installazione della PWA e il service worker è necessario **HTTPS** (come GitHub Pages) o `localhost`. Aprire direttamente `index.html` dal filesystem può mostrare l'interfaccia, ma non abilita l'installazione e la cache offline.

## Offline, salvataggio e privacy

- Al primo caricamento online, il service worker memorizza i file statici per l'utilizzo offline.
- Scelte e note dimostrative vengono salvate nel `localStorage` del browser; le immagini caricate **non** sono salvate in `localStorage` e non vengono inviate a un server.
- L'immagine caricata può quindi scomparire dopo un aggiornamento o la chiusura della pagina. In tal caso la scena dimostrativa è ripristinata.
- Il file JSON esportato non contiene il contenuto binario delle immagini.
- Per cambiare la versione cache dopo modifiche, aggiornare la costante `CACHE` in `service-worker.js`.

## Limiti e prossimi sviluppi

- Nessun accesso reale a PoliMaps, DVR, servizi di Ateneo o normative dinamiche.
- Nessuna analisi di immagini con AI, classificazione del rischio validata o aggiornamento dei DVR.
- Non sostituisce sopralluoghi, misure strumentali, verifiche impiantistiche o competenze in materia di sicurezza.
- Per un'applicazione operativa occorrerebbero un backend sicuro, autorizzazioni e governance dei dati, fonti ufficiali, integrazione controllata con un modello AI, audit trail e test su falsi positivi/negativi.
- La priorità riportata nelle schede è illustrativa e **non** corrisponde ad alcuna valutazione ufficiale.

## File

- `index.html`: struttura dell'app.
- `styles.css`: grafica responsive e stile di stampa.
- `app.js`: simulazione, navigazione, visore e report JSON.
- `manifest.webmanifest`: metadati per l'installazione.
- `service-worker.js`: cache offline.
- `assets/`: scena panoramica di fantasia, fotografia del campus presente nei materiali forniti, immagine laboratorio tratta dai mock-up, icone.

© Contenuti e immagini del concept provenienti dal materiale fornito per questa demo. Il progetto è una simulazione e **non un servizio ufficiale del Politecnico di Milano**.
