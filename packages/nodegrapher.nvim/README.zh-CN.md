# Nodegrapher.nvim

一个用于将图形数据转换为ASCII艺术可视化的Neovim插件。

## 功能特性

- 将JSON格式的图形数据转换为ASCII字符表示
- 可视化节点和连接关系
- 自动缩放以适应指定宽度和高度
- 支持有向图和无向图
- 使用Unicode字符以获得更好的视觉效果

## 安装

使用你喜欢的包管理器安装:

## 使用方法

### 基本用法

1. 打开包含以下格式的JSON图形数据文件：

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

2. 使用以下任一方法转换图形：
   - 运行命令 `:NodeGrapherToAscii`
   - 使用默认快捷键 `<leader>ng`（如果已配置）
   - 直接调用Lua函数：`:lua require('nodegrapher').convert_current_buffer()`

3. 插件会在新的分割窗口中显示图形的ASCII表示。

### 输入格式要求

JSON输入必须包含：
- `nodes` 数组：包含具有 `x` 和 `y` 坐标的对象
- `lines` 数组：包含表示节点之间连接的索引对
- 可选的 `label` 属性：用于显示节点标签

### 支持的命令

| 命令 | 说明 |
|---------|-------------|
| `:NodeGrapherToAscii` | 将当前缓冲区的JSON转换为ASCII艺术 |
| `:NodeGrapherSetWidth <n>` | 设置输出宽度为n个字符 |
| `:NodeGrapherSetHeight <n>` | 设置输出高度为n个字符 |
| `:NodeGrapherToggleLabels` | 切换节点标签的显示 |

### 配置选项

你可以在Neovim配置中自定义插件行为：

```lua
require('nodegrapher').setup({
  -- 显示设置
  width = 80,          -- 输出宽度（字符数）
  height = 40,         -- 输出高度（字符数）
  
  -- 外观
  node_char = '●',     -- 用于节点的字符
  line_char = '─',     -- 用于连线的字符
  vertical_char = '│', -- 用于垂直线的字符
  corner_chars = {     -- 用于角落的字符
    '┌', '┐',         -- 左上角，右上角
    '└', '┘'          -- 左下角，右下角
  },
  
  -- 行为
  show_labels = true,  -- 显示节点标签（如果存在）
  auto_scale = true,   -- 自动缩放图形以适应大小
  
  -- 窗口设置
  split_direction = 'vertical', -- 或 'horizontal'
  split_size = 80,             -- 分割窗口的大小
})
```

### 高级用法

#### 自定义快捷键

在Neovim配置中添加你自己的快捷键：

```lua
-- 在垂直分割窗口中显示
vim.keymap.set('n', '<leader>ngv', function()
  require('nodegrapher').convert_with_options({ split_direction = 'vertical' })
end)

-- 在水平分割窗口中显示
vim.keymap.set('n', '<leader>ngh', function()
  require('nodegrapher').convert_with_options({ split_direction = 'horizontal' })
end)

-- 使用自定义尺寸转换
vim.keymap.set('n', '<leader>ngc', function()
  require('nodegrapher').convert_with_options({ width = 120, height = 60 })
end)
```

#### API函数

插件提供以下Lua函数供编程使用：

```lua
-- 转换缓冲区内容
require('nodegrapher').convert_current_buffer()

-- 直接转换字符串
require('nodegrapher').convert_string(json_string)

-- 使用自定义选项转换
require('nodegrapher').convert_with_options({
  width = 100,
  height = 50,
  show_labels = false
})
```

### 故障排除

常见问题及解决方案：

1. **JSON无效错误**
   - 确保JSON格式正确
   - 检查是否缺少逗号或括号
   - 使用在线验证工具验证JSON

2. **缩放问题**
   - 如果图形太大或太小，调整宽度/高度设置
   - 在配置中启用 `auto_scale`
   - 使用 `:NodeGrapherSetWidth` 和 `:NodeGrapherSetHeight` 命令

3. **显示问题**
   - 确保终端支持Unicode字符
   - 尝试使用不同的 `node_char` 和 `line_char` 值
   - 检查字体是否支持所使用的字符

### 示例

#### 简单图形
输入：
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

输出：
```
A   B   C
●───●───●
```

#### 复杂图形
[包含一个更复杂的图形结构示例]

## 使用技巧

1. 使用支持Unicode的合适终端字体
2. 根据图形复杂度调整宽度/高度
3. 考虑使用标签以更好地识别节点
4. 在Neovim配置文件中保存常用配置
5. 对于宽图使用水平分割，对于高图使用垂直分割

## 开发

[其余部分保持不变...]