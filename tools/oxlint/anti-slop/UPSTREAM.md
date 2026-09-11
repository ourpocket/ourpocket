# Upstream provenance

- Source: bundled `install-anti-slop` agent skill snapshot
- Source revision: unknown; the bundled installer does not expose an immutable upstream commit
- Installed generic plugin: `tools/oxlint/anti-slop/index.ts`
- Vendored readability source: `tools/oxlint/anti-slop/vendor/eslint-stylistic/`
- Installed on: 2026-09-11
- Local deviations: none in vendored rule source
- Configuration: all generic rules enabled at `error` in `oxlint.config.ts`; Effect rules omitted because `effect` is not a direct dependency
- Dependencies: `oxlint@1.82.0` and `@oxlint/plugins@1.82.0`
- Verification: plugin loaded successfully; focused landing-page run passed with zero warnings and zero errors. Full application run reports pre-existing findings outside the redesign scope.
