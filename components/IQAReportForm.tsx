
import React, { useState, useEffect } from 'react';
import { FileCheck, Send, ChevronDown, Image as ImageIcon, Box } from 'lucide-react';

interface IQAReportFormProps {
    learnerId?: string;
    onSubmit: () => void;
    actions?: React.ReactNode;
    className?: string;
}

const IQAReportForm: React.FC<IQAReportFormProps> = ({ learnerId, onSubmit, actions, className = '' }) => {
    const [availableForms, setAvailableForms] = useState<any[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<string>('');
    const [decision, setDecision] = useState('Pass');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Load Moderation Forms from LocalStorage
        const stored = localStorage.getItem('betterfit_forms');
        if (stored) {
            const allForms = JSON.parse(stored);
            const moderationForms = allForms.filter((f: any) => f.type === 'Moderation');
            setAvailableForms(moderationForms);
            if (moderationForms.length > 0) {
                setSelectedFormId(moderationForms[0].id);
            }
        }
    }, []);

    const selectedForm = availableForms.find(f => f.id === selectedFormId);
    
    // Determine content width based on orientation
    const contentMaxWidthClass = selectedForm?.orientation === 'landscape' ? 'max-w-7xl' : 'max-w-4xl';

    const handleSubmit = () => {
        setIsSubmitted(true);
        setTimeout(() => {
            onSubmit();
        }, 2000);
    };

    // Helper for Alignment Classes (reused from builder concept)
    const getAlignmentClass = (alignment?: string) => {
        switch (alignment) {
            case 'center': return 'text-center justify-center';
            case 'right': return 'text-right justify-end';
            default: return 'text-left justify-start';
        }
    };

    // --- Dynamic Form Renderer ---
    const renderDynamicForm = () => {
        if (!selectedForm || !selectedForm.elements) {
            return <div className="p-8 text-center text-[#afafaf] italic border border-dashed border-[#afafaf]/30 rounded-lg">Select a template above to load the report form.</div>;
        }

        return selectedForm.elements.map((el: any) => {
            
            // SPECIAL RENDER FOR STRUCTURAL ELEMENTS
            if (el.type === 'header') {
                return (
                    <div key={el.id} className={`w-full py-4 border-b-2 border-[#01427a] mb-6 flex ${getAlignmentClass(el.alignment)} animate-in fade-in duration-300 sticky top-0 bg-white z-20 shadow-sm`}>
                        <div>
                            <h2 className="text-2xl font-bold text-[#01427a] uppercase tracking-wider">{el.label}</h2>
                            {el.description && <p className="text-sm text-[#6c6c6c] mt-1">{el.description}</p>}
                        </div>
                    </div>
                );
            }
            if (el.type === 'footer') {
                return (
                    <div key={el.id} className={`w-full py-4 border-t border-[#afafaf] mt-auto flex ${getAlignmentClass(el.alignment)} animate-in fade-in duration-300 sticky bottom-0 bg-white z-20`}>
                        <div className="text-xs text-[#6c6c6c]">
                            <p className="font-bold">{el.label}</p>
                            {el.description && <p className="mt-1">{el.description}</p>}
                        </div>
                    </div>
                );
            }
            if (el.type === 'logo') {
                return (
                    <div key={el.id} className={`w-full flex ${getAlignmentClass(el.alignment)} mb-2 animate-in fade-in duration-300`}>
                        <div className="max-w-[300px] max-h-[300px] overflow-hidden">
                            {el.imageUrl ? (
                                <img src={el.imageUrl} alt="Logo" className="w-full h-full object-contain max-w-[300px] max-h-[300px]" />
                            ) : (
                                <Box className="w-8 h-8 text-[#afafaf]" />
                            )}
                        </div>
                    </div>
                );
            }

            // STANDARD FIELDS
            return (
            <div key={el.id} className="mb-4 animate-in fade-in duration-300">
                <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-1">
                    {el.label} {el.required && <span className="text-[#e14177]">*</span>}
                </label>
                
                {el.type === 'text' && (
                    <input type="text" className="w-full border border-[#afafaf] rounded p-2 focus:border-[#01b3ef]" placeholder={el.placeholder} />
                )}
                
                {el.type === 'textarea' && (
                    <textarea rows={3} className="w-full border border-[#afafaf] rounded p-2 focus:border-[#01b3ef]" placeholder={el.placeholder}></textarea>
                )}

                {el.type === 'number' && (
                    <input type="number" className="w-full border border-[#afafaf] rounded p-2 focus:border-[#01b3ef]" />
                )}

                {el.type === 'select' && (
                    <select className="w-full border border-[#afafaf] rounded p-2 bg-white">
                        {el.options?.map((opt: string, i: number) => <option key={i}>{opt}</option>)}
                    </select>
                )}

                {el.type === 'radio' && (
                    <div className="flex flex-col gap-1">
                        {el.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center text-sm">
                                <input type="radio" name={el.id} className="mr-2" /> {opt}
                            </label>
                        ))}
                    </div>
                )}
                
                {el.type === 'checkbox' && (
                    <div className="flex flex-col gap-1">
                        {el.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center text-sm">
                                <input type="checkbox" className="mr-2" /> {opt}
                            </label>
                        ))}
                    </div>
                )}

                {/* RENDER GRID COMPONENT FOR INPUT */}
                {el.type === 'grid' && el.gridConfig && (
                     <div className="overflow-x-auto border border-[#afafaf] rounded mt-2">
                          <table className="min-w-full divide-y divide-[#afafaf]/30">
                              <thead className="bg-slate-100">
                                  <tr>
                                      {el.gridConfig.headers.map((h: string, i: number) => {
                                          const staticCols = el.gridConfig.staticColumns || [];
                                          // Support old data format (rowLabels) for backward compatibility
                                          if (el.gridConfig.rowLabels && el.gridConfig.rowLabels.length > 0 && !el.gridConfig.staticColumns) {
                                              staticCols.push({ colIndex: el.gridConfig.labelColumnIndex || 0, content: el.gridConfig.rowLabels });
                                          }
                                          const isStatic = staticCols.some((sc: any) => sc.colIndex === i);
                                          
                                          return (
                                              <th key={i} className={`px-3 py-2 text-left text-xs font-bold text-[#6c6c6c] uppercase tracking-wider border-r border-[#afafaf]/30 last:border-r-0 ${isStatic ? 'bg-slate-200 text-[#0c0c0d]' : ''}`}>
                                                  {h}
                                              </th>
                                          );
                                      })}
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-[#afafaf]/30">
                                  {Array.from({ length: el.gridConfig.rows }).map((_, rIndex) => (
                                      <tr key={rIndex}>
                                           {Array.from({ length: el.gridConfig.cols }).map((_, cIndex) => {
                                               const staticCols = el.gridConfig.staticColumns || [];
                                               // Backward compatibility
                                               if (el.gridConfig.rowLabels && el.gridConfig.rowLabels.length > 0 && !el.gridConfig.staticColumns) {
                                                   staticCols.push({ colIndex: el.gridConfig.labelColumnIndex || 0, content: el.gridConfig.rowLabels });
                                               }
                                               const staticCol = staticCols.find((sc: any) => sc.colIndex === cIndex);

                                               return (
                                                  <td key={cIndex} className={`p-2 border-r border-[#afafaf]/30 last:border-r-0 ${staticCol ? 'bg-slate-50 align-middle px-3 py-2' : ''}`}>
                                                      {staticCol ? (
                                                          <span className="text-sm font-bold text-[#0c0c0d]">
                                                              {staticCol.content[rIndex] || ''}
                                                          </span>
                                                      ) : (
                                                          <textarea rows={1} className="w-full bg-slate-50 border border-[#afafaf]/20 rounded px-2 py-1 text-sm focus:bg-white focus:border-[#01b3ef] resize-none overflow-hidden" placeholder="..." />
                                                      )}
                                                  </td>
                                               );
                                           })}
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                     </div>
                )}
                
                {el.description && <p className="text-xs text-[#afafaf] mt-1">{el.description}</p>}
            </div>
        )});
    };

    if (isSubmitted) {
        return (
            <div className="h-full flex items-center justify-center bg-white">
                <div className="p-12 text-center max-w-md w-full animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0c0c0d] mb-2">Report Sent!</h2>
                    <p className="text-[#6c6c6c] mb-6">The IQA Sampling report has been successfully submitted to the assessor.</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full bg-white ${className}`}>
            {/* Header */}
            <div className="p-8 border-b border-[#afafaf]/30 shrink-0 flex justify-between items-start bg-white">
                <div className="flex flex-col">
                     <h1 className="text-3xl font-extrabold text-[#0c0c0d] flex items-center tracking-tight leading-tight">
                         <FileCheck className="w-8 h-8 mr-3 text-[#01b3ef]" />
                         IQA Sampling Report
                     </h1>
                </div>
                
                {/* Header Actions (Expand, Popout, etc) */}
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                
                {/* Max Width Wrapper based on Orientation */}
                <div className={`${contentMaxWidthClass} mx-auto space-y-8 flex flex-col min-h-full`}>
                    
                    {/* Template Selector */}
                    <div>
                        <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Select Reporting Template</label>
                        <div className="relative">
                          <select 
                              value={selectedFormId}
                              onChange={(e) => setSelectedFormId(e.target.value)}
                              className="w-full border-2 border-[#01b3ef]/20 rounded-lg p-3 bg-white text-sm font-medium focus:ring-2 focus:ring-[#01b3ef] focus:border-[#01b3ef] cursor-pointer"
                          >
                              {availableForms.length > 0 ? (
                                  availableForms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)
                              ) : (
                                  <option value="">No templates available</option>
                              )}
                          </select>
                           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#afafaf] pointer-events-none" />
                        </div>
                        <p className="text-xs text-[#afafaf] mt-2 italic">
                            Templates are managed in the Creator Studio. Select the appropriate form for your department.
                        </p>
                    </div>

                    {/* Dynamic Form Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedFormId && (
                            <div className="py-2 border-t border-b border-[#afafaf]/20 mb-4 flex justify-between items-center">
                                 <h3 className="text-sm font-bold text-[#01427a]">{selectedForm?.title}</h3>
                                 <span className="text-[10px] text-[#afafaf] font-bold uppercase border border-[#afafaf]/30 px-2 py-0.5 rounded">
                                     {selectedForm?.orientation || 'Portrait'} Layout
                                 </span>
                            </div>
                        )}
                        {renderDynamicForm()}
                    </div>

                    {/* Footer Decision */}
                    <div className="pt-8 border-t border-[#afafaf]/30 mt-auto">
                         <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2 tracking-wider">Final Sampling Decision</label>
                         <select 
                              className={`w-full border-2 rounded-lg p-4 bg-white font-bold text-[#0c0c0d] focus:ring-2 text-lg outline-none transition-all ${
                                  decision === 'Pass' 
                                  ? 'border-green-500 focus:border-green-600 focus:ring-green-100' 
                                  : 'border-[#e14177] focus:border-[#c03060] focus:ring-red-100'
                              }`}
                              value={decision}
                              onChange={(e) => setDecision(e.target.value)}
                         >
                             <option value="Pass">Agreed with Decision (Pass)</option>
                             <option value="Refer">Refer back to Assessor</option>
                         </select>
                    </div>
                    
                    <button 
                          onClick={handleSubmit}
                          disabled={!learnerId}
                          className={`w-full py-4 rounded-lg font-bold shadow-lg flex items-center justify-center transition-all transform hover:-translate-y-0.5 ${learnerId ? 'bg-[#01b3ef] text-white hover:bg-[#01427a]' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                     >
                         Submit Report to Assessor <Send className="w-5 h-5 ml-2" />
                     </button>
                </div>

            </div>
        </div>
    );
};

export default IQAReportForm;
