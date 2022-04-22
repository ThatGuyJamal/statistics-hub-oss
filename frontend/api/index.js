var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// server.js
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toESM(require("react"));

// server.js
var import_vercel = require("@remix-run/vercel");

// server-entry-module:@remix-run/dev/server-build
var server_build_exports = {};
__export(server_build_exports, {
  assets: () => assets_manifest_default,
  entry: () => entry,
  routes: () => routes
});

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react");
var import_server = require("react-dom/server");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_react.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route:C:\Users\ThatGuyJamal\Desktop\code\bots\statshub-oss\main-repo\frontend\app\root.tsx
var root_exports = {};
__export(root_exports, {
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  meta: () => meta
});

// app/config.server.ts
var environment = {
  production: process.env.production,
  mongodbUrl: process.env.mongodbUrl,
  website_root_title: process.env.website_root_title,
  website_root_description: process.env.website_root_description,
  session_secret: process.env.session_secret,
  development_mode: process.env.development_mode
};

// route:C:\Users\ThatGuyJamal\Desktop\code\bots\statshub-oss\main-repo\frontend\app\root.tsx
var import_react2 = require("@remix-run/react");

// app/styles/global.css
var global_default = "/build/_assets/global-ZJ7EHNQK.css";

// route:C:\Users\ThatGuyJamal\Desktop\code\bots\statshub-oss\main-repo\frontend\app\root.tsx
var meta = () => ({
  charset: "utf-8",
  title: environment.website_root_title,
  description: environment.website_root_description,
  viewport: "width=device-width,initial-scale=1"
});
var links = () => {
  return [{ rel: "stylesheet", href: global_default }];
};
function App() {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement(import_react2.Meta, null), /* @__PURE__ */ React.createElement(import_react2.Links, null)), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(import_react2.Outlet, null), /* @__PURE__ */ React.createElement(import_react2.ScrollRestoration, null), /* @__PURE__ */ React.createElement(import_react2.Scripts, null), /* @__PURE__ */ React.createElement(import_react2.LiveReload, null)));
}
function ErrorBoundary({ error }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "App Error: ", error.name), /* @__PURE__ */ React.createElement("pre", null, "Error - ", error.message), /* @__PURE__ */ React.createElement("pre", null, renderFullError() ? "Please contact the developers about this error, thanks." : error.stack));
}
var renderFullError = () => {
  if (environment.development_mode)
    return false;
  else
    return true;
};

// route:C:\Users\ThatGuyJamal\Desktop\code\bots\statshub-oss\main-repo\frontend\app\routes\user\$id\guild\$id\index.tsx
var id_exports = {};
__export(id_exports, {
  default: () => Guild,
  loader: () => loader
});
var import_react3 = require("@remix-run/react");

// app/database/mock.server.ts
var MockGuildData = [
  {
    id: "1",
    name: "Server 1",
    description: "The first server"
  },
  {
    id: "2",
    name: "Server 2",
    description: "The second server"
  }
];

// route:C:\Users\ThatGuyJamal\Desktop\code\bots\statshub-oss\main-repo\frontend\app\routes\user\$id\guild\$id\index.tsx
var loader = async ({ params }) => {
  const id = params.id;
  console.log(`Loading guild ${id}`);
  const data = MockGuildData.find((guild) => guild.id === id);
  if (!data) {
    return null;
  }
  return {
    id,
    name: (data == null ? void 0 : data.name) ?? "No Guild Name Found",
    description: (data == null ? void 0 : data.description) ?? "No Guild Description Found"
  };
};
function Guild() {
  const props = (0, import_react3.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "Guild Page"), /* @__PURE__ */ React.createElement("h3", null, "Guild Information"), /* @__PURE__ */ React.createElement("p", null, "Guild Id: ", props.id, /* @__PURE__ */ React.createElement("br", null), "Guild Name: ", props.name, /* @__PURE__ */ React.createElement("br", null), "Guild Description: ", props.description), /* @__PURE__ */ React.createElement(import_react3.Link, {
    to: "/user/0"
  }, "back"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(import_react3.Link, {
    to: "/"
  }, "Home"));
}

