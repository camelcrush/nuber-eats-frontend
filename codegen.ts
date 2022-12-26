import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: ["src/**/*.{tsx,ts}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
