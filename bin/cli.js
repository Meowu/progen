#!/usr/bin/env node

require = require('esm')(module /*, options*/);
require('../dist/index.js').run(process.argv)