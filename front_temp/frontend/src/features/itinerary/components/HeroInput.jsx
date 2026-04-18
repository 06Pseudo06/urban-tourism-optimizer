import { useState } from 'react';

const STEP_LABELS = ['Destination', 'Dates & Time', 'Preferences', 'Review'];

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

  const interestOptions = [
    { label: 'Culture', icon: '🎭' },
    { label: 'Nature', icon: '🌿' },
    { label: 'Food', icon: '🍜' },
    { label: 'History', icon: '🏛️' },
    { label: 'Shopping', icon: '🛍️' },
    { label: 'Nightlife', icon: '🌃' },
  ];

  const travelTypes = [
    { value: 'solo', icon: '🧍', label: 'Solo' },
    { value: 'couple', icon: '👫', label: 'Couple' },
    { value: 'family', icon: '👨‍👩‍👧', label: 'Family' },
    { value: 'friends', icon: '🧑‍🤝‍🧑', label: 'Friends' },
  ];

  const budgetOptions = [
    { value: 'budget', label: 'Budget', desc: 'Affordable & smart' },
    { value: 'mid', label: 'Mid-range', desc: 'Best value' },
    { value: 'luxury', label: 'Luxury', desc: 'Premium experience' },
  ];

  const validateStep = (currentStep) => {
    setErrorMsg('');
    if (currentStep === 1 && !formData.destination.trim()) {
      setErrorMsg('Destination is required.');
      return false;
    }
    if (currentStep === 2) {
      if (!formData.days || formData.days < 1 || formData.days > 14) {
        setErrorMsg('Please enter 1–14 days.');
        return false;
      }
      if (formData.start_date && !formData.end_date) {
        setErrorMsg('End date is required if start date is set.');
        return false;
      }
      if (formData.start_date && formData.end_date) {
        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
          setErrorMsg('End date must be after start date.');
          return false;
        }
        const diff = Math.ceil(Math.abs(new Date(formData.end_date) - new Date(formData.start_date)) / 86400000);
        if (formData.days !== diff && diff > 0) {
          setErrorMsg(`Days (${formData.days}) doesn't match date range (${diff} days).`);
          return false;
        }
      }
      const [sh, sm] = formData.start_time.split(':').map(Number);
      const [eh, em] = formData.end_time.split(':').map(Number);
      const sMin = sh * 60 + sm, eMin = eh * 60 + em;
      if (eMin <= sMin) { setErrorMsg('End time must be after start time.'); return false; }
      if ((eMin - sMin) < 240) { setErrorMsg('Minimum 4-hour daily window required.'); return false; }
    }
    return true;
  };

  const handleNext = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, 4)); };
  const handlePrev = () => { setErrorMsg(''); setStep(s => Math.max(s - 1, 1)); };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    const cleanPayload = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );
    cleanPayload.interests = Array.isArray(formData.interests) ? formData.interests : [];
    onSubmit(cleanPayload);
  };

  const toggleInterest = (i) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(i)
        ? prev.interests.filter(x => x !== i)
        : [...prev.interests, i]
    }));
  };

  const inputStyle = {
    background: '#fff',
    border: '1px solid rgba(22,45,88,0.14)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '0.925rem',
    color: 'var(--slate-warm-900)',
    width: '100%',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 200ms, box-shadow 200ms',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--navy-700)',
    marginBottom: '6px',
  };

  const btnPrimary = {
    background: 'linear-gradient(135deg, #e8b84b 0%, #c9961f 100%)',
    color: 'var(--navy-950)',
    border: 'none',
    borderRadius: '12px',
    padding: '13px 24px',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.04em',
    transition: 'transform 180ms, box-shadow 180ms, filter 180ms',
    width: '100%',
  };

  const btnSecondary = {
    background: 'transparent',
    border: '1px solid rgba(22,45,88,0.18)',
    color: 'var(--navy-700)',
    borderRadius: '12px',
    padding: '13px 20px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  };

  const focusHandlers = {
    onFocus: (e) => { e.target.style.borderColor = 'var(--gold-500)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,150,31,0.1)'; },
    onBlur: (e) => { e.target.style.borderColor = 'rgba(22,45,88,0.14)'; e.target.style.boxShadow = 'none'; },
  };

  const hoverBtnPrimary = {
    onMouseOver: (e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,150,31,0.35)'; },
    onMouseOut: (e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; },
  };

  return (
    <div
      className="w-full max-w-lg mx-auto mt-4"
      style={{
        background: '#fff',
        border: '1px solid rgba(22,45,88,0.1)',
        borderRadius: '20px',
        boxShadow: '0 8px 40px rgba(22,45,88,0.1), 0 2px 8px rgba(22,45,88,0.06)',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)', padding: '24px 28px 22px' }}>
        <div className="flex items-center gap-2 mb-3">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                background: i + 1 <= step ? 'linear-gradient(135deg, #e8b84b 0%, #c9961f 100%)' : 'rgba(255,255,255,0.1)',
                color: i + 1 <= step ? 'var(--navy-950)' : 'rgba(255,255,255,0.3)',
                transition: 'all 300ms',
              }}>
                {i + 1 < step ? '✓' : i + 1}
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div style={{ height: 1, width: 20, flexShrink: 0, transition: 'background 300ms',
                  background: i + 1 < step ? 'rgba(232,184,75,0.6)' : 'rgba(255,255,255,0.12)' }} />
              )}
            </div>
          ))}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--ivory)', margin: 0 }}>
          {step === 1 && 'Where are you headed?'}
          {step === 2 && 'When are you travelling?'}
          {step === 3 && 'Tell us your style'}
          {step === 4 && 'Review your trip'}
        </h2>
        <p style={{ color: 'rgba(245,208,110,0.5)', fontSize: '0.8rem', marginTop: 4, fontFamily: 'var(--font-body)' }}>
          Step {step} of 4
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'rgba(22,45,88,0.06)' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #e8b84b, #c9961f)', width: `${(step / 4) * 100}%`, transition: 'width 400ms cubic-bezier(0.4,0,0.2,1)' }} />
      </div>

      <div style={{ padding: '24px 28px 28px' }}>
        {errorMsg && (
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: '0.82rem', fontWeight: 500, marginBottom: 16 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={submitForm}>

          {/* STEP 1 */}
          <div style={{ display: step === 1 ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Destination *</label>
              <input required type="text" placeholder="e.g. Tokyo, Paris, New York..." style={{ ...inputStyle, fontSize: '1rem', fontWeight: 500 }}
                value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} {...focusHandlers} />
            </div>
            <div>
              <label style={labelStyle}>Start Location <span style={{ color: 'var(--slate-warm-400)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(optional)</span></label>
              <input type="text" placeholder="Hotel name or airport" style={inputStyle}
                value={formData.start_location} onChange={e => setFormData({ ...formData, start_location: e.target.value })} {...focusHandlers} />
            </div>
            <div>
              <label style={labelStyle}>End Location <span style={{ color: 'var(--slate-warm-400)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(optional)</span></label>
              <input type="text" placeholder="Airport or train station" style={inputStyle}
                value={formData.end_location} onChange={e => setFormData({ ...formData, end_location: e.target.value })} {...focusHandlers} />
            </div>
            <button type="button" onClick={handleNext} disabled={!formData.destination} style={{ ...btnPrimary, opacity: formData.destination ? 1 : 0.45 }} {...hoverBtnPrimary}>
              Continue →
            </button>
          </div>

          {/* STEP 2 */}
          <div style={{ display: step === 2 ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Number of days *</label>
              <input required type="number" min="1" max="14" style={{ ...inputStyle, fontSize: '1.1rem', fontWeight: 600 }}
                value={formData.days} onChange={e => setFormData({ ...formData, days: parseInt(e.target.value) || '' })} {...focusHandlers} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['start_date', 'Start Date'], ['end_date', 'End Date']].map(([key, lbl]) => (
                <div key={key}>
                  <label style={labelStyle}>{lbl}</label>
                  <input type="date" style={inputStyle} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} {...focusHandlers} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['start_time', 'Daily Start'], ['end_time', 'Daily End']].map(([key, lbl]) => (
                <div key={key}>
                  <label style={labelStyle}>{lbl}</label>
                  <input required type="time" style={inputStyle} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} {...focusHandlers} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={handlePrev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
              <button type="button" onClick={handleNext} style={{ ...btnPrimary }} {...hoverBtnPrimary}>Continue →</button>
            </div>
          </div>

          {/* STEP 3 */}
          <div style={{ display: step === 3 ? 'flex' : 'none', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Who's travelling?</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {travelTypes.map(opt => (
                  <button key={opt.value} type="button" onClick={() => setFormData({ ...formData, travel_type: opt.value })}
                    style={{ border: formData.travel_type === opt.value ? '2px solid var(--gold-500)' : '1px solid rgba(22,45,88,0.12)', borderRadius: 12, padding: '10px 6px', background: formData.travel_type === opt.value ? 'rgba(201,150,31,0.06)' : '#fff', cursor: 'pointer', transition: 'all 180ms', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{opt.icon}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: formData.travel_type === opt.value ? 'var(--navy-800)' : 'var(--slate-warm-600)' }}>{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Budget</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {budgetOptions.map(opt => (
                  <button key={opt.value} type="button" onClick={() => setFormData({ ...formData, budget: opt.value })}
                    style={{ border: formData.budget === opt.value ? '2px solid var(--gold-500)' : '1px solid rgba(22,45,88,0.12)', borderRadius: 12, padding: '12px 8px', background: formData.budget === opt.value ? 'rgba(201,150,31,0.06)' : '#fff', cursor: 'pointer', transition: 'all 180ms', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: formData.budget === opt.value ? 'var(--navy-800)' : 'var(--slate-warm-700)', marginBottom: 2 }}>{opt.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-warm-400)' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>What do you love?</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {interestOptions.map(({ label, icon }) => (
                  <button key={label} type="button" onClick={() => toggleInterest(label)}
                    style={{ border: formData.interests.includes(label) ? '1.5px solid var(--gold-500)' : '1px solid rgba(22,45,88,0.14)', borderRadius: 999, padding: '7px 14px', background: formData.interests.includes(label) ? 'linear-gradient(135deg, rgba(232,184,75,0.12), rgba(201,150,31,0.08))' : '#fff', color: formData.interests.includes(label) ? 'var(--navy-800)' : 'var(--slate-warm-600)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-body)', transition: 'all 180ms', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{icon}</span> {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={handlePrev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
              <button type="button" onClick={handleNext} style={btnPrimary} {...hoverBtnPrimary}>Continue →</button>
            </div>
          </div>

          {/* STEP 4 */}
          <div style={{ display: step === 4 ? 'flex' : 'none', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--cream)', border: '1px solid rgba(22,45,88,0.1)', borderRadius: 14, padding: '18px 20px' }}>
              {[
                { label: 'Destination', value: formData.destination },
                { label: 'Duration', value: `${formData.days} days  •  ${formData.start_time} – ${formData.end_time}` },
                { label: 'Travellers', value: `${formData.travel_type?.charAt(0).toUpperCase()}${formData.travel_type?.slice(1)} • ${formData.budget?.charAt(0).toUpperCase()}${formData.budget?.slice(1)} budget` },
                { label: 'Interests', value: formData.interests.length ? formData.interests.join(', ') : 'All types' },
                ...(formData.start_date ? [{ label: 'Dates', value: `${formData.start_date} → ${formData.end_date}` }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '9px 0', borderBottom: '1px solid rgba(22,45,88,0.06)', gap: 12 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-700)', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--slate-warm-700)', textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={handlePrev} style={{ ...btnSecondary, flexShrink: 0 }}>← Back</button>
              <button type="submit" style={btnPrimary}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,150,31,0.4)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                Generate My Itinerary ✦
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default HeroInput;
