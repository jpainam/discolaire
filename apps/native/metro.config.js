const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
const path = require("node:path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const uniwindConfig = withUniwindConfig(wrapWithReanimatedMetroConfig(config), {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
});

// Force a single React instance for all modules to prevent invalid hook calls.
const wrappedResolveRequest =
  uniwindConfig.resolver.resolveRequest ??
  ((context, moduleName, platform) =>
    context.resolveRequest(context, moduleName, platform));

uniwindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "react" ||
    moduleName.startsWith("react/") ||
    moduleName === "react-dom" ||
    moduleName.startsWith("react-dom/") ||
    moduleName === "scheduler" ||
    moduleName.startsWith("scheduler/")
  ) {
    return wrappedResolveRequest(
      context,
      path.resolve(__dirname, "node_modules", moduleName),
      platform,
    );
  }

  return wrappedResolveRequest(context, moduleName, platform);
};

module.exports = uniwindConfig;
