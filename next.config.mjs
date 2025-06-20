import path from 'path';

/** @type {import('next').NextConfig} */
const config = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve('./src');
    return config;
  },
    devIndicators: false,

};

export default config;
