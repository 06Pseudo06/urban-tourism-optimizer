import { useState } from 'react';

const HeroInput = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    start_date: '',
    end_date: '',
    start_time: '09:00',
    end_time: '21:00',
    start_location: '',
    end_location: '',
    budget: 'mid',
    travel_type: 'couple',
    interests: [],
  });

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = ['Culture', 'Nature', 'Food', 'History', 'Shopping', 'Nightlife'];

  const validateStep = (currentStep) => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.destination.trim()) {
        setErrorMsg('Destination is required.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.days || formData.days < 1 || formData.days > 14) {
        setErrorMsg('Please enter a valid number of days (1-14).');
        return false;
      }
      if (formData.start_date && !formData.end_date) {
        setErrorMsg('End Date is required if Start Date is provided.');
        return false;
      }
      if (formData.start_date && formData.end_date) {
        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
           setErrorMsg('End Date must be after Start Date.');
           return false;
        }
        // Approximate day match validation
        const diffTime = Math.abs(new Date(formData.end_date) - new Date(formData.start_date));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (formData.days !== diffDays && diffDays > 0) {
           setErrorMsg(`Number of days (${formData.days}) does not match the date range (${diffDays} days).`);
           return false;
        }
      }
      const sTime = formData.start_time.split(':').map(Number);
      const eTime = formData.end_time.split(':').map(Number);
      const sMins = sTime[0] * 60 + sTime[1];
      const eMins = eTime[0] * 60 + eTime[1];
      
      if (eMins <= sMins) {
        setErrorMsg('End time must be after start time.');
        return false;
      }
      if ((eMins - sMins) < 240) {
        setErrorMsg('Please provide a minimum 4-hour window per day.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, 4));
    }
  };
  const handlePrev = () => {
    setErrorMsg('');
    setStep(s => Math.max(s - 1, 1));
  };
  
  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateStep(4) || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const cleanPayload = Object.fromEntries(
        Object.entries(formData).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      );
      cleanPayload.interests = Array.isArray(formData.interests) ? formData.interests : [];
      
      await onSubmit(cleanPayload);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }; 

  const toggleInterest = (i) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(i) 
        ? prev.interests.filter(x => x !== i) 
        : [...prev.interests, i]
    }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-2 p-6 sm:p-10">
      
      <div className="mb-8">
        <h2 className="text-3xl tracking-tight font-semibold mb-2 text-white">Design your dream trip</h2>
        <p className="text-slate-400 font-medium">Step {step} of 4</p>
        <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
           <div className={`h-full bg-blue-600 transition-all duration-500`} style={{width: `${(step/4)*100}%`}}></div>
        </div>
        {errorMsg && <p className="text-red-500 font-medium text-sm mt-3">{errorMsg}</p>}
      </div>

      <form onSubmit={submitForm}>
        
        {/* STEP 1: Destination */}
        <div className={`space-y-8 ${step === 1 ? 'block' : 'hidden'}`}>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Where to? <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              placeholder="e.g. Tokyo, Paris, New York"
              className="input-dark text-lg"
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Start Location (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. My Hotel name or Airport"
              className="input-dark"
              value={formData.start_location}
              onChange={e => setFormData({...formData, start_location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">End Location (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Airport or Train Station"
              className="input-dark"
              value={formData.end_location}
              onChange={e => setFormData({...formData, end_location: e.target.value})}
            />
          </div>
          <button type="button" onClick={handleNext} disabled={!formData.destination} className="w-full mt-6 primary-btn text-center disabled:opacity-50">
            Next
          </button>
        </div>

        {/* STEP 2: Dates and Timing */}
        <div className={`space-y-8 ${step === 2 ? 'block' : 'hidden'}`}>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">How many days? <span className="text-red-500">*</span></label>
            <input 
              required type="number" min="1" max="14"
              className="input-dark text-lg"
              value={formData.days}
              onChange={e => setFormData({...formData, days: parseInt(e.target.value) || ''})}
            />
          </div>
          <div className="flex gap-6">
             <div className="flex-1">
               <label className="block text-sm font-semibold text-slate-300 mb-2">Start Date (Optional)</label>
               <input type="date" className="input-dark" value={formData.start_date} onChange={e=>setFormData({...formData, start_date: e.target.value})}/>
             </div>
             <div className="flex-1">
               <label className="block text-sm font-semibold text-slate-300 mb-2">End Date</label>
               <input type="date" className="input-dark" value={formData.end_date} onChange={e=>setFormData({...formData, end_date: e.target.value})}/>
             </div>
          </div>
          <div className="flex gap-6">
             <div className="flex-1">
               <label className="block text-sm font-semibold text-slate-300 mb-2">Daily Start Time</label>
               <input required type="time" className="input-dark" value={formData.start_time} onChange={e=>setFormData({...formData, start_time: e.target.value})}/>
             </div>
             <div className="flex-1">
               <label className="block text-sm font-semibold text-slate-300 mb-2">Daily End Time</label>
               <input required type="time" className="input-dark" value={formData.end_time} onChange={e=>setFormData({...formData, end_time: e.target.value})}/>
             </div>
          </div>
          <div className="flex gap-6 pt-6">
            <button type="button" onClick={handlePrev} className="secondary-btn w-32">Back</button>
            <button type="button" onClick={handleNext} className="flex-1 primary-btn text-center">Next</button>
          </div>
        </div>

        {/* STEP 3: Preferences */}
        <div className={`space-y-8 ${step === 3 ? 'block' : 'hidden'}`}>
          <div>
             <label className="block text-sm font-semibold text-slate-300 mb-2">Who's traveling?</label>
             <div className="flex flex-wrap gap-4">
               {['solo', 'couple', 'family', 'friends'].map(opt => (
                 <button 
                    key={opt} type="button"
                    onClick={() => setFormData({...formData, travel_type: opt})}
                    className={`flex-1 min-w-[100px] p-3 text-center capitalize font-medium transition-all ${formData.travel_type === opt ? 'glass-2 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500' : 'glass-1 glass-hover text-slate-300'}`}
                 >
                    {opt}
                 </button>
               ))}
             </div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-300 mb-2">Budget Tier</label>
             <div className="flex gap-4">
               {['budget', 'mid', 'luxury'].map(opt => (
                 <button 
                    key={opt} type="button"
                    onClick={() => setFormData({...formData, budget: opt})}
                    className={`flex-1 p-3 text-center capitalize font-medium transition-all ${formData.budget === opt ? 'glass-2 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500' : 'glass-1 glass-hover text-slate-300'}`}
                 >
                    {opt}
                 </button>
               ))}
             </div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-300 mb-2">What do you love?</label>
             <div className="flex flex-wrap gap-3">
               {interestOptions.map(int => (
                 <button 
                    key={int} type="button"
                    onClick={() => toggleInterest(int)}
                    className={`px-4 py-2 text-sm font-medium transition-all rounded-full border ${formData.interests.includes(int) ? 'bg-white border-white text-slate-900 shadow-md' : 'bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-sm border-white/10 text-slate-300'}`}
                 >
                    {formData.interests.includes(int) ? '✓ ' + int : '+ ' + int}
                 </button>
               ))}
             </div>
          </div>
          <div className="flex gap-6 pt-6">
            <button type="button" onClick={handlePrev} className="secondary-btn w-32">Back</button>
            <button type="button" onClick={handleNext} className="flex-1 primary-btn text-center">Next</button>
          </div>
        </div>

        {/* STEP 4: Review and Submit */}
        <div className={`space-y-8 ${step === 4 ? 'block' : 'hidden'}`}>
           <div className="glass-1 p-6 space-y-4">
              <p><strong className="text-white">Destination:</strong> <span className="text-slate-300">{formData.destination}</span></p>
              <p><strong className="text-white">Duration:</strong> <span className="text-slate-300">{formData.days} Days ({formData.start_time} - {formData.end_time})</span></p>
              <p><strong className="text-white">Travelers:</strong> <span className="capitalize text-slate-300">{formData.travel_type}</span> <span className="text-slate-300">on</span> <span className="capitalize text-slate-300">{formData.budget}</span> <span className="text-slate-300">budget</span></p>
              <p><strong className="text-white">Interests:</strong> <span className="text-slate-300">{formData.interests.length ? formData.interests.join(', ') : 'None'}</span></p>
              {formData.start_date && <p><strong className="text-white">Dates:</strong> <span className="text-slate-300">{formData.start_date} to {formData.end_date}</span></p>}
           </div>

           <div className="flex gap-6 mt-8">
            <button type="button" onClick={handlePrev} className="secondary-btn w-32">Back</button>
            <button type="submit" disabled={!!errorMsg || isSubmitting} className="flex-1 primary-btn disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? (
                 <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>Generating...</span>
                 </>
              ) : 'Generate Itinerary →'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default HeroInput;
