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
    <div className="w-full max-w-xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-900/5 p-8 border border-white/40 dark:border-slate-800">
      
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Design your dream trip</h2>
        <p className="text-slate-500">Step {step} of 4</p>
        <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
           <div className={`h-full bg-blue-600 transition-all duration-500`} style={{width: `${(step/4)*100}%`}}></div>
        </div>
        {errorMsg && <p className="text-red-500 font-medium text-sm mt-3">{errorMsg}</p>}
      </div>

      <form onSubmit={submitForm}>
        
        {/* STEP 1: Destination */}
        <div className={`space-y-6 ${step === 1 ? 'block' : 'hidden'}`}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Where to? <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              placeholder="e.g. Tokyo, Paris, New York"
              className="w-full text-lg p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Start Location (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. My Hotel name or Airport"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={formData.start_location}
              onChange={e => setFormData({...formData, start_location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">End Location (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Airport or Train Station"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={formData.end_location}
              onChange={e => setFormData({...formData, end_location: e.target.value})}
            />
          </div>
          <button type="button" onClick={handleNext} disabled={!formData.destination} className="w-full py-4 px-6 bg-slate-900 text-white rounded-xl font-bold mt-6 disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-500/20 transition-all">
            Next
          </button>
        </div>

        {/* STEP 2: Dates and Timing */}
        <div className={`space-y-6 ${step === 2 ? 'block' : 'hidden'}`}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">How many days? <span className="text-red-500">*</span></label>
            <input 
              required type="number" min="1" max="14"
              className="w-full text-lg p-4 bg-slate-50 border border-slate-200 rounded-xl"
              value={formData.days}
              onChange={e => setFormData({...formData, days: parseInt(e.target.value) || ''})}
            />
          </div>
          <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date (Optional)</label>
               <input type="date" className="w-full p-3 bg-slate-50 border rounded-xl" value={formData.start_date} onChange={e=>setFormData({...formData, start_date: e.target.value})}/>
             </div>
             <div className="flex-1">
               <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
               <input type="date" className="w-full p-3 bg-slate-50 border rounded-xl" value={formData.end_date} onChange={e=>setFormData({...formData, end_date: e.target.value})}/>
             </div>
          </div>
          <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-sm font-semibold text-slate-700 mb-2">Daily Start Time</label>
               <input required type="time" className="w-full p-3 bg-slate-50 border rounded-xl" value={formData.start_time} onChange={e=>setFormData({...formData, start_time: e.target.value})}/>
             </div>
             <div className="flex-1">
               <label className="block text-sm font-semibold text-slate-700 mb-2">Daily End Time</label>
               <input required type="time" className="w-full p-3 bg-slate-50 border rounded-xl" value={formData.end_time} onChange={e=>setFormData({...formData, end_time: e.target.value})}/>
             </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={handlePrev} className="px-6 py-4 rounded-xl font-bold border hover:bg-slate-50">Back</button>
            <button type="button" onClick={handleNext} className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-slate-500/20 hover:-translate-y-0.5">Next</button>
          </div>
        </div>

        {/* STEP 3: Preferences */}
        <div className={`space-y-6 ${step === 3 ? 'block' : 'hidden'}`}>
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Who's traveling?</label>
             <div className="flex flex-wrap gap-3">
               {['solo', 'couple', 'family', 'friends'].map(opt => (
                 <button 
                    key={opt} type="button"
                    onClick={() => setFormData({...formData, travel_type: opt})}
                    className={`flex-1 min-w-[100px] p-3 rounded-xl text-center capitalize font-medium transition border ${formData.travel_type === opt ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300'}`}
                 >
                    {opt}
                 </button>
               ))}
             </div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Budget Tier</label>
             <div className="flex gap-3">
               {['budget', 'mid', 'luxury'].map(opt => (
                 <button 
                    key={opt} type="button"
                    onClick={() => setFormData({...formData, budget: opt})}
                    className={`flex-1 p-3 rounded-xl text-center capitalize font-medium transition border ${formData.budget === opt ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-300'}`}
                 >
                    {opt}
                 </button>
               ))}
             </div>
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">What do you love?</label>
             <div className="flex flex-wrap gap-2">
               {interestOptions.map(int => (
                 <button 
                    key={int} type="button"
                    onClick={() => toggleInterest(int)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition border ${formData.interests.includes(int) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}
                 >
                    {formData.interests.includes(int) ? '✓ ' + int : '+ ' + int}
                 </button>
               ))}
             </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={handlePrev} className="px-6 py-4 rounded-xl font-bold border hover:bg-slate-50">Back</button>
            <button type="button" onClick={handleNext} className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-slate-500/20 hover:-translate-y-0.5">Next</button>
          </div>
        </div>

        {/* STEP 4: Review and Submit */}
        <div className={`space-y-6 ${step === 4 ? 'block' : 'hidden'}`}>
           <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <p><strong>Destination:</strong> {formData.destination}</p>
              <p><strong>Duration:</strong> {formData.days} Days ({formData.start_time} - {formData.end_time})</p>
              <p><strong>Travelers:</strong> <span className="capitalize">{formData.travel_type}</span> on <span className="capitalize">{formData.budget}</span> budget</p>
              <p><strong>Interests:</strong> {formData.interests.length ? formData.interests.join(', ') : 'None'}</p>
              {formData.start_date && <p><strong>Dates:</strong> {formData.start_date} to {formData.end_date}</p>}
           </div>

           <div className="flex gap-4 pt-4">
            <button type="button" onClick={handlePrev} className="px-6 py-4 rounded-xl font-bold border hover:bg-slate-50 transition-colors">Back</button>
            <button type="submit" disabled={!!errorMsg || isSubmitting} className="flex-1 py-4 px-6 hero-gradient-btn text-white rounded-xl font-bold hover:-translate-y-0.5 disabled:opacity-50 transition-all flex items-center justify-center">
              {isSubmitting ? (
                 <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Generating...
                 </span>
              ) : 'Generate Itinerary →'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default HeroInput;
