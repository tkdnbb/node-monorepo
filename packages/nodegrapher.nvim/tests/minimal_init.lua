-- Minimal init.lua for running tests
local api = vim.api
local fn = vim.fn

-- Add the plugin to runtimepath
local plugin_root = fn.getcwd()
vim.opt.runtimepath:append(plugin_root)

-- Also add plenary.nvim to runtimepath (required for testing)
local plenary_root = fn.stdpath('data') .. '/site/pack/vendor/start/plenary.nvim'
if fn.isdirectory(plenary_root) == 0 then
  fn.system({
    'git',
    'clone',
    'https://github.com/nvim-lua/plenary.nvim',
    plenary_root,
  })
end
vim.opt.runtimepath:append(plenary_root)

-- Load the plugin
require('nodegrapher').setup() 