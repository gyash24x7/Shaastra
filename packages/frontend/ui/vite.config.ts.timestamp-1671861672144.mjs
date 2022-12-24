// vite.config.ts
import autoprefixer from "file:///Users/gyuapstha/Documents/shaastra/node_modules/.pnpm/autoprefixer@10.4.13_postcss@8.4.19/node_modules/autoprefixer/lib/autoprefixer.js";
import tailwindcss from "file:///Users/gyuapstha/Documents/shaastra/node_modules/.pnpm/tailwindcss@3.2.4_postcss@8.4.19/node_modules/tailwindcss/lib/index.js";
import { defineConfig } from "file:///Users/gyuapstha/Documents/shaastra/node_modules/.pnpm/vite@4.0.1/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/gyuapstha/Documents/shaastra/node_modules/.pnpm/vite-plugin-dts@1.7.1_rollup@3.7.4+vite@4.0.1/node_modules/vite-plugin-dts/dist/index.mjs";
import solid from "file:///Users/gyuapstha/Documents/shaastra/node_modules/.pnpm/vite-plugin-solid@2.5.0_solid-js@1.6.5+vite@4.0.1/node_modules/vite-plugin-solid/dist/esm/index.mjs";

// package.json
var package_default = {
  name: "@shaastra/ui",
  private: true,
  version: "0.0.0",
  type: "module",
  main: "dist/ui.js",
  types: "dist/index.d.ts",
  scripts: {
    build: "vite build",
    storybook: "storybook dev -p 4400",
    "build-storybook": "storybook build"
  },
  peerDependencies: {
    "@fontsource/fjalla-one": "4.5.9",
    "@fontsource/montserrat": "4.5.13",
    "solid-headless": "0.13.0",
    "solid-heroicons": "3.1.1",
    "solid-js": "1.6.5"
  },
  devDependencies: {
    "@shaastra/tsconfig": "workspace:*",
    "@storybook/addon-essentials": "7.0.0-beta.8",
    "@storybook/addon-interactions": "7.0.0-beta.8",
    "@storybook/addon-links": "7.0.0-beta.8",
    "@storybook/addons": "7.0.0-beta.8",
    "@storybook/blocks": "7.0.0-beta.8",
    "@storybook/html": "7.0.0-beta.8",
    "@storybook/html-vite": "7.0.0-beta.8",
    "@storybook/testing-library": "0.0.13",
    "@storybook/theming": "7.0.0-beta.8",
    autoprefixer: "10.4.13",
    postcss: "8.4.19",
    react: "18.2.0",
    "react-dom": "18.2.0",
    storybook: "7.0.0-beta.8",
    tailwindcss: "3.2.4",
    typescript: "4.9.4",
    vite: "4.0.1",
    "vite-plugin-dts": "1.7.1",
    "vite-plugin-solid": "2.5.0"
  }
};