// route:C:\Users\ThatGuyJamal\Desktop\code\bots\statshub-oss\main-repo\frontend\app\routes\user\$id\index.tsx
var id_exports2 = {};
__export(id_exports2, {
  default: () => User,
  loader: () => loader2
});
var import_react4 = require("@remix-run/react");
var loader2 = async ({ params }) => {
  const id = params.id;
  console.log(`Loading user ${id}`);
  return {
    id
  };
};
function User() {
  const props = (0, import_react4.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "Mock User Page"), /* @__PURE__ */ React.createElement("h2", null, "User Id: ", props.id), "Available Guilds (click to navigate):", /* @__PURE__ */ React.createElement("ul", null, MockGuildData.map((guild) => /* @__PURE__ */ React.createElement("li", {
    key: guild.id
  }, /* @__PURE__ */ React.createElement(import_react4.Link, {
    to: `/user/${props.id}/guild/${guild.id}`
  }, "Go to ", guild.name)))), /* @__PURE__ */ React.createElement(import_react4.Link, {
    to: "/"
  }, "Home"));
}

// route:C:\Users\ThatGuyJamal\Desktop\code\bots\statshub-oss\main-repo\frontend\app\routes\index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index,
  loader: () => loader3
});
var import_node = require("@remix-run/node");
var import_react5 = require("@remix-run/react");
var loader3 = async () => {
  return (0, import_node.json)(IndexPropsValue);
};
function Index() {
  const data = (0, import_react5.useLoaderData)();
  const date = new Date();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, environment.website_root_title, " Landing Page"), /* @__PURE__ */ React.createElement("p", null, "This is the test landing page for the bot, it is not intended to be used in production. Feel free to roam around the site and view the mock data."), /* @__PURE__ */ React.createElement("p", null, "This site was created to help me play around with", " ", /* @__PURE__ */ React.createElement("a", {
    target: "_blank",
    href: "https://github.com/remix-run/remix"
  }, "react remix"), " ", "and see if I want to use it in the further development of the bot."), /* @__PURE__ */ React.createElement("hr", null), data.map((i) => /* @__PURE__ */ React.createElement("div", {
    key: i.id
  }, /* @__PURE__ */ React.createElement("h2", null, i.name), /* @__PURE__ */ React.createElement("p", null, i.description), /* @__PURE__ */ React.createElement("a", {
    href: i.url,
    target: "_blank"
  }, "Link"))), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("h2", null, "Routing test:"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(import_react5.Link, {
    to: `/user/1`
  }, "mock user page"))), /* @__PURE__ */ React.createElement("footer", null, /* @__PURE__ */ React.createElement("p", null, "This page was rendered at ", date.toLocaleDateString())));
}
var IndexPropsValue = [
  {
    id: "1",
    name: "Github",
    description: "The site source code",
    url: "https://github.com/ThatGuyJamal/statistics-hub-oss/tree/master/frontend"
  },
  {
    id: "2",
    name: "Discord Server",
    description: "The bot support server",
    url: "https://discord.com/invite/N79DZsm3m2"
  }
];

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { "version": "96c25a13", "entry": { "module": "/build/entry.client-4E7JHNL3.js", "imports": ["/build/_shared/chunk-L2F7L37W.js"] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "module": "/build/root-CJBL3RKW.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": true }, "routes/index": { "id": "routes/index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "module": "/build/routes/index-2C3DZUXK.js", "imports": void 0, "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/user/$id/guild/$id/index": { "id": "routes/user/$id/guild/$id/index", "parentId": "root", "path": "user/:id/guild/:id", "index": true, "caseSensitive": void 0, "module": "/build/routes/user/$id/guild/$id/index-AM2BMXYZ.js", "imports": ["/build/_shared/chunk-GF2NJT6N.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/user/$id/index": { "id": "routes/user/$id/index", "parentId": "root", "path": "user/:id", "index": true, "caseSensitive": void 0, "module": "/build/routes/user/$id/index-A4MQMBHP.js", "imports": ["/build/_shared/chunk-GF2NJT6N.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false } }, "url": "/build/manifest-96C25A13.js" };

// server-entry-module:@remix-run/dev/server-build
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/user/$id/guild/$id/index": {
    id: "routes/user/$id/guild/$id/index",
    parentId: "root",
    path: "user/:id/guild/:id",
    index: true,
    caseSensitive: void 0,
    module: id_exports
  },
  "routes/user/$id/index": {
    id: "routes/user/$id/index",
    parentId: "root",
    path: "user/:id",
    index: true,
    caseSensitive: void 0,
    module: id_exports2
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  }
};

// server.js
var server_default = (0, import_vercel.createRequestHandler)({ build: server_build_exports, mode: "production" });
module.exports = __toCommonJS(server_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
