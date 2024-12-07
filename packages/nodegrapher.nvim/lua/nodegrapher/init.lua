local M = {}

-- 将坐标转换为ASCII网格索引
local function coord_to_grid_index(x, y, width, height, grid_width, grid_height)
  local grid_x = math.floor((x / width) * grid_width)
  local grid_y = math.floor((y / height) * grid_height)
  return grid_x, grid_y
end

-- 创建空的ASCII网格
local function create_empty_grid(width, height)
  local grid = {}
  for y = 1, height do
    grid[y] = {}
    for x = 1, width do
      grid[y][x] = ' '
    end
  end
  return grid
end

-- 在网格上绘制线条
local function draw_line(grid, x1, y1, x2, y2, char)
  -- 使用Bresenham算法绘制线条
  local dx = math.abs(x2 - x1)
  local dy = math.abs(y2 - y1)
  local sx = x1 < x2 and 1 or -1
  local sy = y1 < y2 and 1 or -1
  local err = dx - dy

  while true do
    if grid[y1] and grid[y1][x1] then
      grid[y1][x1] = char
    end
    
    if x1 == x2 and y1 == y2 then break end
    local e2 = 2 * err
    if e2 > -dy then
      err = err - dy
      x1 = x1 + sx
    end
    if e2 < dx then
      err = err + dx
      y1 = y1 + sy
    end
  end
end

-- 将图形数据转换为ASCII艺术
function M.graph_to_ascii(graph_data, width, height)
  -- 创建ASCII网格
  local grid = create_empty_grid(width, height)
  
  -- 获取图形边界
  local min_x, max_x = math.huge, -math.huge
  local min_y, max_y = math.huge, -math.huge
  
  for _, node in ipairs(graph_data.nodes) do
    min_x = math.min(min_x, node.x)
    max_x = math.max(max_x, node.x)
    min_y = math.min(min_y, node.y)
    max_y = math.max(max_y, node.y)
  end
  
  -- 绘制线条
  for _, line in ipairs(graph_data.lines) do
    local start_node = graph_data.nodes[line[1] + 1]
    local end_node = graph_data.nodes[line[2] + 1]
    
    local x1, y1 = coord_to_grid_index(
      start_node.x - min_x,
      start_node.y - min_y,
      max_x - min_x,
      max_y - min_y,
      width,
      height
    )
    
    local x2, y2 = coord_to_grid_index(
      end_node.x - min_x,
      end_node.y - min_y,
      max_x - min_x,
      max_y - min_y,
      width,
      height
    )
    
    draw_line(grid, x1, y1, x2, y2, '─')
  end
  
  -- 绘制节点
  for _, node in ipairs(graph_data.nodes) do
    local x, y = coord_to_grid_index(
      node.x - min_x,
      node.y - min_y,
      max_x - min_x,
      max_y - min_y,
      width,
      height
    )
    if grid[y] and grid[y][x] then
      grid[y][x] = '●'
    end
  end
  
  -- 转换网格为字符串
  local result = {}
  for y = 1, height do
    table.insert(result, table.concat(grid[y]))
  end
  
  return table.concat(result, '\n')
end

return M 