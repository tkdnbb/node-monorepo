local assert = require('luassert')
local nodegrapher = require('nodegrapher')

describe('nodegrapher', function()
  -- Setup and teardown for each test
  before_each(function()
    -- Reset plugin state before each test
    nodegrapher.setup({
      width = 80,
      height = 40,
      node_char = '●',
      line_char = '─'
    })
  end)

  describe('coordinate conversion', function()
    it('should correctly convert coordinates to grid indices', function()
      local json_input = [[
        {
          "nodes": [
            {"x": 0, "y": 0},
            {"x": 100, "y": 100}
          ],
          "lines": [[0,1]]
        }
      ]]
      
      local result = nodegrapher.convert_string(json_input)
      assert.truthy(result:match('●'))  -- Should contain node character
      assert.truthy(result:match('─'))  -- Should contain line character
    end)
  end)

  describe('graph conversion', function()
    it('should handle empty graph', function()
      local empty_graph = [[{"nodes": [], "lines": []}]]
      local result = nodegrapher.convert_string(empty_graph)
      assert.equals('', result)
    end)

    it('should handle single node', function()
      local single_node = [[
        {
          "nodes": [{"x": 50, "y": 50}],
          "lines": []
        }
      ]]
      local result = nodegrapher.convert_string(single_node)
      assert.truthy(result:match('●'))
      assert.equals(1, select(2, result:gsub('●', '●')))  -- Count nodes
    end)

    it('should handle node labels', function()
      local labeled_graph = [[
        {
          "nodes": [
            {"x": 0, "y": 0, "label": "A"},
            {"x": 1, "y": 0, "label": "B"}
          ],
          "lines": [[0,1]]
        }
      ]]
      local result = nodegrapher.convert_string(labeled_graph)
      assert.truthy(result:match('A'))
      assert.truthy(result:match('B'))
    end)
  end)

  describe('configuration', function()
    it('should respect custom width setting', function()
      nodegrapher.setup({ width = 40 })
      local simple_graph = [[
        {
          "nodes": [
            {"x": 0, "y": 0},
            {"x": 39, "y": 0}
          ],
          "lines": [[0,1]]
        }
      ]]
      local result = nodegrapher.convert_string(simple_graph)
      local lines = vim.split(result, '\n')
      assert.equals(40, #lines[1])
    end)

    it('should use custom node character', function()
      nodegrapher.setup({ node_char = 'O' })
      local single_node = [[
        {
          "nodes": [{"x": 0, "y": 0}],
          "lines": []
        }
      ]]
      local result = nodegrapher.convert_string(single_node)
      assert.truthy(result:match('O'))
    end)
  end)

  describe('error handling', function()
    it('should handle invalid JSON', function()
      local invalid_json = '{"nodes": [}'
      assert.has_error(function()
        nodegrapher.convert_string(invalid_json)
      end)
    end)

    it('should handle missing required fields', function()
      local missing_nodes = [[{"lines": []}]]
      assert.has_error(function()
        nodegrapher.convert_string(missing_nodes)
      end)
    end)

    it('should handle invalid node references', function()
      local invalid_lines = [[
        {
          "nodes": [{"x": 0, "y": 0}],
          "lines": [[0,1]]
        }
      ]]
      assert.has_error(function()
        nodegrapher.convert_string(invalid_lines)
      end)
    end)
  end)
end) 