# Local Demo Usage

BayouOps includes a lightweight static demo showcase under `demo/site/`.

The local demo launcher is intended for Fedora/Linux operator workstations and uses Python's built-in static file server. It does not require Docker, a backend service, or a JavaScript framework.

## Start The Demo

From the repository root:

```bash
./scripts/run-demo.sh
```

Default URL:

```text
http://127.0.0.1:8088/demo/site/
```

The launcher validates that `demo/site/index.html` exists before starting the server.

## Configure The Port

Use `BAYOUOPS_DEMO_PORT`:

```bash
BAYOUOPS_DEMO_PORT=8090 ./scripts/run-demo.sh
```

Then open:

```text
http://127.0.0.1:8090/demo/site/
```

## Bind Address

The launcher defaults to:

```text
127.0.0.1
```

This avoids exposing demo files to the LAN by default.

To intentionally bind to another address:

```bash
BAYOUOPS_DEMO_HOST=127.0.0.1 BAYOUOPS_DEMO_PORT=8088 ./scripts/run-demo.sh
```

Use broader bind addresses only when there is a deliberate reason and the surrounding network controls are understood.

## Demo URLs

When running locally, useful paths are:

```text
http://127.0.0.1:8088/demo/site/
http://127.0.0.1:8088/demo/data/
http://127.0.0.1:8088/demo/exports/
http://127.0.0.1:8088/demo/scenarios/
```

## What The Demo Uses

The static page loads existing demo assets:

- `demo/scenarios/*.json`
- `demo/data/DEMO_readiness-scoring.csv`
- `demo/data/DEMO_patch-compliance.csv`
- `demo/data/DEMO_ssl-status.csv`
- `demo/data/DEMO_unsupported-os.csv`
- `demo/data/DEMO_stale-systems.csv`

All records are synthetic and marked as DEMO.

## Stop The Demo

Find the listener:

```bash
ss -tulnp | grep 8088
```

Then stop the matching process with the normal local operator workflow.

## Safety Notes

- The demo server is static file serving only.
- It does not contact production systems.
- It does not patch, reboot, scan, or remediate anything.
- It serves the repository root so `demo/site/` can load neighboring demo datasets with relative paths.
- Keep the default `127.0.0.1` bind unless there is a specific operational reason to expose the demo elsewhere.