// tailwind.config.ts
import { join } from "path";
var __vite_injected_original_dirname = "/Users/gyuapstha/Documents/shaastra/packages/frontend/ui";
var config = {
  content: [
    join(__vite_injected_original_dirname, "src/**/*!(*.stories|*.spec).{ts,tsx,html}"),
    join(__vite_injected_original_dirname, "../../../libs/ui/**/*!(*.stories|*.spec).{ts,tsx,html}")
  ],
  theme: {
    fontWeight: {
      light: "300",
      normal: "500",
      semibold: "600",
      bold: "800"
    },
    fontSize: {
      base: ["14px", "20px"],
      xs: ["10px", "16px"],
      sm: ["12px", "18px"],
      lg: ["16px", "24px"],
      xl: ["20px", "28px"],
      "2xl": ["24px", "32px"],
      "3xl": ["28px", "40px"],
      "4xl": ["32px", "44px"],
      "5xl": ["36px", "48px"],
      "6xl": ["48px", "60px"],
      "7xl": ["60px", "72px"],
      "8xl": ["72px", "90px"]
    },
    fontFamily: {
      sans: ["Montserrat", "ui-sans-serif"],
      fjalla: "Fjalla One"
    },
    extend: {
      keyframes: {
        dash: {
          "0%": {
            "stroke-dasharray": "1, 150",
            "stroke-dashoffset": "0"
          },
          "50%": {
            "stroke-dasharray": "90, 150",
            "stroke-dashoffset": "-34"
          },
          "100%": {
            "stroke-dasharray": "90, 150",
            "stroke-dashoffset": "-124"
          }
        }
      },
      animation: {
        dash: "dash 1s ease-in-out infinite"
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        dark: {
          100: "#111111",
          200: "#222222",
          300: "#333333",
          400: "#444444",
          500: "#555555",
          600: "#666666",
          700: "#777777",
          DEFAULT: "#222222"
        },
        light: {
          100: "#FFFFFF",
          200: "#FAFBFC",
          300: "#F4F5F7",
          400: "#EBECF0",
          500: "#DFE1E6",
          600: "#C1C7D0",
          700: "#B3BAC5",
          DEFAULT: "#F4F5F7"
        },
        alt: {
          100: "#EAE6FF",
          200: "#C0B6F2",
          300: "#998DD9",
          400: "#8777D9",
          500: "#6554C0",
          600: "#5243AA",
          700: "#403294",
          DEFAULT: "#5243AA"
        },
        info: {
          100: "#E6FCFF",
          200: "#B3F5FF",
          300: "#79E2F2",
          400: "#00C7E6",
          500: "#00B8D9",
          600: "#00A3BF",
          700: "#008DA6",
          DEFAULT: "#00A3BF"
        },
        warning: {
          100: "#FFFAE6",
          200: "#FFF0B3",
          300: "#FFE380",
          400: "#FFC400",
          500: "#FFAB00",
          600: "#FF991F",
          700: "#FF8B00",
          DEFAULT: "#FF991F"
        },
        danger: {
          100: "#FFEBE6",
          200: "#FFBDAD",
          300: "#FF8F73",
          400: "#FF7452",
          500: "#FF5630",
          600: "#DE350B",
          700: "#BF2600",
          DEFAULT: "#DE350B"
        },
        success: {
          100: "#E3FCEF",
          200: "#ABF5D1",
          300: "#79F2C0",
          400: "#57D9A3",
          500: "#36B37E",
          600: "#00875A",
          700: "#006644",
          DEFAULT: "#00875A"
        },
        primary: {
          100: "#DEEBFF",
          200: "#B3D4FF",
          300: "#4C9AFF",
          400: "#2684FF",
          500: "#0065FF",
          600: "#0052CC",
          700: "#0747A6",
          DEFAULT: "#0052CC"
        }
      }
    }
  },
  plugins: []
};
var tailwind_config_default = config;

