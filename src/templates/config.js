const config = {
  cdns: [
    {
      id: 1,
      name: "bootstrap",
      css: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css",
      js: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js",
    },
    {
      id: 2,
      name: "fontawesome",
      css: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css",
      js: null,
    },

    {
      id: 3,
      name: "jquery",
      css: null,
      js: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js",
    },

    {
      id: 4,
      name: "badcss",
      css: null,
      js: "https://unpkg.com/@badcss/core@1.0.0-beta.1/dist/badcss-1.0.0-beta.1-bundle",
    },

    {
      id: 5,
      name: "pico-css",
      css: "https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css",
      js: null,
    },
  ],
};

export default config;
