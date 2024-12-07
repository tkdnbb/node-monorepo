if vim.g.loaded_nodegrapher then
  return
end
vim.g.loaded_nodegrapher = true

-- 添加命令来转换JSON到ASCII
vim.api.nvim_create_user_command('NodeGrapherToAscii', function()
  local json_str = vim.fn.join(vim.api.nvim_buf_get_lines(0, 0, -1, false), '\n')
  local ok, graph_data = pcall(vim.fn.json_decode, json_str)
  
  if not ok then
    vim.notify('Invalid JSON data', vim.log.levels.ERROR)
    return
  end
  
  local nodegrapher = require('nodegrapher')
  local ascii_art = nodegrapher.graph_to_ascii(graph_data, 80, 40)
  
  -- 在新缓冲区中显示结果
  local buf = vim.api.nvim_create_buf(false, true)
  vim.api.nvim_buf_set_lines(buf, 0, -1, false, vim.split(ascii_art, '\n'))
  vim.api.nvim_command('vsplit')
  vim.api.nvim_win_set_buf(0, buf)
end, {}) 