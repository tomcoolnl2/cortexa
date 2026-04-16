//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    nx: {},
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
};

const plugins = [
    withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
