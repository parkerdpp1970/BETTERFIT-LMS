
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import IQAReportForm from './IQAReportForm';

const IQAReportStandalone: React.FC = () => {
    const [searchParams] = useSearchParams();
    const learnerId = searchParams.get('learnerId') || '';

    const handleClose = () => {
        window.close();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Minimal Header for Standalone View */}
            <div className="bg-[#01427a] h-2 w-full shrink-0"></div>
            
            <div className="flex-1 max-w-5xl mx-auto w-full bg-white shadow-xl my-0 md:my-8 md:rounded-xl overflow-hidden flex flex-col">
                <IQAReportForm 
                    learnerId={learnerId} 
                    onSubmit={() => {
                        // In standalone mode, maybe close window after submit or show success
                        setTimeout(() => window.close(), 3000);
                    }}
                    actions={
                        <button 
                            onClick={handleClose}
                            className="text-xs font-bold text-[#6c6c6c] hover:text-[#e14177] border border-[#afafaf] px-3 py-1.5 rounded bg-white"
                        >
                            Close Window
                        </button>
                    }
                />
            </div>
        </div>
    );
};

export default IQAReportStandalone;