// vite.config.ts
var external = Object.keys(package_default.peerDependencies);
var vite_config_default = defineConfig({
  plugins: [solid(), dts()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(tailwind_config_default),
        autoprefixer()
      ]
    }
  },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"]
    },
    rollupOptions: { external }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidGFpbHdpbmQuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2d5dWFwc3RoYS9Eb2N1bWVudHMvc2hhYXN0cmEvcGFja2FnZXMvZnJvbnRlbmQvdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9neXVhcHN0aGEvRG9jdW1lbnRzL3NoYWFzdHJhL3BhY2thZ2VzL2Zyb250ZW5kL3VpL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9neXVhcHN0aGEvRG9jdW1lbnRzL3NoYWFzdHJhL3BhY2thZ2VzL2Zyb250ZW5kL3VpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tIFwiYXV0b3ByZWZpeGVyXCI7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcInRhaWx3aW5kY3NzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XG5pbXBvcnQgc29saWQgZnJvbSBcInZpdGUtcGx1Z2luLXNvbGlkXCI7XG5pbXBvcnQgcGFja2FnZUpzb24gZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XG5pbXBvcnQgdGFpbHdpbmRDb25maWcgZnJvbSBcIi4vdGFpbHdpbmQuY29uZmlnLmpzXCI7XG5cbmNvbnN0IGV4dGVybmFsID0gT2JqZWN0LmtleXMoIHBhY2thZ2VKc29uLnBlZXJEZXBlbmRlbmNpZXMgKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCB7XG5cdHBsdWdpbnM6IFsgc29saWQoKSwgZHRzKCkgXSxcblx0Y3NzOiB7XG5cdFx0cG9zdGNzczoge1xuXHRcdFx0cGx1Z2luczogW1xuXHRcdFx0XHR0YWlsd2luZGNzcyggdGFpbHdpbmRDb25maWcgKSxcblx0XHRcdFx0YXV0b3ByZWZpeGVyKClcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdGJ1aWxkOiB7XG5cdFx0bGliOiB7XG5cdFx0XHRlbnRyeTogXCJzcmMvaW5kZXgudHNcIixcblx0XHRcdGZvcm1hdHM6IFsgXCJlc1wiIF1cblx0XHR9LFxuXHRcdHJvbGx1cE9wdGlvbnM6IHsgZXh0ZXJuYWwgfVxuXHR9XG59ICk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9neXVhcHN0aGEvRG9jdW1lbnRzL3NoYWFzdHJhL3BhY2thZ2VzL2Zyb250ZW5kL3VpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZ3l1YXBzdGhhL0RvY3VtZW50cy9zaGFhc3RyYS9wYWNrYWdlcy9mcm9udGVuZC91aS90YWlsd2luZC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2d5dWFwc3RoYS9Eb2N1bWVudHMvc2hhYXN0cmEvcGFja2FnZXMvZnJvbnRlbmQvdWkvdGFpbHdpbmQuY29uZmlnLnRzXCI7aW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdHlwZSB7IENvbmZpZyB9IGZyb20gXCJ0YWlsd2luZGNzc1wiO1xuXG5jb25zdCBjb25maWc6IENvbmZpZyA9IHtcblx0Y29udGVudDogW1xuXHRcdGpvaW4oIF9fZGlybmFtZSwgXCJzcmMvKiovKiEoKi5zdG9yaWVzfCouc3BlYykue3RzLHRzeCxodG1sfVwiICksXG5cdFx0am9pbiggX19kaXJuYW1lLCBcIi4uLy4uLy4uL2xpYnMvdWkvKiovKiEoKi5zdG9yaWVzfCouc3BlYykue3RzLHRzeCxodG1sfVwiIClcblx0XSxcblx0dGhlbWU6IHtcblx0XHRmb250V2VpZ2h0OiB7XG5cdFx0XHRsaWdodDogXCIzMDBcIixcblx0XHRcdG5vcm1hbDogXCI1MDBcIixcblx0XHRcdHNlbWlib2xkOiBcIjYwMFwiLFxuXHRcdFx0Ym9sZDogXCI4MDBcIlxuXHRcdH0sXG5cdFx0Zm9udFNpemU6IHtcblx0XHRcdGJhc2U6IFsgXCIxNHB4XCIsIFwiMjBweFwiIF0sXG5cdFx0XHR4czogWyBcIjEwcHhcIiwgXCIxNnB4XCIgXSxcblx0XHRcdHNtOiBbIFwiMTJweFwiLCBcIjE4cHhcIiBdLFxuXHRcdFx0bGc6IFsgXCIxNnB4XCIsIFwiMjRweFwiIF0sXG5cdFx0XHR4bDogWyBcIjIwcHhcIiwgXCIyOHB4XCIgXSxcblx0XHRcdFwiMnhsXCI6IFsgXCIyNHB4XCIsIFwiMzJweFwiIF0sXG5cdFx0XHRcIjN4bFwiOiBbIFwiMjhweFwiLCBcIjQwcHhcIiBdLFxuXHRcdFx0XCI0eGxcIjogWyBcIjMycHhcIiwgXCI0NHB4XCIgXSxcblx0XHRcdFwiNXhsXCI6IFsgXCIzNnB4XCIsIFwiNDhweFwiIF0sXG5cdFx0XHRcIjZ4bFwiOiBbIFwiNDhweFwiLCBcIjYwcHhcIiBdLFxuXHRcdFx0XCI3eGxcIjogWyBcIjYwcHhcIiwgXCI3MnB4XCIgXSxcblx0XHRcdFwiOHhsXCI6IFsgXCI3MnB4XCIsIFwiOTBweFwiIF1cblx0XHR9LFxuXHRcdGZvbnRGYW1pbHk6IHtcblx0XHRcdHNhbnM6IFsgXCJNb250c2VycmF0XCIsIFwidWktc2Fucy1zZXJpZlwiIF0sXG5cdFx0XHRmamFsbGE6IFwiRmphbGxhIE9uZVwiXG5cdFx0fSxcblx0XHRleHRlbmQ6IHtcblx0XHRcdGtleWZyYW1lczoge1xuXHRcdFx0XHRkYXNoOiB7XG5cdFx0XHRcdFx0XCIwJVwiOiB7XG5cdFx0XHRcdFx0XHRcInN0cm9rZS1kYXNoYXJyYXlcIjogXCIxLCAxNTBcIixcblx0XHRcdFx0XHRcdFwic3Ryb2tlLWRhc2hvZmZzZXRcIjogXCIwXCJcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFwiNTAlXCI6IHtcblx0XHRcdFx0XHRcdFwic3Ryb2tlLWRhc2hhcnJheVwiOiBcIjkwLCAxNTBcIixcblx0XHRcdFx0XHRcdFwic3Ryb2tlLWRhc2hvZmZzZXRcIjogXCItMzRcIlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCIxMDAlXCI6IHtcblx0XHRcdFx0XHRcdFwic3Ryb2tlLWRhc2hhcnJheVwiOiBcIjkwLCAxNTBcIixcblx0XHRcdFx0XHRcdFwic3Ryb2tlLWRhc2hvZmZzZXRcIjogXCItMTI0XCJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhbmltYXRpb246IHtcblx0XHRcdFx0ZGFzaDogXCJkYXNoIDFzIGVhc2UtaW4tb3V0IGluZmluaXRlXCJcblx0XHRcdH0sXG5cdFx0XHRjb2xvcnM6IHtcblx0XHRcdFx0dHJhbnNwYXJlbnQ6IFwidHJhbnNwYXJlbnRcIixcblx0XHRcdFx0Y3VycmVudDogXCJjdXJyZW50Q29sb3JcIixcblx0XHRcdFx0ZGFyazoge1xuXHRcdFx0XHRcdDEwMDogXCIjMTExMTExXCIsXG5cdFx0XHRcdFx0MjAwOiBcIiMyMjIyMjJcIixcblx0XHRcdFx0XHQzMDA6IFwiIzMzMzMzM1wiLFxuXHRcdFx0XHRcdDQwMDogXCIjNDQ0NDQ0XCIsXG5cdFx0XHRcdFx0NTAwOiBcIiM1NTU1NTVcIixcblx0XHRcdFx0XHQ2MDA6IFwiIzY2NjY2NlwiLFxuXHRcdFx0XHRcdDcwMDogXCIjNzc3Nzc3XCIsXG5cdFx0XHRcdFx0REVGQVVMVDogXCIjMjIyMjIyXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0bGlnaHQ6IHtcblx0XHRcdFx0XHQxMDA6IFwiI0ZGRkZGRlwiLFxuXHRcdFx0XHRcdDIwMDogXCIjRkFGQkZDXCIsXG5cdFx0XHRcdFx0MzAwOiBcIiNGNEY1RjdcIixcblx0XHRcdFx0XHQ0MDA6IFwiI0VCRUNGMFwiLFxuXHRcdFx0XHRcdDUwMDogXCIjREZFMUU2XCIsXG5cdFx0XHRcdFx0NjAwOiBcIiNDMUM3RDBcIixcblx0XHRcdFx0XHQ3MDA6IFwiI0IzQkFDNVwiLFxuXHRcdFx0XHRcdERFRkFVTFQ6IFwiI0Y0RjVGN1wiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFsdDoge1xuXHRcdFx0XHRcdDEwMDogXCIjRUFFNkZGXCIsXG5cdFx0XHRcdFx0MjAwOiBcIiNDMEI2RjJcIixcblx0XHRcdFx0XHQzMDA6IFwiIzk5OEREOVwiLFxuXHRcdFx0XHRcdDQwMDogXCIjODc3N0Q5XCIsXG5cdFx0XHRcdFx0NTAwOiBcIiM2NTU0QzBcIixcblx0XHRcdFx0XHQ2MDA6IFwiIzUyNDNBQVwiLFxuXHRcdFx0XHRcdDcwMDogXCIjNDAzMjk0XCIsXG5cdFx0XHRcdFx0REVGQVVMVDogXCIjNTI0M0FBXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0aW5mbzoge1xuXHRcdFx0XHRcdDEwMDogXCIjRTZGQ0ZGXCIsXG5cdFx0XHRcdFx0MjAwOiBcIiNCM0Y1RkZcIixcblx0XHRcdFx0XHQzMDA6IFwiIzc5RTJGMlwiLFxuXHRcdFx0XHRcdDQwMDogXCIjMDBDN0U2XCIsXG5cdFx0XHRcdFx0NTAwOiBcIiMwMEI4RDlcIixcblx0XHRcdFx0XHQ2MDA6IFwiIzAwQTNCRlwiLFxuXHRcdFx0XHRcdDcwMDogXCIjMDA4REE2XCIsXG5cdFx0XHRcdFx0REVGQVVMVDogXCIjMDBBM0JGXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0d2FybmluZzoge1xuXHRcdFx0XHRcdDEwMDogXCIjRkZGQUU2XCIsXG5cdFx0XHRcdFx0MjAwOiBcIiNGRkYwQjNcIixcblx0XHRcdFx0XHQzMDA6IFwiI0ZGRTM4MFwiLFxuXHRcdFx0XHRcdDQwMDogXCIjRkZDNDAwXCIsXG5cdFx0XHRcdFx0NTAwOiBcIiNGRkFCMDBcIixcblx0XHRcdFx0XHQ2MDA6IFwiI0ZGOTkxRlwiLFxuXHRcdFx0XHRcdDcwMDogXCIjRkY4QjAwXCIsXG5cdFx0XHRcdFx0REVGQVVMVDogXCIjRkY5OTFGXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGFuZ2VyOiB7XG5cdFx0XHRcdFx0MTAwOiBcIiNGRkVCRTZcIixcblx0XHRcdFx0XHQyMDA6IFwiI0ZGQkRBRFwiLFxuXHRcdFx0XHRcdDMwMDogXCIjRkY4RjczXCIsXG5cdFx0XHRcdFx0NDAwOiBcIiNGRjc0NTJcIixcblx0XHRcdFx0XHQ1MDA6IFwiI0ZGNTYzMFwiLFxuXHRcdFx0XHRcdDYwMDogXCIjREUzNTBCXCIsXG5cdFx0XHRcdFx0NzAwOiBcIiNCRjI2MDBcIixcblx0XHRcdFx0XHRERUZBVUxUOiBcIiNERTM1MEJcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiB7XG5cdFx0XHRcdFx0MTAwOiBcIiNFM0ZDRUZcIixcblx0XHRcdFx0XHQyMDA6IFwiI0FCRjVEMVwiLFxuXHRcdFx0XHRcdDMwMDogXCIjNzlGMkMwXCIsXG5cdFx0XHRcdFx0NDAwOiBcIiM1N0Q5QTNcIixcblx0XHRcdFx0XHQ1MDA6IFwiIzM2QjM3RVwiLFxuXHRcdFx0XHRcdDYwMDogXCIjMDA4NzVBXCIsXG5cdFx0XHRcdFx0NzAwOiBcIiMwMDY2NDRcIixcblx0XHRcdFx0XHRERUZBVUxUOiBcIiMwMDg3NUFcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRwcmltYXJ5OiB7XG5cdFx0XHRcdFx0MTAwOiBcIiNERUVCRkZcIixcblx0XHRcdFx0XHQyMDA6IFwiI0IzRDRGRlwiLFxuXHRcdFx0XHRcdDMwMDogXCIjNEM5QUZGXCIsXG5cdFx0XHRcdFx0NDAwOiBcIiMyNjg0RkZcIixcblx0XHRcdFx0XHQ1MDA6IFwiIzAwNjVGRlwiLFxuXHRcdFx0XHRcdDYwMDogXCIjMDA1MkNDXCIsXG5cdFx0XHRcdFx0NzAwOiBcIiMwNzQ3QTZcIixcblx0XHRcdFx0XHRERUZBVUxUOiBcIiMwMDUyQ0NcIlxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRwbHVnaW5zOiBbXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwVixPQUFPLGtCQUFrQjtBQUNuWCxPQUFPLGlCQUFpQjtBQUN4QixTQUFTLG9CQUFv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
