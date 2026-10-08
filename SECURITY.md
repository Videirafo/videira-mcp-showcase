# Security policy · Videira MCP Showcase

This repository is **marketing and interactive documentation only**, not the
private Videira MCP production server or any runnable device-control component.

## Threat model

- Pages serves static HTML, CSS, SVG and JavaScript with mock data only.
- No API tokens, credentials, OAuth callbacks, device pairing codes or visitor
  secrets are stored or requested.
- The demo has no executable integration with GitHub, the VPS, Nginx, CI,
  production MCP, analytics, or remote devices.
- No network calls are made by the demo code. Visitors can choose to follow
  external hyperlinks, including GitHub and the four source repositories.
- The demo's mock PASS output must never be used as evidence that real
  validation, authorization or deployment occurred.
- The operational project is maintained separately and is not licensed,
  redistributed or made public by this showcase's public visibility.

## Report a problem

Open a security advisory or contact the repository owner privately. Never post
live credentials, tokens, recovery codes, private data or exploit details in a
public issue.

## Maintenance

Keep dependencies at zero, validate third-party links, prohibit scripts from
public CDNs and review every change to `docs/` for unintended network access.
The absence of flagged credential strings in a scan is not a security guarantee.
