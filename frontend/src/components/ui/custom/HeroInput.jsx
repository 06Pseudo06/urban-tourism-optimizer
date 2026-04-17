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

  const interestOptions = ['culture', 'nature', 'food', 'history', 'shopping', 'nightlife'];

  const validateStep = (currentStep) => {
    setErrorMsg('');

    if (currentStep === 1) {
      if (!formData.destination?.trim()) {
        setErrorMsg('Destination is required.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.days || formData.days < 1 || formData.days > 14) {
        setErrorMsg('Please enter 1–14 days.');
        return false;
      }

      if (formData.start_date && !formData.end_date) {
        setErrorMsg('End Date required if Start Date is provided.');
        return false;
      }

      if (formData.start_date && formData.end_date) {
        const start = new Date(formData.start_date);
        const end = new Date(formData.end_date);

        if (isNaN(start) || isNaN(end)) {
          setErrorMsg('Invalid date format.');
          return false;
        }

        if (end <= start) {
          setErrorMsg('End Date must be after Start Date.');
          return false;
        }
      }

      if (!formData.start_time || !formData.end_time) {
        setErrorMsg('Time range required.');
        return false;
      }

      const [sh, sm] = formData.start_time.split(':').map(Number);
      const [eh, em] = formData.end_time.split(':').map(Number);

      if ([sh, sm, eh, em].some(isNaN)) {
        setErrorMsg('Invalid time format.');
        return false;
      }

      const sMins = sh * 60 + sm;
      const eMins = eh * 60 + em;

      if (eMins <= sMins) {
        setErrorMsg('End time must be after start time.');
        return false;
      }

      if ((eMins - sMins) < 240) {
        setErrorMsg('Minimum 4-hour window required.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 4));
  };

  const handlePrev = () => {
    setErrorMsg('');
    setStep(s => Math.max(s - 1, 1));
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!validateStep(4)) return;

    // ✅ CLEAN DATA BEFORE SEND
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== '' && v != null)
    );

    // normalize interests (lowercase)
    cleanData.interests = cleanData.interests?.map(i => i.toLowerCase());

    onSubmit(cleanData);
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
    <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border">

      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-2">Design your trip</h2>
        <p className="text-slate-500">Step {step} of 4</p>
        {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}
      </div>

      <form onSubmit={submitForm}>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              required
              type="text"
              placeholder="Destination"
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
            />

            <button type="button" onClick={handleNext}>Next</button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="number"
              min="1"
              max="14"
              value={formData.days}
              onChange={e => setFormData({...formData, days: Number(e.target.value)})}
            />

            <button type="button" onClick={handlePrev}>Back</button>
            <button type="button" onClick={handleNext}>Next</button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            {interestOptions.map(opt => (
              <button key={opt} type="button" onClick={() => toggleInterest(opt)}>
                {opt}
              </button>
            ))}

            <button type="button" onClick={handlePrev}>Back</button>
            <button type="button" onClick={handleNext}>Next</button>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <button type="button" onClick={handlePrev}>Back</button>
            <button type="submit">Generate</button>
          </>
        )}

      </form>
    </div>
  );
};

export default HeroInput;
