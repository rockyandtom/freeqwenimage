"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import ToolCard from './tool-card';
import { ToolConfig, TOOLS_CONFIG, getToolCategories } from '@/config/tools';

interface ToolGridProps {
  tools?: ToolConfig[];
  showSearch?: boolean;
  showFilters?: boolean;
  showCategory?: boolean;
  className?: string;
}

export default function ToolGrid({ 
  tools = TOOLS_CONFIG, 
  showSearch = true, 
  showFilters = true,
  showCategory = false,
  className = '' 
}: ToolGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = getToolCategories();
  
  // Filter tools based on search and filters
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || tool.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 移动端优化的搜索和筛选 */}
      {(showSearch || showFilters) && (
        <div className="space-y-4">
          {/* 搜索框 */}
          {showSearch && (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 sm:h-auto"
              />
            </div>
          )}
          
          {/* 筛选器 */}
          {showFilters && (
            <div className="space-y-3">
              {/* 分类筛选 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Category</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className="h-8 text-xs"
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize h-8 text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* 状态筛选 - 移动端简化 */}
              <div className="sm:hidden">
                <div className="text-sm font-medium mb-2">Status</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('all')}
                    className="h-8 text-xs"
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedStatus === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('active')}
                    className="h-8 text-xs"
                  >
                    Active
                  </Button>
                  <Button
                    variant={selectedStatus === 'beta' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('beta')}
                    className="h-8 text-xs"
                  >
                    Beta
                  </Button>
                </div>
              </div>

              {/* 桌面端状态筛选 */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Status</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('all')}
                  >
                    All Status
                  </Button>
                  <Button
                    variant={selectedStatus === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('active')}
                  >
                    Active
                  </Button>
                  <Button
                    variant={selectedStatus === 'beta' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('beta')}
                  >
                    Beta
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 结果计数和活动筛选器 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
        </p>
        
        {/* 活动筛选器 */}
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              <span className="hidden sm:inline">Category: </span>{selectedCategory}
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedStatus !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              <span className="hidden sm:inline">Status: </span>{selectedStatus}
              <button
                onClick={() => setSelectedStatus('all')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="text-xs max-w-32 sm:max-w-none">
              <span className="hidden sm:inline">Search: "</span>
              <span className="truncate">{searchTerm}</span>
              <span className="hidden sm:inline">"</span>
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:text-destructive flex-shrink-0"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* 工具网格 - 移动端优化 */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              showCategory={showCategory}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-4xl sm:text-6xl mb-4">🔍</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No tools found</h3>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Try adjusting your search terms or filters
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="w-full sm:w-auto"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}