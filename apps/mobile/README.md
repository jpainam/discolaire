npx pod-install ios because as explained in the docs, "If you're on a Mac and developing for iOS, you need to install the pods (via Cocoapods) to complete the linking."

# Issues

## Developoment

- [Reanimated] Mismatch between JavaScript part and native part of Reanimated (3.0.2 vs. 2.14.4).

```bash
pn ios # Rebuild and reinstall cocoapods
```

Or

```bash
pn clean # delete node_modules folder
pn add react-native-reanimated@3.0.2
pn i
npx expo start --reset-cache
```
