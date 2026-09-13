import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Package, PlusCircle, CheckCircle, Edit2, Save, X, BookOpen, GripVertical, Search, Filter, ArrowUpDown, LayoutGrid, List, MoreHorizontal, Layers, Image as ImageIcon } from 'lucide-react';
import { COURSE_DEFINITIONS, AVAILABLE_ITEMS } from '../constants';
import { CourseDefinition, CourseItem } from '../types';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const ProductManagement: React.FC = () => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data State
  const [packages, setPackages] = useState<CourseDefinition[]>(COURSE_DEFINITIONS);
  const [items, setItems] = useState<CourseItem[]>(AVAILABLE_ITEMS);
  
  // Selection State
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  // Editing State (Temporary holders for inputs)
  const [pkgNameInput, setPkgNameInput] = useState('');
  const [itemNameInput, setItemNameInput] = useState('');
  const [itemCategoryInput, setItemCategoryInput] = useState<'Level 2' | 'Level 3' | 'Level 4' | 'Courses'>('Courses');

  // Mode State (Are we creating new or editing existing?)
  const [pkgMode, setPkgMode] = useState<'view' | 'create' | 'edit'>('view');
  const [itemMode, setItemMode] = useState<'view' | 'create' | 'edit'>('view');

  // Delete Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{isOpen: boolean, type: 'package' | 'item' | null}>({
      isOpen: false, 
      type: null
  });

  const categories = ['Level 2', 'Level 3', 'Level 4', 'Courses'] as const;

  // Filter Logic
  const filteredPackages = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- PACKAGE HANDLERS ---

  const handlePackageSelect = (id: string) => {
    setSelectedPackageId(id);
    setPkgMode('view');
    const pkg = packages.find(p => p.id === id);
    setPkgNameInput(pkg ? pkg.name : '');
  };

  const handleStartCreatePackage = () => {
    setSelectedPackageId('');
    setPkgNameInput('');
    setPkgMode('create');
  };

  const handleStartEditPackage = () => {
    if (!selectedPackageId) return;
    setPkgMode('edit');
  };

  const handleSavePackage = () => {
    if (!pkgNameInput.trim()) return;

    if (pkgMode === 'create') {
        const newPkg: CourseDefinition = {
            id: Date.now().toString(),
            name: pkgNameInput,
            items: []
        };
        setPackages([...packages, newPkg]);
        setSelectedPackageId(newPkg.id);
    } else if (pkgMode === 'edit') {
        setPackages(packages.map(p => p.id === selectedPackageId ? { ...p, name: pkgNameInput } : p));
    }
    setPkgMode('view');
  };

  // Trigger Package Delete
  const handleDeletePackageClick = () => {
    if (!selectedPackageId) return;
    setDeleteConfirmation({ isOpen: true, type: 'package' });
  };

  // --- COURSE/ITEM HANDLERS ---

  const handleItemSelect = (id: string) => {
      setSelectedItemId(id);
      setItemMode('view');
      const item = items.find(i => i.id === id);
      if (item) {
          setItemNameInput(item.name);
          setItemCategoryInput(item.category);
      } else {
          setItemNameInput('');
      }
  };

  const handleStartCreateItem = () => {
      setSelectedItemId('');
      setItemNameInput('');
      setItemMode('create');
  };

  const handleStartEditItem = () => {
      if (!selectedItemId) return;
      setItemMode('edit');
  };

  const handleSaveItem = () => {
      if (!itemNameInput.trim()) return;

      if (itemMode === 'create') {
          const newItem: CourseItem = {
              id: Date.now().toString(),
              name: itemNameInput,
              category: itemCategoryInput
          };
          setItems([...items, newItem]);
          setSelectedItemId(newItem.id);
      } else if (itemMode === 'edit') {
          setItems(items.map(i => i.id === selectedItemId ? { ...i, name: itemNameInput, category: itemCategoryInput } : i));
      }
      setItemMode('view');
  };

  // Trigger Item Delete
  const handleDeleteItemClick = () => {
      if (!selectedItemId) return;
      setDeleteConfirmation({ isOpen: true, type: 'item' });
  };

  // --- COMMON DELETE CONFIRM HANDLER ---
  const handleConfirmDelete = () => {
      if (deleteConfirmation.type === 'package') {
          setPackages(packages.filter(p => p.id !== selectedPackageId));
          setSelectedPackageId('');
          setPkgMode('view');
          setPkgNameInput('');
      } else if (deleteConfirmation.type === 'item') {
          setItems(items.filter(i => i.id !== selectedItemId));
          // Also remove from all packages
          setPackages(packages.map(p => ({
              ...p,
              items: p.items.filter(id => id !== selectedItemId)
          })));
          setSelectedItemId('');
          setItemMode('view');
          setItemNameInput('');
      }
      setDeleteConfirmation({ isOpen: false, type: null });
  };


  // --- COMPOSITION & DRAG HANDLERS ---

  const addItemToPackage = (itemId: string) => {
      if (!selectedPackageId) return;
      const currentPkg = packages.find(p => p.id === selectedPackageId);
      if (!currentPkg || currentPkg.items.includes(itemId)) return;

      const updatedItems = [...currentPkg.items, itemId];
      setPackages(packages.map(p => 
          p.id === selectedPackageId ? { ...p, items: updatedItems } : p
      ));
  };

  const removeItemFromPackage = (itemId: string) => {
      if (!selectedPackageId) return;
      const currentPkg = packages.find(p => p.id === selectedPackageId);
      if (!currentPkg) return;

      const updatedItems = currentPkg.items.filter(id => id !== itemId);
      setPackages(packages.map(p => 
          p.id === selectedPackageId ? { ...p, items: updatedItems } : p
      ));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('text/plain', index.toString());
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
      if (isNaN(sourceIndex)) return;
      
      const currentPkg = packages.find(p => p.id === selectedPackageId);
      if (!currentPkg) return;

      const newItems = [...currentPkg.items];
      const [movedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, movedItem);

      setPackages(packages.map(p => 
          p.id === selectedPackageId ? { ...p, items: newItems } : p
      ));
  };


  // VIEW 1: LANDING PAGE (Grid View with Images)
  if (view === 'list') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Search and Filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input 
                        type="text" 
                        placeholder="Search courses..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 border border-[#E5E7EB] rounded-md text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-[#1A1A2E]"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A2E]"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                
                <button className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#E5E7EB] text-[#1A1A2E] rounded-md font-medium text-xs hover:bg-[#F8FAFB] transition-colors">
                    <Filter className="w-3.5 h-3.5 text-[#7C3AED]" /> Filters
                </button>
            </div>

            {/* Sort and Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="text-xs text-[#6B7280] hidden md:block mr-1">
                    {filteredPackages.length} results
                </div>
                
                <div className="flex items-center border border-[#E5E7EB] rounded-md bg-white overflow-hidden">
                    <button className="px-3 py-2 border-r border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFB] text-xs font-medium flex items-center gap-1.5">
                        <ArrowUpDown className="w-3 h-3" /> Last modified (Newest)
                    </button>
                    <button className="p-2 bg-[#F8FAFB] text-[#1A1A2E]">
                        <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-2 bg-white text-[#6B7280] hover:bg-[#F8FAFB]">
                        <List className="w-3.5 h-3.5" />
                    </button>
                </div>

                <button 
                    onClick={() => setView('edit')}
                    className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3.5"
                >
                    <Plus className="w-4 h-4" /> New Product
                </button>
            </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPackages.map((pkg, index) => {
             const itemCount = pkg.items.length;
             // Determine if it looks like a single course or collection based on item count (Arbitrary for UI demo)
             const isCollection = itemCount > 1 || pkg.name.includes("Collection") || pkg.name.includes("Level");
             
             return (
              <div 
                  key={pkg.id} 
                  onClick={() => {
                      handlePackageSelect(pkg.id);
                      setView('edit');
                  }}
                  className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] overflow-hidden group hover:shadow-md hover:border-[#10B981] transition-all cursor-pointer flex flex-col h-full"
              >
                  {/* Image Area */}
                  <div className="h-44 bg-[#F8FAFB] relative overflow-hidden">
                      {/* Image Placeholder / Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-[#1A1A2E] to-[#2D3748]' : 'from-[#10B981] to-[#047857]'}`}></div>
                      
                      {/* Mock Image Overlay (Simulated) */}
                      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://source.unsplash.com/random/800x600?gym,fitness')] bg-cover bg-center"></div>
                      
                      {/* Overlay Content */}
                      <div className="absolute top-2.5 right-2.5">
                          <button className="p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-md backdrop-blur-sm transition-colors">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                      </div>

                      {/* View Button overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                          <span className="btn-primary text-xs py-1.5 px-3.5 shadow-md">Edit Course</span>
                      </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-4 flex flex-col flex-1">
                      {/* Type Badge */}
                      <div className="flex items-center gap-2 mb-1.5">
                          {isCollection ? (
                              <span className="text-[10px] font-semibold text-[#7C3AED] uppercase tracking-wider flex items-center gap-1">
                                  <Layers className="w-3 h-3" /> Course Collection
                              </span>
                          ) : (
                              <span className="text-[10px] font-semibold text-[#10B981] uppercase tracking-wider flex items-center gap-1">
                                  <BookOpen className="w-3 h-3" /> Course
                              </span>
                          )}
                      </div>

                      <h3 className="font-semibold text-sm text-[#1A1A2E] mb-1.5 leading-tight group-hover:text-[#10B981] transition-colors">
                          {pkg.name}
                      </h3>
                      
                      <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">
                          {pkg.items.length > 0 
                            ? `Includes content covering ${pkg.items.length} key areas.` 
                            : 'No content added yet. Click to start building this course structure.'}
                      </p>

                      {/* Footer Info */}
                      <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                               <span className="badge-success text-[10px] py-0.5 px-2">
                                   Published
                                </span>
                               {/* Mock Draft Badge for variety */}
                               {index % 3 === 0 && (
                                   <span className="text-[10px] font-medium bg-[#F8FAFB] text-[#6B7280] px-2 py-0.5 rounded border border-[#E5E7EB]">
                                       v1.2
                                   </span>
                               )}
                          </div>
                          
                          <div className="flex items-center text-[11px] text-[#6B7280] font-medium">
                              <List className="w-3 h-3 mr-1" /> {itemCount} {isCollection ? 'Courses' : 'Lessons'}
                          </div>
                      </div>
                  </div>
              </div>
             );
          })}
        </div>
      </div>
    );
  }

  // VIEW 2: EDITOR (Existing Logic)
  const currentPackage = packages.find(p => p.id === selectedPackageId);
  const includedItems = currentPackage 
      ? currentPackage.items.map(id => items.find(i => i.id === id)).filter(Boolean) as CourseItem[]
      : [];
  const availableItems = items.filter(i => !currentPackage?.items.includes(i.id));

  // Determine item name for delete modal
  let deleteItemName = '';
  if (deleteConfirmation.type === 'package') {
      deleteItemName = currentPackage?.name || '';
  } else if (deleteConfirmation.type === 'item') {
      deleteItemName = items.find(i => i.id === selectedItemId)?.name || '';
  }

  return (
    <div className="space-y-8 pb-12 animate-in slide-in-from-right-4 duration-300">
       <div className="flex justify-between items-center pb-4 border-b border-[#E5E7EB]">
            <div>
                <h1 className="text-2xl font-bold text-[#1A1A2E]">Product Editor</h1>
                <p className="text-xs text-[#6B7280]">Manage packages and their structured content.</p>
            </div>
            <button onClick={() => setView('list')} className="text-[#6B7280] hover:text-[#10B981] flex items-center font-medium text-xs">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Overview
            </button>
       </div>

       {/* MANAGEMENT ROW */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* 1. PACKAGE MANAGER */}
           <div className="bg-white p-5 rounded-lg shadow-sm border border-[#E5E7EB] flex flex-col h-full">
               <h2 className="text-base font-semibold text-[#1A1A2E] mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-[#10B981]" />
                    Manage Packages
               </h2>
               
               <div className="space-y-3 flex-1">
                   {pkgMode === 'view' ? (
                       <>
                           <div className="flex gap-2">
                               <select 
                                   value={selectedPackageId} 
                                   onChange={(e) => handlePackageSelect(e.target.value)}
                                   className="flex-1 border border-[#E5E7EB] p-2.5 rounded-md text-xs font-semibold text-[#1A1A2E] focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] outline-none bg-white"
                               >
                                   <option value="">-- Select Package --</option>
                                   {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                               </select>
                               <button onClick={handleStartCreatePackage} className="btn-primary p-2.5 rounded-md" title="Create New">
                                   <Plus className="w-4 h-4" />
                               </button>
                           </div>
                           
                           {selectedPackageId && (
                               <div className="flex gap-2 mt-2">
                                   <button onClick={handleStartEditPackage} className="flex-1 flex items-center justify-center bg-[#F8FAFB] text-[#1A1A2E] py-2 rounded-md hover:bg-[#F3F4F6] text-xs font-medium border border-[#E5E7EB]">
                                       <Edit2 className="w-3.5 h-3.5 mr-1.5 text-[#7C3AED]" /> Edit Name
                                   </button>
                                   <button onClick={handleDeletePackageClick} className="flex-1 flex items-center justify-center bg-[#FEF2F2] text-[#DC2626] py-2 rounded-md hover:bg-[#FEE2E2] text-xs font-medium border border-[#FEE2E2]">
                                       <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                                   </button>
                               </div>
                           )}
                       </>
                   ) : (
                       <div className="bg-[#F8FAFB] p-3.5 rounded-md border border-[#E5E7EB] animate-in fade-in duration-200">
                           <label className="block text-xs font-medium text-[#1A1A2E] mb-1">
                               {pkgMode === 'create' ? 'New Package Name' : 'Edit Package Name'}
                           </label>
                           <div className="flex gap-2">
                               <input 
                                    type="text" 
                                    value={pkgNameInput} 
                                    onChange={(e) => setPkgNameInput(e.target.value)}
                                    className="flex-1 border border-[#E5E7EB] rounded-md p-2 text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] outline-none text-[#1A1A2E] bg-white"
                                    placeholder="e.g. Diamond Flexi"
                                    autoFocus
                               />
                               <button onClick={handleSavePackage} className="btn-primary p-2 text-xs rounded-md">
                                   <Save className="w-3.5 h-3.5" />
                               </button>
                               <button onClick={() => { setPkgMode('view'); handlePackageSelect(selectedPackageId); }} className="bg-white border border-[#E5E7EB] text-[#6B7280] p-2 rounded-md hover:bg-[#F8FAFB]">
                                   <X className="w-3.5 h-3.5" />
                               </button>
                           </div>
                       </div>
                   )}
               </div>
               <div className="mt-3 pt-3 border-t border-[#E5E7EB] text-[11px] text-[#6B7280]">
                   Select a package above to begin editing its content.
               </div>
           </div>

           {/* 2. COURSE MANAGER */}
           <div className="bg-white p-5 rounded-lg shadow-sm border border-[#E5E7EB] flex flex-col h-full">
               <h2 className="text-base font-semibold text-[#1A1A2E] mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-[#7C3AED]" />
                    Manage Courses
               </h2>
               
               <div className="space-y-3 flex-1">
                   {itemMode === 'view' ? (
                       <>
                           <div className="flex gap-2">
                               <select 
                                   value={selectedItemId} 
                                   onChange={(e) => handleItemSelect(e.target.value)}
                                   className="flex-1 border border-[#E5E7EB] p-2.5 rounded-md text-xs font-semibold text-[#1A1A2E] focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] outline-none bg-white"
                               >
                                   <option value="">-- Select Course --</option>
                                   {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                               </select>
                               <button onClick={handleStartCreateItem} className="btn-primary p-2.5 rounded-md" title="Create New">
                                   <Plus className="w-4 h-4" />
                               </button>
                           </div>
                           
                           {selectedItemId && (
                               <div className="flex gap-2 mt-2">
                                   <button onClick={handleStartEditItem} className="flex-1 flex items-center justify-center bg-[#F8FAFB] text-[#1A1A2E] py-2 rounded-md hover:bg-[#F3F4F6] text-xs font-medium border border-[#E5E7EB]">
                                       <Edit2 className="w-3.5 h-3.5 mr-1.5 text-[#7C3AED]" /> Edit Course
                                   </button>
                                   <button onClick={handleDeleteItemClick} className="flex-1 flex items-center justify-center bg-[#FEF2F2] text-[#DC2626] py-2 rounded-md hover:bg-[#FEE2E2] text-xs font-medium border border-[#FEE2E2]">
                                       <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                                   </button>
                               </div>
                           )}
                       </>
                   ) : (
                       <div className="bg-[#F8FAFB] p-3.5 rounded-md border border-[#E5E7EB] animate-in fade-in duration-200">
                           <label className="block text-xs font-medium text-[#1A1A2E] mb-1">
                               {itemMode === 'create' ? 'New Course Details' : 'Edit Course Details'}
                           </label>
                           <input 
                                type="text" 
                                value={itemNameInput} 
                                onChange={(e) => setItemNameInput(e.target.value)}
                                className="w-full border border-[#E5E7EB] rounded-md p-2 mb-2 text-xs focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] outline-none bg-white text-[#1A1A2E]"
                                placeholder="Course Name"
                                autoFocus
                           />
                           <select 
                                value={itemCategoryInput}
                                onChange={(e) => setItemCategoryInput(e.target.value as any)}
                                className="w-full border border-[#E5E7EB] rounded-md p-2 mb-2 text-xs bg-white text-[#1A1A2E]"
                           >
                               {categories.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>

                           <div className="flex gap-2 justify-end">
                               <button onClick={() => { setItemMode('view'); handleItemSelect(selectedItemId); }} className="px-3 py-1 text-xs bg-white border border-[#E5E7EB] text-[#6B7280] rounded-md hover:bg-[#F8FAFB]">
                                   Cancel
                               </button>
                               <button onClick={handleSaveItem} className="btn-primary px-3 py-1 text-xs rounded-md">
                                   Save
                               </button>
                           </div>
                       </div>
                   )}
               </div>
               <div className="mt-3 pt-3 border-t border-[#E5E7EB] text-[11px] text-[#6B7280]">
                   Add courses here to make them available for packages.
               </div>
           </div>
       </div>

       {/* COMPOSITION AREA */}
       <div className="bg-white p-5 rounded-lg shadow-sm border border-[#E5E7EB]">
           <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-[#1A1A2E] flex items-center">
                    Compose Package: 
                    {selectedPackageId ? (
                        <span className="ml-2 text-[#10B981]">{currentPackage?.name}</span>
                    ) : (
                        <span className="ml-2 text-[#6B7280] italic font-normal">No package selected</span>
                    )}
                </h2>
                {selectedPackageId && (
                     <span className="badge-success text-xs py-0.5 px-2.5">
                         {currentPackage?.items.length || 0} items included
                     </span>
                )}
           </div>

           {!selectedPackageId ? (
                <div className="h-56 flex flex-col items-center justify-center text-[#6B7280] border-2 border-dashed border-[#E5E7EB] rounded-lg bg-[#F8FAFB]">
                    <Package className="w-10 h-10 mb-2 opacity-40 text-[#10B981]" />
                    <p className="font-medium text-xs">Select a package above to edit its content</p>
                </div>
           ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* COLUMN 1: Included Items (Reorderable) */}
                   <div className="flex flex-col h-full">
                       <h3 className="text-xs font-semibold text-[#1A1A2E] mb-2.5 uppercase tracking-wider flex items-center justify-between">
                           Included Content 
                           <span className="text-[10px] normal-case font-normal text-[#6B7280]">(Drag to reorder)</span>
                       </h3>
                       
                       <div className="flex-1 bg-[#F8FAFB] border border-[#E5E7EB] rounded-lg p-2.5 min-h-[280px]">
                           {includedItems.length === 0 ? (
                               <div className="h-full flex flex-col items-center justify-center text-[#6B7280] italic text-xs p-4">
                                   <div className="mb-1">No content added yet.</div>
                                   <div>Select items from the library on the right.</div>
                               </div>
                           ) : (
                               <div className="space-y-2">
                                   {includedItems.map((item, index) => (
                                       <div 
                                           key={item.id}
                                           draggable
                                           onDragStart={(e) => handleDragStart(e, index)}
                                           onDragOver={handleDragOver}
                                           onDrop={(e) => handleDrop(e, index)}
                                           className="flex items-center justify-between bg-white p-2.5 rounded-md border border-[#E5E7EB] shadow-sm cursor-move hover:border-[#10B981] transition-all group"
                                       >
                                           <div className="flex items-center overflow-hidden">
                                               <GripVertical className="w-4 h-4 text-[#6B7280] mr-2.5 cursor-grab active:cursor-grabbing flex-shrink-0" />
                                               <div>
                                                   <h4 className="font-medium text-xs text-[#1A1A2E] truncate">{item.name}</h4>
                                                   <span className="text-[10px] text-[#6B7280]">{item.category}</span>
                                               </div>
                                           </div>
                                           <button 
                                                onClick={() => removeItemFromPackage(item.id)}
                                                className="p-1 text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
                                                title="Remove from package"
                                           >
                                               <X className="w-3.5 h-3.5" />
                                           </button>
                                       </div>
                                   ))}
                               </div>
                           )}
                       </div>
                   </div>

                   {/* COLUMN 2: Available Items (Add) */}
                   <div className="flex flex-col h-full">
                       <h3 className="text-xs font-semibold text-[#1A1A2E] mb-2.5 uppercase tracking-wider">
                           Available Library
                       </h3>
                       
                       <div className="flex-1 border border-[#E5E7EB] rounded-lg p-3.5 bg-white min-h-[280px] overflow-y-auto max-h-[450px]">
                           {availableItems.length === 0 ? (
                               <div className="text-center text-[#6B7280] italic text-xs py-8">
                                   All available courses have been added.
                               </div>
                           ) : (
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                   {availableItems.map(item => (
                                       <button 
                                           key={item.id}
                                           onClick={() => addItemToPackage(item.id)}
                                           className="flex items-center text-left p-2.5 rounded-md border border-[#E5E7EB] hover:border-[#10B981] hover:bg-[#F0FDFA] transition-all group"
                                       >
                                           <PlusCircle className="w-4 h-4 text-[#6B7280] group-hover:text-[#10B981] mr-2 flex-shrink-0" />
                                           <div className="overflow-hidden">
                                               <h4 className="font-medium text-xs text-[#1A1A2E] group-hover:text-[#10B981] truncate">{item.name}</h4>
                                               <span className="text-[10px] text-[#6B7280]">{item.category}</span>
                                           </div>
                                       </button>
                                   ))}
                                   {/* Quick Add New */}
                                   <button 
                                        onClick={handleStartCreateItem}
                                        className="flex items-center justify-center p-2.5 rounded-md border border-dashed border-[#E5E7EB] text-[#6B7280] hover:text-[#10B981] hover:border-[#10B981] transition-colors"
                                   >
                                       <Plus className="w-3.5 h-3.5 mr-1" />
                                       <span className="text-xs font-medium">Create New</span>
                                   </button>
                               </div>
                           )}
                       </div>
                   </div>
               </div>
           )}
       </div>

       {/* Delete Confirmation Modal */}
       <DeleteConfirmationModal 
            isOpen={deleteConfirmation.isOpen}
            onClose={() => setDeleteConfirmation({ isOpen: false, type: null })}
            onConfirm={handleConfirmDelete}
            itemName={deleteItemName}
       />
    </div>
  );
};

export default ProductManagement;