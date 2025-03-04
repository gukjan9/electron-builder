import { Arch } from "builder-util"
import { BeforeBuildContext, Target } from "./core"
import { ElectronBrandingOptions, ElectronDownloadOptions } from "./electron/ElectronFramework"
import { PrepareApplicationStageDirectoryOptions } from "./Framework"
import { AppXOptions } from "./options/AppXOptions"
import { AppImageOptions, DebOptions, FlatpakOptions, LinuxConfiguration, LinuxTargetSpecificOptions } from "./options/linuxOptions"
import { DmgOptions, MacConfiguration, MasConfiguration } from "./options/macOptions"
import { MsiOptions } from "./options/MsiOptions"
import { MsiWrappedOptions } from "./options/MsiWrappedOptions"
import { PkgOptions } from "./options/pkgOptions"
import { PlatformSpecificBuildOptions } from "./options/PlatformSpecificBuildOptions"
import { SnapOptions } from "./options/SnapOptions"
import { SquirrelWindowsOptions } from "./options/SquirrelWindowsOptions"
import { WindowsConfiguration } from "./options/winOptions"
import { BuildResult } from "./packager"
import { ArtifactBuildStarted, ArtifactCreated } from "./packagerApi"
import { PlatformPackager } from "./platformPackager"
import { NsisOptions, NsisWebOptions, PortableOptions } from "./targets/nsis/nsisOptions"

// duplicate appId here because it is important
/**
 * Configuration Options
 */
export interface CommonConfiguration {
  /**
   * The application id. Used as [CFBundleIdentifier](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/20001431-102070) for MacOS and as
   * [Application User Model ID](https://msdn.microsoft.com/en-us/library/windows/desktop/dd378459(v=vs.85).aspx) for Windows (NSIS target only, Squirrel.Windows not supported). It is strongly recommended that an explicit ID is set.
   * @default com.electron.${name}
   */
  readonly appId?: string | null

  /**
   * As [name](#metadata), but allows you to specify a product name for your executable which contains spaces and other special characters not allowed in the [name property](https://docs.npmjs.com/files/package.json#name).
   * If not specified inside of the `build` configuration, `productName` property defined at the top level of `package.json` is used. If not specified at the top level of `package.json`, [name property](https://docs.npmjs.com/files/package.json#name) is used.
   */
  readonly productName?: string | null

  /**
   * The human-readable copyright line for the app.
   * @default Copyright © year ${author}
   */
  readonly copyright?: string | null

  /**
   * Directories for build resources
   */
  readonly directories?: MetadataDirectories | null

  /**
   * Options related to how build macOS targets.
   */
  readonly mac?: MacConfiguration | null
  /**
   * MAS (Mac Application Store) options.
   */
  readonly mas?: MasConfiguration | null
  /**
   * MAS (Mac Application Store) development options (`mas-dev` target).
   */
  readonly masDev?: MasConfiguration | null
  /**
   * macOS DMG options.
   */
  readonly dmg?: DmgOptions | null
  /**
   * macOS PKG options.
   */
  readonly pkg?: PkgOptions | null

  /**
   * Options related to how build Windows targets.
   */
  readonly win?: WindowsConfiguration | null
  readonly nsis?: NsisOptions | null
  readonly nsisWeb?: NsisWebOptions | null
  readonly portable?: PortableOptions | null
  readonly appx?: AppXOptions | null
  /** @private */
  readonly msi?: MsiOptions | null
  /** @private */
  readonly msiWrapped?: MsiWrappedOptions | null
  readonly squirrelWindows?: SquirrelWindowsOptions | null

  /**
   * Options related to how build Linux targets.
   */
  readonly linux?: LinuxConfiguration | null
  /**
   * Debian package options.
   */
  readonly deb?: DebOptions | null
  /**
   * Snap options.
   */
  readonly snap?: SnapOptions | null
  /**
   * AppImage options.
   */
  readonly appImage?: AppImageOptions | null
  /**
   * Flatpak options.
   */
  readonly flatpak?: FlatpakOptions | null
  readonly pacman?: LinuxTargetSpecificOptions | null
  readonly rpm?: LinuxTargetSpecificOptions | null
  readonly freebsd?: LinuxTargetSpecificOptions | null
  readonly p5p?: LinuxTargetSpecificOptions | null
  readonly apk?: LinuxTargetSpecificOptions | null

