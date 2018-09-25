#! /usr/bin/env node
const commandLineParser = require('./commandLineParser');
const commandRunner = require('./commandRunner');

const args = commandLineParser.parseArguments();

commandRunner.run(args);
