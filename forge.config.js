const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
    packagerConfig: {
        icon: "./images/MARKDOWNPPTX",
        asar: true,
        extraResource: [
            "bin"
        ]
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                icon: "images/MARKDOWNPPTX.ico",
                setupIcon: "./images/MARKDOWNPPTX.ico",
                extraResource: [
                    "bin/win"
                ]
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin', "linux"],
            extraResource: [
                "bin/win"
            ]
        },
        //{
        //    name: '@electron-forge/maker-deb',
        //    config: {},
        //},
        //{
        //    name: '@electron-forge/maker-rpm',
        //    config: {},
        //},
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: "spotthediff",
                    name: "markdownpptx"
                },
                prerelease: false,
                draft: true
            }
        }
    ]
};
