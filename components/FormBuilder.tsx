
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    ArrowLeft, Save, GripVertical, Trash2, X, Plus, 
    Type, Hash, Calendar, Clock, List, CheckSquare, 
    AlignLeft, Image as ImageIcon, Video, FileText, 
    PenTool, Table, Info, CheckCircle, Eye, Layout as LayoutIcon,
    Square, AlignCenter, AlignRight, Box, Upload, AlertTriangle, Layers
} from 'lucide-react';

// --- Types ---
type ComponentType = 
    'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 
    'date' | 'time' | 'content' | 'image' | 'video' | 'document' | 'signature' | 'grid' |
    'logo' | 'header' | 'footer';

interface GridStaticColumn {
    colIndex: number; // 0-based index
    content: string[]; // Row values
}

export interface FormElement {
    id: string;
    type: ComponentType;
    label: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
    options?: string[]; // For select, radio, checkbox
    // New properties for structural elements
    alignment?: 'left' | 'center' | 'right';
    imageUrl?: string; 
    
    gridConfig?: {
        rows: number;
        cols: number;
        headers: string[];
        staticColumns?: GridStaticColumn[]; // Array of static columns
        // Deprecated fields kept for type safety if needed, but not used in new logic
        rowLabels?: string[]; 
        labelColumnIndex?: number;
    };
}

interface FormDefinition {
    id: string;
    title: string;
    type: string;
    orientation: 'portrait' | 'landscape';
    elements: FormElement[];
}

const TOOLBOX_ITEMS: { type: ComponentType; label: string; icon: any; category: string }[] = [
    { type: 'header', label: 'Header', icon: LayoutIcon, category: 'Structure' },
    { type: 'footer', label: 'Footer', icon: LayoutIcon, category: 'Structure' },
    { type: 'logo', label: 'Logo', icon: Square, category: 'Structure' },
    { type: 'text', label: 'Text Field', icon: Type, category: 'Basic' },
    { type: 'textarea', label: 'Text Area', icon: AlignLeft, category: 'Basic' },
    { type: 'number', label: 'Number', icon: Hash, category: 'Basic' },
    { type: 'select', label: 'Select Box', icon: List, category: 'Basic' },
    { type: 'radio', label: 'Radio Button', icon: CheckSquare, category: 'Basic' },
    { type: 'date', label: 'Date', icon: Calendar, category: 'Basic' },
    { type: 'time', label: 'Time', icon: Clock, category: 'Basic' },
    { type: 'grid', label: 'Data Grid', icon: Table, category: 'Advanced' }, // Special Grid
    { type: 'content', label: 'Content Block', icon: Info, category: 'Advanced' },
    { type: 'image', label: 'Image Upload', icon: ImageIcon, category: 'Media' },
    { type: 'video', label: 'Video Upload', icon: Video, category: 'Media' },
    { type: 'document', label: 'Doc Upload', icon: FileText, category: 'Media' },
    { type: 'signature', label: 'Signature', icon: PenTool, category: 'Advanced' },
];

const INITIAL_FORMS: FormDefinition[] = [
    { id: '1', title: 'Unit 1 Feedback', type: 'Feedback', orientation: 'portrait', elements: [] },
    { id: '2', title: 'Observation Report', type: 'Moderation', orientation: 'portrait', elements: [] }
];

