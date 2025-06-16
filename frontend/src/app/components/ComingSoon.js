import { AlertCircle, Clock1 } from 'lucide-react'
import React from 'react'

const ComingSoon = ({featureName, featureDescription, isDarkMode}) => {
  return (
    <div className={`
      p-6 rounded-xl border
      ${isDarkMode 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-white border-slate-200'
      }
    `}>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className={`
          mb-4 p-4 rounded-full
          ${isDarkMode 
            ? 'bg-slate-700 text-blue-400' 
            : 'bg-slate-100 text-blue-600'
          }
        `}>
          <Clock1 className="h-8 w-8" />
        </div>
        
        <h3 className={`
          text-xl font-semibold mb-2
          ${isDarkMode ? 'text-white' : 'text-slate-900'}
        `}>
          {featureName}
        </h3>
        
        <p className={`
          max-w-md mx-auto text-sm
          ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}
        `}>
          {featureDescription}
        </p>
        
        <div className={`
          mt-6 px-4 py-2 rounded-lg text-sm
          ${isDarkMode 
            ? 'bg-slate-700 text-slate-300' 
            : 'bg-slate-100 text-slate-600'
          }
        `}>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Check back soon for updates</span>
          </div>
        </div>
      </div>
    </div>);
}

export default ComingSoon


