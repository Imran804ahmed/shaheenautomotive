import ts from "typescript";

/** Lower modern class syntax before Webpack hashes the static export bundles. */
export function legacyClientSyntax(webpack) {
  const name = "LegacyClientSyntax";
  return {
    apply(compiler) {
      compiler.hooks.thisCompilation.tap(name, (compilation) => {
        compilation.hooks.processAssets.tap(
          { name, stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE - 1 },
          () => {
            for (const { name: filename, source } of compilation.getAssets()) {
              if (!filename.startsWith("static/") || !filename.endsWith(".js")) continue;
              const input = source.source().toString();
              if (!/\bstatic\s*\{|#[a-z_$]/i.test(input)) continue;
              const { outputText } = ts.transpileModule(input, {
                fileName: filename,
                compilerOptions: { target: ts.ScriptTarget.ES2021, module: ts.ModuleKind.ESNext },
              });
              compilation.updateAsset(filename, new webpack.sources.RawSource(outputText));
            }
          },
        );
      });
    },
  };
}