const FormBuilder: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlFormId = searchParams.get('formId');

    // --- Global Forms State ---
    const [forms, setForms] = useState<FormDefinition[]>(INITIAL_FORMS);
    const [activeFormId, setActiveFormId] = useState<string>(INITIAL_FORMS[0].id);

    // --- Active Editor State (Synced with activeFormId) ---
    const [formName, setFormName] = useState('Untitled Form');
    const [formType, setFormType] = useState('General');
    const [formOrientation, setFormOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [elements, setElements] = useState<FormElement[]>([]);
    
    // Modal / Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempElement, setTempElement] = useState<FormElement | null>(null);
    
    // Raw inputs state to handle comma-separated lists smoothly while typing
    const [rawInputs, setRawInputs] = useState({
        options: '',
        headers: ''
    });

    // Save Modal State
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    // Exit Warning Modal State
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

    // Preview Mode State
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Drag State
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null); // For canvas elements
    const [draggedFormIndex, setDraggedFormIndex] = useState<number | null>(null); // For sidebar forms

    // --- Layout State (Resizable Panels) ---
    const [leftSidebarWidth, setLeftSidebarWidth] = useState(288); // Default w-72
    const [rightSidebarWidth, setRightSidebarWidth] = useState(288); // Default w-72

    // --- Initialization & Syncing ---

    // 1. Load initial data
    useEffect(() => {
        const storedForms = localStorage.getItem('betterfit_forms');
        if (storedForms) {
            setForms(JSON.parse(storedForms));
        } else if (urlFormId) {
            // If URL has ID but local storage empty (edge case), try to set it if it exists in initial
            if (INITIAL_FORMS.find(f => f.id === urlFormId)) {
                setActiveFormId(urlFormId);
            }
        }
    }, []);

    // 2. When activeFormId changes, load that form into the editor state
    useEffect(() => {
        const currentForm = forms.find(f => f.id === activeFormId);
        if (currentForm) {
            setFormName(currentForm.title);
            setFormType(currentForm.type);
            setFormOrientation(currentForm.orientation);
            setElements(currentForm.elements || []);
        }
    }, [activeFormId]);

    // 3. Update the global 'forms' state whenever the local editor state changes
    useEffect(() => {
        setForms(prevForms => prevForms.map(f => {
            if (f.id === activeFormId) {
                return {
                    ...f,
                    title: formName,
                    type: formType,
                    orientation: formOrientation,
                    elements: elements
                };
            }
            return f;
        }));
    }, [formName, formType, formOrientation, elements]);


    // --- Form Management Handlers ---

    const handleAddNewForm = () => {
        const newForm: FormDefinition = {
            id: Date.now().toString(),
            title: 'New Untitled Form',
            type: 'General',
            orientation: 'portrait',
            elements: []
        };
        setForms([...forms, newForm]);
        setActiveFormId(newForm.id);
    };

    const handleDeleteForm = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (forms.length <= 1) return; // Prevent deleting last
        const newForms = forms.filter(f => f.id !== id);
        setForms(newForms);
        if (activeFormId === id) {
            setActiveFormId(newForms[0].id);
        }
    };

    // --- Helper to Create/Add Element ---
    const addNewElement = (type: ComponentType, index?: number) => {
        const newId = Date.now().toString();
        const newElement: FormElement = {
            id: newId,
            type,
            label: type === 'header' ? 'Form Header' : type === 'footer' ? 'Form Footer' : type === 'logo' ? 'Company Logo' : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            description: '',
            placeholder: '',
            required: false,
            alignment: 'left',
            options: ['Option 1', 'Option 2'],
            gridConfig: type === 'grid' ? { 
                rows: 3, 
                cols: 3, 
                headers: ['Column 1', 'Column 2', 'Column 3'],
                staticColumns: [] 
            } : undefined
        };

        if (index !== undefined) {
            const newElements = [...elements];
            newElements.splice(index, 0, newElement);
            setElements(newElements);
        } else {
            setElements([...elements, newElement]);
        }
        
        // Open modal immediately for new item
        openEditModal(newElement);
    };

    // --- Drag & Drop Handlers ---
    
    // Form List Drag
    const handleFormDragStart = (e: React.DragEvent, index: number) => {
        setDraggedFormIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('type', 'FORM_SORT');
    };

    const handleFormDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedFormIndex === null || draggedFormIndex === targetIndex) return;
        
        const type = e.dataTransfer.getData('type');
        if (type !== 'FORM_SORT') return;

        const newForms = [...forms];
        const [movedForm] = newForms.splice(draggedFormIndex, 1);
        newForms.splice(targetIndex, 0, movedForm);
        
        setForms(newForms);
        setDraggedFormIndex(null);
    };

    // Toolbox Drag Start
    const handleToolboxDragStart = (e: React.DragEvent, type: ComponentType) => {
        e.dataTransfer.setData('source', 'toolbox');
        e.dataTransfer.setData('componentType', type);
        e.dataTransfer.setData('type', 'COMPONENT_ADD');
    };

    // Canvas Item Drag Start (Reorder)
    const handleItemDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('source', 'canvas');
        e.dataTransfer.setData('type', 'COMPONENT_SORT');
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // Drop on Container (Append new item at end)
    const handleContainerDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        
        if (type === 'COMPONENT_ADD') {
            const componentType = e.dataTransfer.getData('componentType') as ComponentType;
            if (!componentType) return;
            addNewElement(componentType);
        }
    };

    // Drop on Item (Insert/Reorder at specific position)
    const handleItemDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation(); // Stop bubbling to container
        
        const type = e.dataTransfer.getData('type');

        if (type === 'COMPONENT_SORT' && draggedItemIndex !== null) {
            if (draggedItemIndex === targetIndex) return;
            const newElements = [...elements];
            const [movedItem] = newElements.splice(draggedItemIndex, 1);
            newElements.splice(targetIndex, 0, movedItem);
            setElements(newElements);
            setDraggedItemIndex(null);
        } else if (type === 'COMPONENT_ADD') {
            const componentType = e.dataTransfer.getData('componentType') as ComponentType;
            if (!componentType) return;
            addNewElement(componentType, targetIndex);
        }
    };

    const deleteElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setTempElement(null);
        }
    };

    const openEditModal = (element: FormElement) => {
        // Migration check for old static column format to new
        let safeElement = { ...element };
        if (safeElement.type === 'grid' && safeElement.gridConfig) {
            if (!safeElement.gridConfig.staticColumns) {
                // Migrate old rowLabels to new staticColumns format
                const oldLabels = safeElement.gridConfig.rowLabels;
                if (oldLabels && oldLabels.length > 0) {
                    safeElement.gridConfig.staticColumns = [{
                        colIndex: safeElement.gridConfig.labelColumnIndex || 0,
                        content: oldLabels
                    }];
                } else {
                    safeElement.gridConfig.staticColumns = [];
                }
            }
        }

        setTempElement(safeElement);
        setEditingId(element.id);
        
        // Initialize raw inputs for editing
        setRawInputs({
            options: element.options?.join(', ') || '',
            headers: element.gridConfig?.headers?.join(', ') || ''
        });
    };

    const saveElementConfig = () => {
        if (!tempElement || !editingId) return;
        setElements(elements.map(el => el.id === editingId ? tempElement : el));
        setEditingId(null);
        setTempElement(null);
    };

    const handleSaveForm = () => {
        localStorage.setItem('betterfit_forms', JSON.stringify(forms));
        setIsSaveModalOpen(false);
        navigate('/creator-dashboard');
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && tempElement) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempElement({ ...tempElement, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Resizing Handlers ---
    const startResizingLeft = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = leftSidebarWidth;

        const doDrag = (dragEvent: MouseEvent) => {
            const newWidth = Math.max(200, Math.min(600, startWidth + (dragEvent.clientX - startX)));
            setLeftSidebarWidth(newWidth);
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.body.style.cursor = 'default';
        };

        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    const startResizingRight = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = rightSidebarWidth;

        const doDrag = (dragEvent: MouseEvent) => {
            const newWidth = Math.max(200, Math.min(600, startWidth - (dragEvent.clientX - startX)));
            setRightSidebarWidth(newWidth);
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.body.style.cursor = 'default';
        };

        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    // --- Helper for Alignment Classes ---
    const getAlignmentClass = (alignment?: string) => {
        switch (alignment) {
            case 'center': return 'text-center justify-center';
            case 'right': return 'text-right justify-end';
            default: return 'text-left justify-start';
        }
    };

    // --- Preview Render Logic ---
    const renderInputByType = (el: FormElement) => {
        switch(el.type) {
            case 'header':
                return (
                    <div className={`w-full py-4 border-b-2 border-[#01427a] mb-6 flex ${getAlignmentClass(el.alignment)}`}>
                        <div>
                            <h2 className="text-2xl font-bold text-[#01427a] uppercase tracking-wider">{el.label}</h2>
                            {el.description && <p className="text-sm text-[#6c6c6c] mt-1">{el.description}</p>}
                        </div>
                    </div>
                );
            case 'footer':
                return (
                    <div className={`w-full py-4 border-t border-[#afafaf] mt-8 flex ${getAlignmentClass(el.alignment)}`}>
                        <div className="text-xs text-[#6c6c6c]">
                            <p className="font-bold">{el.label}</p>
                            {el.description && <p className="mt-1">{el.description}</p>}
                        </div>
                    </div>
                );
            case 'logo':
                return (
                    <div className={`p-2 flex ${el.alignment === 'center' ? 'justify-center' : el.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <div className="w-16 h-16 bg-slate-200 border border-[#afafaf]/30 rounded flex items-center justify-center overflow-hidden">
                            {el.imageUrl ? <img src={el.imageUrl} alt="Logo" className="w-full h-full object-contain" /> : <ImageIcon className="w-6 h-6 text-[#afafaf]" />}
                        </div>
                    </div>
                );
            case 'text':
                return <input type="text" className="w-full border border-[#afafaf] rounded-lg p-3 focus:border-[#01b3ef] focus:ring-1 focus:ring-[#01b3ef] outline-none transition-colors" placeholder={el.placeholder} />;
            case 'textarea':
                return <textarea rows={4} className="w-full border border-[#afafaf] rounded-lg p-3 focus:border-[#01b3ef] focus:ring-1 focus:ring-[#01b3ef] outline-none transition-colors" placeholder={el.placeholder}></textarea>;
            case 'number':
                return <input type="number" className="w-full border border-[#afafaf] rounded-lg p-3 focus:border-[#01b3ef] outline-none" placeholder={el.placeholder} />;
            case 'date':
                return <input type="date" className="w-full border border-[#afafaf] rounded-lg p-3 focus:border-[#01b3ef] outline-none" />;
            case 'time':
                return <input type="time" className="w-full border border-[#afafaf] rounded-lg p-3 focus:border-[#01b3ef] outline-none" />;
            case 'select':
                return (
                    <select className="w-full border border-[#afafaf] rounded-lg p-3 bg-white focus:border-[#01b3ef] outline-none">
                        <option value="">Select an option...</option>
                        {el.options?.map((opt, i) => <option key={i}>{opt}</option>)}
                    </select>
                );
            case 'radio':
                return (
                    <div className="space-y-3">
                        {el.options?.map((opt, i) => (
                            <label key={i} className="flex items-center cursor-pointer group">
                                <input type="radio" name={el.id} className="mr-3 w-4 h-4 text-[#01b3ef] focus:ring-[#01b3ef]" />
                                <span className="text-sm text-[#0c0c0d] group-hover:text-[#01b3ef] transition-colors">{opt}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'checkbox':
                return (
                    <div className="space-y-3">
                        {el.options?.map((opt, i) => (
                            <label key={i} className="flex items-center cursor-pointer group">
                                <input type="checkbox" className="mr-3 w-4 h-4 text-[#01b3ef] rounded focus:ring-[#01b3ef]" />
                                <span className="text-sm text-[#0c0c0d] group-hover:text-[#01b3ef] transition-colors">{opt}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'grid':
                const staticCols = el.gridConfig?.staticColumns || [];
                return (
                    <div className="overflow-x-auto border border-[#afafaf] rounded">
                        <table className="min-w-full divide-y divide-[#afafaf]/30">
                            <thead className="bg-slate-100">
                                <tr>
                                    {el.gridConfig?.headers.map((h, i) => {
                                        const isStatic = staticCols.some(sc => sc.colIndex === i);
                                        return (
                                            <th key={i} className={`px-3 py-2 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider border-r border-[#afafaf]/30 last:border-r-0 ${isStatic ? 'bg-slate-200 text-[#0c0c0d]' : ''}`}>
                                                {h}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#afafaf]/30">
                                {Array.from({ length: el.gridConfig?.rows || 1 }).map((_, rIndex) => (
                                    <tr key={rIndex}>
                                         {Array.from({ length: el.gridConfig?.cols || 1 }).map((_, cIndex) => {
                                            const staticCol = staticCols.find(sc => sc.colIndex === cIndex);
                                            return (
                                                <td key={cIndex} className={`p-2 border-r border-[#afafaf]/30 last:border-r-0 ${staticCol ? 'bg-slate-50 align-middle px-3 py-2' : ''}`}>
                                                    {staticCol ? (
                                                        <span className="text-xs font-bold text-[#0c0c0d]">
                                                            {staticCol.content[rIndex] || ''}
                                                        </span>
                                                    ) : (
                                                        <input type="text" disabled className="w-full bg-slate-50 border border-[#afafaf]/20 rounded px-2 py-1 text-sm" />
                                                    )}
                                                </td>
                                            );
                                         })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'signature':
                return <div className="h-24 bg-slate-50 border-2 border-dashed border-[#afafaf] rounded flex items-center justify-center text-[#afafaf]">Sign Here</div>;
            case 'image':
            case 'video':
            case 'document':
                return (
                    <div className="h-20 bg-slate-50 border border-[#afafaf] rounded flex items-center justify-center text-[#6c6c6c]">
                        <span className="text-sm">Upload {el.label}</span>
                    </div>
                );
            case 'content':
                return <div className="p-4 bg-[#01b3ef]/10 rounded text-[#01427a] text-sm italic">Static Content / Instructions Placeholder</div>;
            default:
                return null;
        }
    };

    const renderLiveFormElement = (el: FormElement) => {
        // Structural elements might not need standard label wrapping or different handling
        if (el.type === 'header' || el.type === 'footer' || el.type === 'logo') {
             return <div key={el.id}>{renderInputByType(el)}</div>;
        }

        return (
            <div key={el.id} className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {el.type !== 'content' && (
                    <label className="block text-sm font-bold text-[#0c0c0d] mb-2">
                        {el.label} {el.required && <span className="text-[#e14177]">*</span>}
                    </label>
                )}
                {el.description && <p className="text-xs text-[#6c6c6c] mb-2">{el.description}</p>}
                
                {renderInputByType(el)}
            </div>
        );
    };

    const renderComponentPreview = (el: FormElement) => {
       return <div className="pointer-events-none">{renderInputByType(el)}</div>;
    };

    const renderModalContent = () => {
        if (!tempElement) return null;

        return (
            <div className="space-y-4">
                {/* Common Fields */}
                {tempElement.type !== 'logo' && (
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">
                            {tempElement.type === 'header' ? 'Header Text' : tempElement.type === 'footer' ? 'Footer Text' : 'Label'}
                        </label>
                        <input 
                            type="text" 
                            value={tempElement.label}
                            onChange={(e) => setTempElement({ ...tempElement, label: e.target.value })}
                            className="w-full border border-[#afafaf] rounded p-2 focus:border-[#01b3ef] outline-none"
                        />
                    </div>
                )}

                {/* Description - Not for structural */}
                {tempElement.type !== 'header' && tempElement.type !== 'footer' && tempElement.type !== 'logo' && (
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Description / Help Text</label>
                        <input 
                            type="text" 
                            value={tempElement.description || ''}
                            onChange={(e) => setTempElement({ ...tempElement, description: e.target.value })}
                            className="w-full border border-[#afafaf] rounded p-2 focus:border-[#01b3ef] outline-none"
                        />
                    </div>
                )}

                {/* Placeholder - For text inputs */}
                {(tempElement.type === 'text' || tempElement.type === 'textarea' || tempElement.type === 'number') && (
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Placeholder</label>
                        <input 
                            type="text" 
                            value={tempElement.placeholder || ''}
                            onChange={(e) => setTempElement({ ...tempElement, placeholder: e.target.value })}
                            className="w-full border border-[#afafaf] rounded p-2 focus:border-[#01b3ef] outline-none"
                        />
                    </div>
                )}

                {/* Required Toggle */}
                {tempElement.type !== 'header' && tempElement.type !== 'footer' && tempElement.type !== 'logo' && tempElement.type !== 'content' && (
                    <div className="flex items-center mt-2">
                        <input 
                            type="checkbox" 
                            checked={tempElement.required || false}
                            onChange={(e) => setTempElement({ ...tempElement, required: e.target.checked })}
                            className="w-4 h-4 text-[#01b3ef] rounded mr-2"
                        />
                        <label className="text-sm font-medium text-[#0c0c0d]">Required Field</label>
                    </div>
                )}

                {/* Options for Select/Radio/Checkbox */}
                {(tempElement.type === 'select' || tempElement.type === 'radio' || tempElement.type === 'checkbox') && (
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Options (Comma separated)</label>
                        <textarea 
                            rows={3}
                            value={rawInputs.options}
                            onChange={(e) => {
                                setRawInputs({ ...rawInputs, options: e.target.value });
                                setTempElement({ ...tempElement, options: e.target.value.split(',').map(s => s.trim()) });
                            }}
                            className="w-full border border-[#afafaf] rounded p-2 focus:border-[#01b3ef] outline-none"
                        ></textarea>
                    </div>
                )}

                {/* Grid Configuration */}
                {tempElement.type === 'grid' && tempElement.gridConfig && (
                    <div className="space-y-4 border-t border-[#afafaf]/20 pt-4 mt-2">
                        <h4 className="font-bold text-[#0c0c0d]">Grid Configuration</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] mb-1">Rows</label>
                                <input 
                                    type="number" 
                                    value={tempElement.gridConfig.rows}
                                    onChange={(e) => setTempElement({ 
                                        ...tempElement, 
                                        gridConfig: { ...tempElement.gridConfig!, rows: parseInt(e.target.value) || 1 } 
                                    })}
                                    className="w-full border border-[#afafaf] rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#6c6c6c] mb-1">Columns</label>
                                <input 
                                    type="number" 
                                    value={tempElement.gridConfig.cols}
                                    onChange={(e) => setTempElement({ 
                                        ...tempElement, 
                                        gridConfig: { ...tempElement.gridConfig!, cols: parseInt(e.target.value) || 1 } 
                                    })}
                                    className="w-full border border-[#afafaf] rounded p-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#6c6c6c] mb-1">Column Headers (Comma separated)</label>
                            <input 
                                type="text"
                                value={rawInputs.headers}
                                onChange={(e) => {
                                    setRawInputs({ ...rawInputs, headers: e.target.value });
                                    setTempElement({ 
                                        ...tempElement, 
                                        gridConfig: { ...tempElement.gridConfig!, headers: e.target.value.split(',').map(s => s.trim()) } 
                                    });
                                }}
                                className="w-full border border-[#afafaf] rounded p-2"
                            />
                        </div>
                    </div>
                )}

                {/* Alignment for Structural */}
                {(tempElement.type === 'header' || tempElement.type === 'footer' || tempElement.type === 'logo') && (
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Alignment</label>
                        <div className="flex bg-slate-100 rounded p-1 border border-[#afafaf]/30">
                            {['left', 'center', 'right'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => setTempElement({ ...tempElement, alignment: align as any })}
                                    className={`flex-1 py-1 text-xs capitalize rounded ${tempElement.alignment === align ? 'bg-white shadow-sm text-[#01427a] font-bold' : 'text-[#6c6c6c]'}`}
                                >
                                    {align}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Logo Upload */}
                {tempElement.type === 'logo' && (
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">Logo Image</label>
                        <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer bg-slate-50 border border-[#afafaf] rounded p-2 text-center hover:bg-slate-100">
                                <span className="text-sm text-[#0c0c0d] flex items-center justify-center">
                                    <Upload className="w-4 h-4 mr-2" /> Upload
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            </label>
                            {tempElement.imageUrl && (
                                <div className="w-10 h-10 border rounded overflow-hidden">
                                    <img src={tempElement.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-[#afafaf] mt-1">Recommended: 300x300px Max</p>
                    </div>
                )}
            </div>
        );
    };

    // --- PREVIEW MODE VIEW ---
    if (isPreviewMode) {
        // Landscape forms get wider container
        const containerClass = formOrientation === 'landscape' ? 'max-w-7xl' : 'max-w-3xl';

        return (
            <div className="min-h-screen bg-slate-100 flex flex-col fixed inset-0 z-[100] overflow-hidden">
                {/* Preview Header */}
                <div className="bg-[#01427a] text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
                    <div>
                         <div className="flex items-center space-x-2 mb-1">
                             <span className="bg-[#6dcffb]/20 border border-[#6dcffb]/30 text-[#6dcffb] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center">
                                 <Eye className="w-3 h-3 mr-1" /> Preview Mode
                             </span>
                             <span className="text-white/60 text-xs font-mono">Simulating User View ({formOrientation})</span>
                         </div>
                         <h1 className="text-xl font-bold flex items-center">
                             {formName} <span className="text-sm font-normal text-white/50 ml-3">({formType})</span>
                         </h1>
                    </div>
                    <button 
                        onClick={() => setIsPreviewMode(false)}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center transition-colors border border-white/20"
                    >
                        <X className="w-4 h-4 mr-2" /> Close Preview
                    </button>
                </div>

                {/* Preview Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-slate-200">
                    <div className={`${containerClass} mx-auto bg-white rounded-xl shadow-2xl border border-[#afafaf]/20 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500`}>
                        {/* Form Header (Default) */}
                        <div className="bg-slate-50 p-8 border-b border-[#afafaf]/30 text-center relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-2 bg-[#01b3ef]"></div>
                            <h2 className="text-3xl font-extrabold text-[#0c0c0d] mb-2">{formName}</h2>
                            <p className="text-[#6c6c6c]">Please complete all required fields below.</p>
                        </div>
                        
                        {/* Form Content */}
                        <div className="p-10 space-y-4">
                             {elements.length === 0 ? (
                                 <div className="text-center py-16 text-[#afafaf] italic border-2 border-dashed border-[#afafaf]/20 rounded-xl bg-slate-50">
                                     <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                     <p>This form has no elements yet.</p>
                                     <button onClick={() => setIsPreviewMode(false)} className="text-[#01b3ef] font-bold text-sm hover:underline mt-2">Go back to builder</button>
                                 </div>
                             ) : (
                                 elements.map(renderLiveFormElement)
                             )}
                        </div>

                        {/* Form Footer (Default) */}
                        <div className="p-8 bg-slate-50 border-t border-[#afafaf]/30 flex justify-between items-center">
                             <span className="text-xs text-[#afafaf] italic">Preview only - No data will be saved</span>
                             <button disabled className="bg-[#01b3ef] text-white px-8 py-3 rounded-lg font-bold opacity-70 cursor-not-allowed shadow-sm">
                                 Submit Form
                             </button>
                        </div>
                    </div>
                    <div className={`${containerClass} mx-auto text-center mt-8 text-[#6c6c6c] text-xs`}>
                        Powered by BETTERFIT LMS Form Engine
                    </div>
                </div>
            </div>
        )
    }

    // --- MAIN BUILDER VIEW ---
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col fixed inset-0 z-50">
            
            {/* Header Navigation */}
            <div className="h-16 bg-white border-b border-[#afafaf]/30 flex items-center justify-between px-6 shrink-0 z-40 shadow-sm relative">
                <div className="flex items-center">
                    <button 
                        onClick={() => setIsExitModalOpen(true)}
                        className="mr-4 text-[#6c6c6c] hover:text-[#01427a] transition-colors p-2 hover:bg-slate-50 rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-[#0c0c0d] leading-none">Form Editor</h1>
                        <span className="text-xs text-[#6c6c6c]">Build submissions, feedback surveys, and IQA reports</span>
                    </div>
                </div>

                {/* Center Form Title */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 max-w-md">
                     <div className="flex items-center justify-center">
                         <input 
                            type="text" 
                            value={formName} 
                            onChange={(e) => setFormName(e.target.value)}
                            className="text-center font-bold text-[#0c0c0d] bg-transparent border-b border-transparent hover:border-[#afafaf] focus:border-[#01b3ef] focus:ring-0 p-1 w-full truncate transition-colors text-lg"
                            placeholder="Untitled Form"
                        />
                     </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Orientation Toggle */}
                    <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 border border-[#afafaf]/30">
                        <button 
                            onClick={() => setFormOrientation('portrait')}
                            className={`flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all ${formOrientation === 'portrait' ? 'bg-white text-[#01427a] shadow-sm' : 'text-[#6c6c6c] hover:text-[#0c0c0d]'}`}
                            title="Portrait Layout"
                        >
                            <div className="w-3 h-4 border-2 border-current rounded-[1px] mr-2"></div>
                            Portrait
                        </button>
                        <button 
                            onClick={() => setFormOrientation('landscape')}
                            className={`flex items-center px-3 py-1.5 rounded-md text-xs font-bold transition-all ${formOrientation === 'landscape' ? 'bg-white text-[#01427a] shadow-sm' : 'text-[#6c6c6c] hover:text-[#0c0c0d]'}`}
                            title="Landscape Layout"
                        >
                            <div className="w-4 h-3 border-2 border-current rounded-[1px] mr-2"></div>
                            Landscape
                        </button>
                    </div>

                    <div className="h-6 w-px bg-[#afafaf]/30 hidden md:block"></div>

                    <button 
                        onClick={() => setIsPreviewMode(true)}
                        className="flex items-center px-4 py-2 bg-white border border-[#afafaf] text-[#6c6c6c] rounded-lg hover:bg-slate-50 font-bold text-sm transition-colors"
                    >
                        <Eye className="w-4 h-4 mr-2" /> Preview
                    </button>
                    <button onClick={() => setIsSaveModalOpen(true)} className="flex items-center px-4 py-2 bg-[#01b3ef] text-white rounded-lg hover:bg-[#01427a] font-bold text-sm shadow-md transition-colors">
                        <Save className="w-4 h-4 mr-2" /> Save Form
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                
                {/* COLUMN 1: FORM MANAGER (SIDEBAR) */}
                <div 
                    className="bg-white border-r border-[#afafaf]/30 flex flex-col shrink-0 z-10 relative"
                    style={{ width: leftSidebarWidth }}
                >
                    <div className="p-4 border-b border-[#afafaf]/20 flex justify-between items-center bg-slate-50">
                        <div>
                            <h3 className="text-xs font-bold text-[#6c6c6c] uppercase tracking-wider flex items-center">
                                <Layers className="w-4 h-4 mr-2" /> Form List
                            </h3>
                            <p className="text-[10px] text-[#afafaf] mt-0.5">Select to edit or reorder</p>
                        </div>
                        <button 
                            onClick={handleAddNewForm}
                            className="p-1.5 bg-[#01b3ef] text-white rounded hover:bg-[#01427a] transition-colors"
                            title="Add New Form"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {forms.map((form, index) => (
                            <div 
                                key={form.id}
                                draggable
                                onDragStart={(e) => handleFormDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleFormDrop(e, index)}
                                onClick={() => setActiveFormId(form.id)}
                                className={`group relative flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                    activeFormId === form.id 
                                    ? 'bg-[#01b3ef]/5 border-[#01b3ef] shadow-sm' 
                                    : 'bg-white border-[#afafaf]/30 hover:border-[#01b3ef]/50'
                                }`}
                            >
                                <div className="mr-3 text-[#afafaf] cursor-grab active:cursor-grabbing hover:text-[#0c0c0d]">
                                    <GripVertical className="w-4 h-4" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className={`text-sm font-bold truncate ${activeFormId === form.id ? 'text-[#01427a]' : 'text-[#0c0c0d]'}`}>
                                        {form.title || 'Untitled Form'}
                                    </h4>
                                    <span className="text-[10px] text-[#6c6c6c] bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1">
                                        {form.type}
                                    </span>
                                </div>
                                
                                {forms.length > 1 && (
                                    <button 
                                        onClick={(e) => handleDeleteForm(e, form.id)}
                                        className="ml-2 p-1.5 text-[#afafaf] hover:text-[#e14177] hover:bg-[#e14177]/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Resizer Handle */}
                    <div 
                        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#01b3ef] z-10 transition-colors"
                        onMouseDown={startResizingLeft}
                    ></div>
                </div>

                {/* COLUMN 2: CANVAS (DROP ZONE) */}
                <div 
                    className="flex-1 flex flex-col bg-slate-100 overflow-hidden relative"
                    onDragOver={handleDragOver}
                    onDrop={handleContainerDrop}
                >
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className={`mx-auto bg-white min-h-[800px] shadow-lg rounded-xl p-8 border border-[#afafaf]/20 transition-all duration-300 ${formOrientation === 'landscape' ? 'max-w-[1000px]' : 'max-w-3xl'}`}>
                            {elements.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-[#afafaf] border-2 border-dashed border-[#afafaf]/30 rounded-xl p-12">
                                    <FileText className="w-12 h-12 mb-3 opacity-30" />
                                    <p className="text-lg font-bold mb-2">Your form is empty</p>
                                    <p className="text-sm">Drag and drop components from the right menu to build your form.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {elements.map((el, index) => {
                                        const isStructural = ['header', 'footer', 'logo'].includes(el.type);
                                        return (
                                            <div 
                                                key={el.id} 
                                                draggable
                                                onDragStart={(e) => handleItemDragStart(e, index)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleItemDrop(e, index)}
                                                className={`relative group border border-transparent hover:border-[#01b3ef] hover:shadow-sm rounded-lg ${isStructural ? 'p-2' : 'p-4'} transition-all bg-white cursor-pointer ${draggedItemIndex === index ? 'opacity-50 border-dashed border-[#01b3ef]' : ''}`}
                                                onClick={() => openEditModal(el)}
                                            >
                                                {!isStructural && (
                                                    <div className="flex justify-between items-start mb-2">
                                                        <label className="block text-sm font-bold text-[#0c0c0d]">
                                                            {el.label} {el.required && <span className="text-red-500">*</span>}
                                                        </label>
                                                        <div className="opacity-0 group-hover:opacity-100 flex items-center bg-white shadow-sm border border-[#afafaf]/30 rounded">
                                                            <GripVertical className="w-6 h-6 p-1 text-[#afafaf] cursor-move" />
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                                                                className="p-1 hover:text-[#e14177]"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {isStructural && (
                                                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 flex items-center bg-white shadow-sm border border-[#afafaf]/30 rounded p-1">
                                                        <GripVertical className="w-4 h-4 text-[#afafaf] cursor-move mr-1" />
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }}
                                                            className="hover:text-[#e14177]"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}

                                                {el.description && !isStructural && <p className="text-xs text-[#6c6c6c] mb-2">{el.description}</p>}
                                                
                                                {renderComponentPreview(el)}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* COLUMN 3: TOOLBOX (COMPONENTS) */}
                <div 
                    className="bg-white border-l border-[#afafaf]/30 flex flex-col shadow-lg z-20 relative"
                    style={{ width: rightSidebarWidth }}
                >
                    {/* Resizer Handle */}
                    <div 
                        className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-[#01b3ef] z-10 transition-colors"
                        onMouseDown={startResizingRight}
                    ></div>

                    <div className="p-4 border-b border-[#afafaf]/30 bg-slate-50">
                        <h2 className="font-bold text-[#0c0c0d] flex items-center">
                            <PenTool className="w-4 h-4 mr-2 text-[#01427a]" /> Components
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {['Structure', 'Basic', 'Media', 'Advanced'].map(category => (
                            <div key={category} className="mb-6">
                                <p className="text-xs text-[#afafaf] uppercase font-bold mb-3 tracking-wider">{category}</p>
                                <div className="space-y-2">
                                    {TOOLBOX_ITEMS.filter(item => item.category === category).map(item => (
                                        <div 
                                            key={item.type}
                                            draggable
                                            onDragStart={(e) => handleToolboxDragStart(e, item.type)}
                                            className={`flex items-center p-3 bg-white border border-[#afafaf]/50 rounded cursor-move hover:shadow-sm transition-all ${item.type === 'grid' ? 'border-l-4 border-l-[#e14177]' : item.category === 'Structure' ? 'border-l-4 border-l-[#01427a]' : 'hover:border-[#01b3ef] hover:text-[#01b3ef]'}`}
                                        >
                                            <item.icon className={`w-4 h-4 mr-3 ${item.type === 'grid' ? 'text-[#e14177]' : item.category === 'Structure' ? 'text-[#01427a]' : ''}`} />
                                            <span className={`text-sm font-medium ${item.type === 'grid' || item.category === 'Structure' ? 'text-[#0c0c0d] font-bold' : ''}`}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* CONFIG MODAL */}
            {editingId && tempElement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-[#01427a] px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">Configure Component</h2>
                            <button onClick={() => { setEditingId(null); setTempElement(null); }} className="text-white/70 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {renderModalContent()}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-[#afafaf]/30 flex justify-end gap-2">
                             <button 
                                onClick={() => { setEditingId(null); setTempElement(null); }}
                                className="px-4 py-2 border border-[#afafaf] text-[#6c6c6c] rounded font-bold hover:bg-white"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={saveElementConfig}
                                className="px-4 py-2 bg-[#01b3ef] text-white rounded font-bold hover:bg-[#01427a]"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SAVE FORM METADATA MODAL */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                     <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-[#01427a] px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white flex items-center">
                                <Save className="w-5 h-5 mr-2" /> Save Form
                            </h2>
                            <button onClick={() => setIsSaveModalOpen(false)} className="text-white/70 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Form Title</label>
                                <input 
                                    type="text" 
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="w-full border border-[#afafaf] rounded p-2 focus:border-[#01b3ef] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#6c6c6c] mb-1">Category / Type</label>
                                <select 
                                    value={formType}
                                    onChange={(e) => setFormType(e.target.value)}
                                    className="w-full border border-[#afafaf] rounded p-2 focus:border-[#01b3ef] outline-none bg-white"
                                >
                                    <option value="General">General</option>
                                    <option value="Moderation">Moderation / IQA</option>
                                    <option value="Feedback">Learner Feedback</option>
                                    <option value="Administrative">Administrative</option>
                                    <option value="Submission">Submission</option>
                                </select>
                                <p className="text-xs text-[#6c6c6c] mt-1">
                                    Forms marked as <strong>Moderation / IQA</strong> will appear in the Moderator's Sampling View.
                                </p>
                            </div>
                        </div>
                         <div className="p-4 bg-slate-50 border-t border-[#afafaf]/30 flex justify-end gap-2">
                             <button 
                                onClick={() => setIsSaveModalOpen(false)}
                                className="px-4 py-2 border border-[#afafaf] text-[#6c6c6c] rounded font-bold hover:bg-white"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveForm}
                                className="px-4 py-2 bg-[#01b3ef] text-white rounded font-bold hover:bg-[#01427a]"
                            >
                                Confirm Save
                            </button>
                        </div>
                     </div>
                </div>
            )}

            {/* EXIT WARNING MODAL */}
            {isExitModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-[#e14177] px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2" /> Unsaved Changes
                            </h2>
                            <button onClick={() => setIsExitModalOpen(false)} className="text-white/70 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-[#0c0c0d] font-medium text-lg mb-2">Do you want to save first before returning?</p>
                            <p className="text-[#6c6c6c] text-sm">Otherwise, you'll lose your form progress.</p>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-[#afafaf]/30 flex justify-end gap-2 flex-wrap">
                            <button 
                                onClick={() => setIsExitModalOpen(false)}
                                className="px-4 py-2 border border-[#afafaf] text-[#6c6c6c] rounded font-bold hover:bg-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => navigate('/creator-dashboard')}
                                className="px-4 py-2 bg-red-100 text-red-700 border border-red-200 rounded font-bold hover:bg-red-200 transition-colors"
                            >
                                Exit Without Saving
                            </button>
                            <button 
                                onClick={() => {
                                    setIsExitModalOpen(false);
                                    setIsSaveModalOpen(true);
                                }}
                                className="px-4 py-2 bg-[#01b3ef] text-white rounded font-bold hover:bg-[#01427a] transition-colors shadow-sm"
                            >
                                Save & Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormBuilder;