  /**
   * Whether to build the application native dependencies from source.
   * @default false
   */
  buildDependenciesFromSource?: boolean
  /**
   * Whether to execute `node-gyp rebuild` before starting to package the app.
   *
   * Don't [use](https://github.com/electron-userland/electron-builder/issues/683#issuecomment-241214075) [npm](http://electron.atom.io/docs/tutorial/using-native-node-modules/#using-npm) (neither `.npmrc`) for configuring electron headers. Use `electron-builder node-gyp-rebuild` instead.
   * @default false
   */
  readonly nodeGypRebuild?: boolean
  /**
   * Additional command line arguments to use when installing app native deps.
   */
  readonly npmArgs?: Array<string> | string | null
  /**
   * Whether to [rebuild](https://docs.npmjs.com/cli/rebuild) native dependencies before starting to package the app.
   * @default true
   */
  readonly npmRebuild?: boolean
  /**
   * Use `legacy` app-builder binary for installing native dependencies, or `@electron/rebuild` in `sequential` or `parallel` compilation modes.
   * @default sequential
   */
  readonly nativeRebuilder?: "legacy" | "sequential" | "parallel" | null

  /**
   * The build number. Maps to the `--iteration` flag for builds using FPM on Linux.
   * If not defined, then it will fallback to `BUILD_NUMBER` or `TRAVIS_BUILD_NUMBER` or `APPVEYOR_BUILD_NUMBER` or `CIRCLE_BUILD_NUM` or `BUILD_BUILDNUMBER` or `CI_PIPELINE_IID` env.
   */
  readonly buildNumber?: string | null

  /**
   * The build version. Maps to the `CFBundleVersion` on macOS, and `FileVersion` metadata property on Windows. Defaults to the `version`.
   * If `buildVersion` is not defined and `buildNumber` (or one of the `buildNumber` envs) is defined, it will be used as a build version (`version.buildNumber`).
   */
  readonly buildVersion?: string | null

  /**
   * Whether to download the alternate FFmpeg library from Electron's release assets and replace the default FFmpeg library prior to signing
   */
  readonly downloadAlternateFFmpeg?: boolean

  /**
   * Inject properties to `package.json`.
   */
  readonly extraMetadata?: any

  /**
   * Whether to fail if the application is not signed (to prevent unsigned app if code signing configuration is not correct).
   * @default false
   */
  readonly forceCodeSigning?: boolean

  /**
   * Whether to include PDB files.
   * @default false
   */
  readonly includePdb?: boolean

  /**
   * Whether to remove `scripts` field from `package.json` files.
   *
   * @default true
   */
  readonly removePackageScripts?: boolean

  /**
   * Whether to remove `keywords` field from `package.json` files.
   *
   * @default true
   */
  readonly removePackageKeywords?: boolean
}
export interface Configuration extends CommonConfiguration, PlatformSpecificBuildOptions, Hooks {
  /**
   * Whether to include *all* of the submodules node_modules directories
   * @default false
   */
  includeSubNodeModules?: boolean

  /**
   * Whether to use [electron-compile](http://github.com/electron/electron-compile) to compile app. Defaults to `true` if `electron-compile` in the dependencies. And `false` if in the `devDependencies` or doesn't specified.
   */
  readonly electronCompile?: boolean

  /**
   * Returns the path to custom Electron build (e.g. `~/electron/out/R`). Zip files must follow the pattern `electron-v${version}-${platformName}-${arch}.zip`, otherwise it will be assumed to be an unpacked Electron app directory
   */
  readonly electronDist?: string | CustomElectronDistributable

  /**
   * The [electron-download](https://github.com/electron-userland/electron-download#usage) options.
   */
  readonly electronDownload?: ElectronDownloadOptions

  /**
   * The branding used by Electron's distributables. This is needed if a fork has modified Electron's BRANDING.json file.
   */
  readonly electronBranding?: ElectronBrandingOptions

  /**
   * The version of electron you are packaging for. Defaults to version of `electron`, `electron-prebuilt` or `electron-prebuilt-compile` dependency.
   */
  electronVersion?: string | null

  /**
   * The name of a built-in configuration preset (currently, only `react-cra` is supported) or any number of paths to config files (relative to project dir).
   *
   * The latter allows to mixin a config from multiple other configs, as if you `Object.assign` them, but properly combine `files` glob patterns.
   *
   * If `react-scripts` in the app dependencies, `react-cra` will be set automatically. Set to `null` to disable automatic detection.
   */
  extends?: Array<string> | string | null

  /**
   * *libui-based frameworks only* The version of NodeJS you are packaging for.
   * You can set it to `current` to set the Node.js version that you use to run.
   */
  readonly nodeVersion?: string | null

  /**
   * *libui-based frameworks only* The version of LaunchUI you are packaging for. Applicable for Windows only. Defaults to version suitable for used framework version.
   */
  readonly launchUiVersion?: boolean | string | null

