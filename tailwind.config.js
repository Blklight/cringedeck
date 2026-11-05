/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-bullets": "var(--color-dark)",
            "--tw-prose-links": "var(--color-bluesky-600)",
            maxWidth: "100%",
            color: "var(--color-dark)",
            lineHeight: "1.5",
            pre: {
              whiteSpace: "pre-wrap",
              marginTop: "0.5rem",
              marginBottom: "1.25rem",
              fontSize: "15px",
            },
            code: {
              color: "var(--color-bluesky-600)",
            },
          },
        },
        dark: {
          css: {
            "--tw-prose-invert-bullets": "var(--color-light)",
            color: "var(--color-light)",
            code: {
              color: "var(--color-bluesky-600)",
            },
          },
        },
        invert: {
          css: {
            "--tw-prose-invert-bullets": "var(--color-light)",
            "--tw-prose-invert-links": "var(--color-bluesky-400)",
            color: "var(--color-light)",
            code: {
              color: "var(--color-bluesky-600)",
            },
          },
        },
      },
    },
  },
};
