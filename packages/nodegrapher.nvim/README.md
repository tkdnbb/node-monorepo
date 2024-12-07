# Nodegrapher.nvim

A Neovim plugin for converting graph data into ASCII art visualization.

## Features

- Convert JSON graph data into ASCII character representation
- Visualize nodes and connections
- Auto-scale to fit specified width and height
- Support for both directed and undirected graphs
- Unicode characters for better visual representation

## Installation

### Prerequisites

- Neovim >= 0.5.0
- Git (for installation)
- A plugin manager (recommended)

### Using [packer.nvim](https://github.com/wbthomason/packer.nvim)

Add to your plugin configuration (usually in `~/.config/nvim/lua/plugins.lua`):

```lua
use {
  'username/nodegrapher.nvim',
  config = function()
    require('nodegrapher').setup({
      -- Optional configuration here
    })
  end
}
```

Then run `:PackerSync` in Neovim.

### Using [lazy.nvim](https://github.com/folke/lazy.nvim)

Add to your plugins list (usually in `~/.config/nvim/lua/plugins/init.lua`):

```lua
{
  'username/nodegrapher.nvim',
  event = 'VeryLazy',
  opts = {
    -- Optional configuration here
  },
}
```

### Using [vim-plug](https://github.com/junegunn/vim-plug)

Add to your `~/.config/nvim/init.vim`:

```vim
Plug 'username/nodegrapher.nvim'
```

Then run `:PlugInstall` in Neovim.

### Manual Installation

If you prefer not to use a plugin manager:

```bash
# Linux/macOS
git clone https://github.com/username/nodegrapher.nvim \
  ~/.local/share/nvim/site/pack/plugins/start/nodegrapher.nvim

# Windows (PowerShell)
git clone https://github.com/username/nodegrapher.nvim `
  $env:LOCALAPPDATA\nvim-data\site\pack\plugins\start\nodegrapher.nvim
```

### Post-Installation Setup

Add to your Neovim configuration:

```lua
-- Init.lua
require('nodegrapher').setup({
  -- Optional: customize default settings
  width = 80,  -- ASCII output width
  height = 40, -- ASCII output height
  node_char = '●',
  line_char = '─'
})

-- Optional: Add key mappings
vim.keymap.set('n', '<leader>ng', ':NodeGrapherToAscii<CR>', { 
  desc = 'Convert graph to ASCII' 
})
```

Or in init.vim:

```vim
" Optional: Add key mapping
nnoremap <leader>ng :NodeGrapherToAscii<CR>
```

## Usage

### Basic Usage

1. Open a JSON file containing graph data in the following format:

```json
{
  "nodes": [
    { "x": 80, "y": 79 },
    { "x": 80, "y": 115.48 },
    { "x": 80, "y": 151.97 }
  ],
  "lines": [
    [0, 1],
    [1, 2]
  ]
}
```

2. Use one of these methods to convert the graph:
   - Run the command `:NodeGrapherToAscii`
   - Use the default mapping `<leader>ng` (if configured)
   - Call the Lua function directly: `:lua require('nodegrapher').convert_current_buffer()`

3. The plugin will open a new split window with the ASCII representation of your graph.

### Input Format Requirements

The JSON input must contain:
- A `nodes` array with objects containing `x` and `y` coordinates
- A `lines` array with pairs of indices representing connections between nodes
- Optional `label` property for each node to display node labels

### Supported Commands

| Command | Description |
|---------|-------------|
| `:NodeGrapherToAscii` | Convert current buffer's JSON to ASCII art |
| `:NodeGrapherSetWidth <n>` | Set output width to n characters |
| `:NodeGrapherSetHeight <n>` | Set output height to n characters |
| `:NodeGrapherToggleLabels` | Toggle display of node labels |

### Configuration Options

You can customize the plugin behavior in your Neovim config:

```lua
require('nodegrapher').setup({
  -- Display settings
  width = 80,          -- Output width in characters
  height = 40,         -- Output height in characters
  
  -- Appearance
  node_char = '●',     -- Character used for nodes
  line_char = '─',     -- Character used for lines
  vertical_char = '│', -- Character used for vertical lines
  corner_chars = {     -- Characters used for corners
    '┌', '┐',         -- Top left, top right
    '└', '┘'          -- Bottom left, bottom right
  },
  
  -- Behavior
  show_labels = true,  -- Show node labels if present
  auto_scale = true,   -- Automatically scale graph to fit
  
  -- Window settings
  split_direction = 'vertical', -- or 'horizontal'
  split_size = 80,             -- Size of the split window
})
```

### Advanced Usage

#### Custom Mappings

Add your own key mappings in your Neovim config:

```lua
-- Convert and show in vertical split
vim.keymap.set('n', '<leader>ngv', function()
  require('nodegrapher').convert_with_options({ split_direction = 'vertical' })
end)

-- Convert and show in horizontal split
vim.keymap.set('n', '<leader>ngh', function()
  require('nodegrapher').convert_with_options({ split_direction = 'horizontal' })
end)

-- Convert with custom dimensions
vim.keymap.set('n', '<leader>ngc', function()
  require('nodegrapher').convert_with_options({ width = 120, height = 60 })
end)
```

#### API Functions

The plugin exposes these Lua functions for programmatic use:

```lua
-- Convert buffer content
require('nodegrapher').convert_current_buffer()

-- Convert string directly
require('nodegrapher').convert_string(json_string)

-- Convert with custom options
require('nodegrapher').convert_with_options({
  width = 100,
  height = 50,
  show_labels = false
})
```

### Troubleshooting

Common issues and solutions:

1. **Invalid JSON Error**
   - Ensure your JSON is properly formatted
   - Check for missing commas or brackets
   - Validate JSON using an online validator

2. **Scaling Issues**
   - If the graph appears too small/large, adjust width/height settings
   - Enable `auto_scale` in configuration
   - Use `:NodeGrapherSetWidth` and `:NodeGrapherSetHeight` commands

3. **Display Problems**
   - Ensure your terminal supports Unicode characters
   - Try different values for `node_char` and `line_char`
   - Check if your font supports the characters used

### Examples

#### Simple Graph
Input:
```json
{
  "nodes": [
    {"x": 0, "y": 0, "label": "A"},
    {"x": 1, "y": 1, "label": "B"},
    {"x": 2, "y": 0, "label": "C"}
  ],
  "lines": [[0,1], [1,2]]
}
```

Output:
```
A   B   C
●───●───●
```

#### Complex Graph
[Include another example with a more complex graph structure]

## Tips and Best Practices

1. Use appropriate terminal font with good Unicode support
2. Adjust width/height based on your graph complexity
3. Consider using labels for better node identification
4. Save common configurations in your Neovim config file
5. Use horizontal splits for wide graphs, vertical for tall ones

## Development

### Running Tests

Prerequisites:
- Neovim >= 0.5.0
- [plenary.nvim](https://github.com/nvim-lua/plenary.nvim) (automatically installed when running tests)

To run the tests:

```bash
# Run all tests
nvim --headless -c "PlenaryBustedDirectory tests" -c "qa"

# Run specific test file
nvim --headless -c "PlenaryBustedFile tests/nodegrapher_spec.lua" -c "qa"
```

The tests cover:
- Coordinate conversion
- Graph data processing
- Configuration options
- Error handling
- Edge cases