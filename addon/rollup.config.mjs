import copy from 'rollup-plugin-copy';
import { Addon } from '@embroider/addon-dev/rollup';
import { babel } from '@rollup/plugin-babel';
import { execaCommand } from "execa";
import { fixBadDeclarationOutput } from "fix-bad-declaration-output";

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default {
  // This provides defaults that work well alongside `publicEntrypoints` below.
  // You can augment this if you need to.
  output: addon.output(),

  external: [],

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    addon.publicEntrypoints([
      'components/**/*.{js,ts}',
      'modifiers/*.{js,ts}',
      'helpers/*.{js,ts}',
      'services/*.{js,ts}',
      'utils/**/*.{js,ts}',
      'validators/**/*.{js,ts}',
      'template-registry.js'
    ]),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    addon.appReexports([
      'components/**/*.{js,ts}',
      'modifiers/*.{js,ts}',
      'helpers/*.{js,ts}',
      'services/*.{js,ts}',
    ]),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),

    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.gjs', '.ts', '.gts', '.hbs'],
    }),

    // Ensure that standalone .hbs files are properly integrated as Javascript.
    addon.hbs(),

    // Ensure that .gjs files are properly integrated as Javascript
    addon.gjs(),

    // addons are allowed to contain imports of .css files, which we want rollup
    // to leave alone and keep in the published output.
    addon.keepAssets(['**/**/*.scss']),

    // Remove leftover build artifacts when starting a new build.
    addon.clean(),

    // Copy Readme and License into published package
    copy({
      targets: [
        { src: '../README.md', dest: '.' },
        { src: '../LICENSE.md', dest: '.' },
      ],
    }),

    {
      name: "Build Declarations",
      closeBundle: async () => {
        /**
         * Generate the types (these include /// <reference types="ember-source/types"
         * but our consumers may not be using those, or have a new enough ember-source that provides them.
         */
        console.log("Building types");
        await execaCommand(`npx glint --declaration`, { stdio: "inherit" });
        /**
         * https://github.com/microsoft/TypeScript/issues/56571#
         * README: https://github.com/NullVoxPopuli/fix-bad-declaration-output
         */
        await fixBadDeclarationOutput("declarations/**/*.d.ts", [
          ["TypeScript#56571", { types: "all" }],
          "Glint#628",
          "Glint#697",
        ]);
        console.log("⚠️ Dangerously (but neededly) fixed bad declaration output from typescript");
      },
    },
  ],
};
