# Visuals

A multi-experiment visual playground.

Current experiment:
- `face-scan` (radial scan with interactive dash controls)

## Structure

```text
src/
  app.js                         # experiment registry + loader
  style.css                      # shared/base styles
  experiments/
    face-scan/
      index.js                   # experiment mount logic
      style.css                  # experiment-specific styles
```

## Run

```bash
npm run dev
```

Open:
- default: http://127.0.0.1:4210/index.html
- explicit experiment: http://127.0.0.1:4210/index.html?state=face-scan

Notes:
- `?state=` is the canonical direct-link param.
- `?experiment=` and `?exp=` still work for backward compatibility.
- Loose variants like `?state=facescan` also resolve to `face-scan`.