  /**
   * The framework name. One of `electron`, `proton`, `libui`. Defaults to `electron`.
   */
  readonly framework?: string | null

  /**
   * Whether to disable sanity check asar package (useful for custom electron forks that implement their own encrypted integrity validation)
   * @default false
   */
  readonly disableSanityCheckAsar?: boolean
}

export type CustomElectronDistributable = (options: PrepareApplicationStageDirectoryOptions) => string

export type Hook<T, V> = (contextOrPath: T) => Promise<V> | V

export interface PackContext {
  readonly outDir: string
  readonly appOutDir: string
  readonly packager: PlatformPackager<any>
  readonly electronPlatformName: string
  readonly arch: Arch
  readonly targets: Array<Target>
}
export type AfterPackContext = PackContext
export type BeforePackContext = PackContext
export type AfterExtractContext = PackContext

export interface Hooks {
  /**
The function (or path to file or module id) to be run before pack.

```typescript
(context: BeforePackContext): Promise<any> | any
```

!!! example "As function"

    ```js
    beforePack: async (context) => {
      // your code
    }
    ```

Because in a configuration file you cannot use JavaScript, can be specified as a path to file or module id. Function must be exported as default export.

```json
"build": {
  "beforePack": "./myBeforePackHook.js"
}
```

File `myBeforePackHook.js` in the project root directory:

!!! example "myBeforePackHook.js"
    ```js
    exports.default = async function(context) {
      // your custom code
    }
    ```
   */
  readonly beforePack?: Hook<BeforePackContext, any> | string | null

  /**
   * The function (or path to file or module id) to be [run after the prebuilt Electron binary has been extracted to the output directory](#afterextract)
   * Same setup as {@link beforePack}
   */
  readonly afterExtract?: Hook<AfterExtractContext, any> | string | null

  /**
   * The function (or path to file or module id) to be [run after pack](#afterpack) (but before pack into distributable format and sign).
   * Same setup as {@link beforePack}
   */
  readonly afterPack?: Hook<AfterPackContext, any> | string | null

  /**
   * The function (or path to file or module id) to be [run after pack and sign](#aftersign) (but before pack into distributable format).
   * Same setup as {@link beforePack}
   */
  readonly afterSign?: Hook<AfterPackContext, any> | string | null

  /**
   * The function (or path to file or module id) to be run on artifact build start.
   * Same setup as {@link beforePack}
   */
  readonly artifactBuildStarted?: Hook<ArtifactBuildStarted, any> | string | null
  /**
   * The function (or path to file or module id) to be run on artifact build completed.
   * Same setup as {@link beforePack}
   */
  readonly artifactBuildCompleted?: Hook<ArtifactCreated, any> | string | null
  /**
   * The function (or path to file or module id) to be run after all artifacts are built.

```typescript
(buildResult: BuildResult): Promise<Array<string>> | Array<string>
```

Configuration in the same way as `afterPack` (see above).

!!! example "myAfterAllArtifactBuild.js"
    ```js
    exports.default = function () {
      // you can return additional files to publish
      return ["/path/to/additional/result/file"]
    }
    ```
   */
  readonly afterAllArtifactBuild?: Hook<BuildResult, Array<string>> | string | null
  /**
   * MSI project created on disk - not packed into .msi package yet.
   */
  readonly msiProjectCreated?: Hook<string, any> | string | null
  /**
   * Appx manifest created on disk - not packed into .appx package yet.
   */
  readonly appxManifestCreated?: Hook<string, any> | string | null
  /**
   * The function (or path to file or module id) to be [run on each node module](#onnodemodulefile) file. Returning `true`/`false` will determine whether to force include or to use the default copier logic
   */
  readonly onNodeModuleFile?: Hook<string, void | boolean> | string | null
  /**
   * The function (or path to file or module id) to be run before dependencies are installed or rebuilt. Works when `npmRebuild` is set to `true`. Resolving to `false` will skip dependencies install or rebuild.
   *
   * If provided and `node_modules` are missing, it will not invoke production dependencies check.
   */
  readonly beforeBuild?: Hook<BeforeBuildContext, boolean | void> | string | null
}

export interface MetadataDirectories {
  /**
   * The path to build resources.
   *
   * Please note — build resources are not packed into the app. If you need to use some files, e.g. as tray icon, please include required files explicitly: `"files": ["**\/*", "build/icon.*"]`
   * @default build
   */
  readonly buildResources?: string | null

  /**
   * The output directory. [File macros](./file-patterns.md#file-macros) are supported.
   * @default dist
   */
  readonly output?: string | null

  /**
   * The application directory (containing the application package.json), defaults to `app`, `www` or working directory.
   */
  readonly app?: string | null
}
