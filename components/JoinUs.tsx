import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PageRoute } from '../routes/routeTypes';

interface JoinUsProps {
  navigateTo?: (page: PageRoute) => void;
  variant?: 'employee' | 'intern';
}

type GenderOption = 'Male' | 'Female' | 'Prefer not to say';

interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: GenderOption | '';
  age: string;
  phone: string;
  email: string;
  position: string;
  otherPosition: string;
  country: string;
  otherCountry: string;
  address: string;
  school: string;
  cvFile: File | null;
}

const INITIAL_FORM: FormData = {
  firstName: '',
  lastName: '',
  middleName: '',
  gender: '',
  age: '',
  phone: '',
  email: '',
  position: '',
  otherPosition: '',
  country: '',
  otherCountry: '',
  address: '',
  school: '',
  cvFile: null
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const JoinUs: React.FC<JoinUsProps> = ({ navigateTo, variant = 'employee' }) => {
  const roleLabel = variant === 'intern' ? 'Intern' : 'Employee';
  const includeSchool = variant === 'intern';
  const ADMIN_AUTH_STORAGE_KEY = 'lifewood_admin_authenticated';
  const ROLE_ID_STORAGE_KEY = 'lifewood_role_id';
  const ADMIN_REDIRECT_NOTICE_KEY = 'lifewood_admin_block_notice';
  const API_APPLICANTS_URL = '/api/applicants';
  const API_AUTH_SESSION_URL = '/api/auth/session';
  const API_SCHOOLS_URL = '/api/schools';
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stepDirection, setStepDirection] = useState<1 | -1>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [schools, setSchools] = useState<Array<{ id: number; name: string }>>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsError, setSchoolsError] = useState('');

  useEffect(() => {
    const redirectMessage = "You're signed in as an admin. Please sign out to apply.";
    const hasWindow = typeof window !== 'undefined';

    const redirectAdmin = () => {
      if (hasWindow) {
        sessionStorage.setItem(ADMIN_REDIRECT_NOTICE_KEY, redirectMessage);
      }
      navigateTo?.('admin-dashboard');
    };

    if (hasWindow) {
      const isAdminAuth = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true';
      const roleId = Number(localStorage.getItem(ROLE_ID_STORAGE_KEY));
      if (isAdminAuth && roleId === 1) {
        redirectAdmin();
        return;
      }
    }

    const checkSession = async () => {
      try {
        const response = await fetch(API_AUTH_SESSION_URL, { credentials: 'include' });
        if (!response.ok) return;
        const payload = await response.json();
        if (payload?.data?.role_id === 1) {
          redirectAdmin();
        }
      } catch {}
    };

    void checkSession();
  }, [navigateTo]);

  useEffect(() => {
    if (!includeSchool) return;
    let isActive = true;
    const loadSchools = async () => {
      setSchoolsLoading(true);
      setSchoolsError('');
      try {
        const response = await fetch(API_SCHOOLS_URL, { credentials: 'include' });
        const payload = await response.json();
        if (!response.ok || !payload?.ok) {
          throw new Error(payload?.message || 'Unable to load schools.');
        }
        const data = Array.isArray(payload?.data?.schools) ? payload.data.schools : [];
        const normalized = data
          .map((item: { id?: number; school_name?: string }) => ({
            id: Number(item.id ?? 0),
            name: String(item.school_name ?? '').trim()
          }))
          .filter((item: { id: number; name: string }) => item.id > 0 && item.name !== '');

        if (isActive) {
          setSchools(normalized);
        }
      } catch (error) {
        if (isActive) {
          setSchoolsError(error instanceof Error ? error.message : 'Unable to load schools.');
          setSchools([]);
        }
      } finally {
        if (isActive) {
          setSchoolsLoading(false);
        }
      }
    };

    void loadSchools();
    return () => {
      isActive = false;
    };
  }, [includeSchool]);

  const updateField = (field: keyof FormData, value: string | File | null) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

  const validateStep = (currentStep: 1 | 2 | 3): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
      if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
      if (!form.gender) newErrors.gender = 'Please select a gender.';
      if (!form.age.trim()) newErrors.age = 'Age is required.';
      const ageNumber = Number(form.age);
      if (!Number.isFinite(ageNumber) || ageNumber <= 0) {
        newErrors.age = 'Please enter a valid age.';
      }
    }

    if (currentStep === 2) {
      if (!form.phone.trim()) newErrors.phone = 'Phone number is required.';
      if (!form.email.trim()) newErrors.email = 'Email is required.';
      if (form.email && !validateEmail(form.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (!form.position.trim()) newErrors.position = 'Please select a position.';
      if (form.position === 'Other' && !form.otherPosition.trim()) {
        newErrors.otherPosition = 'Please specify the position you are applying for.';
      }
      if (!form.country.trim()) newErrors.country = 'Please select a country.';
      if (form.country === 'Other' && !form.otherCountry.trim()) {
        newErrors.otherCountry = 'Please specify your country.';
      }
      if (!form.address.trim()) newErrors.address = 'Current address is required.';
      if (includeSchool && !form.school.trim()) newErrors.school = 'School is required.';
    }

    if (currentStep === 3) {
      if (!form.cvFile) {
        newErrors.cvFile = 'Please upload your CV in PDF format.';
      } else {
        if (form.cvFile.type !== 'application/pdf') {
          newErrors.cvFile = 'Only PDF files are accepted.';
        } else if (form.cvFile.size > MAX_FILE_SIZE_BYTES) {
          newErrors.cvFile = 'File size must not exceed 10MB.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canGoNext = () => validateStep(step);

  const handleNext = () => {
    if (!canGoNext()) return;
    setStepDirection(1);
    setStep((prev) => (prev === 3 ? prev : (prev + 1) as 2 | 3));
  };

  const handleBack = () => {
    setSubmitMessage(null);
    setStepDirection(-1);
    setStep((prev) => (prev === 1 ? prev : (prev - 1) as 1 | 2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) {
      setStep(3);
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);

    const positionApplied = form.position === 'Other' ? form.otherPosition : form.position;
    const country = form.country === 'Other' ? form.otherCountry : form.country;
    const designationName = variant === 'intern' ? 'intern' : 'employee';
    const payload = new FormData();
    payload.append('first_name', form.firstName.trim());
    payload.append('last_name', form.lastName.trim());
    payload.append('middle_name', form.middleName.trim());
    payload.append('gender', form.gender);
    payload.append('age', String(Number(form.age)));
    payload.append('phone_number', form.phone.trim());
    payload.append('email', form.email.trim());
    payload.append('position_applied', positionApplied.trim());
    payload.append('country', country.trim());
    payload.append('current_address', form.address.trim());
    payload.append('school_name', includeSchool ? form.school.trim() : '');
    payload.append('designation_name', designationName);
    payload.append('uploaded_cv', form.cvFile ? 'true' : 'false');
    if (form.cvFile) {
      payload.append('cv_file', form.cvFile, form.cvFile.name);
    }

    const submit = async () => {
      try {
        const response = await fetch(API_APPLICANTS_URL, {
          method: 'POST',
          credentials: 'include',
          body: payload
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.ok) {
          const apiMessage = result?.message ? String(result.message) : 'Unable to submit your application.';
          const lower = apiMessage.toLowerCase();
          const fieldErrors: Record<string, string> = {};
          if (lower.includes('phone number')) fieldErrors.phone = apiMessage;
          if (lower.includes('email')) fieldErrors.email = apiMessage;
          if (lower.includes('school')) fieldErrors.school = apiMessage;

          if (Object.keys(fieldErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
            if (fieldErrors.phone || fieldErrors.email || fieldErrors.school) {
              setStepDirection(-1);
              setStep(2);
            }
            setSubmitError(null);
            return;
          }

          throw new Error(apiMessage);
        }
        setSubmitMessage('Your application has been submitted. Please check your email to continue with the AI pre-screening.');
        setForm(INITIAL_FORM);
        setStep(1);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Unable to submit your application.');
      } finally {
        setIsSubmitting(false);
      }
    };

    void submit();
  };

  const renderStepIndicator = () => (
    <div className="mb-6 flex items-center justify-center gap-4">
      {[1, 2, 3].map((value) => {
        const current = value as 1 | 2 | 3;
        const isActive = step === current;
        const isCompleted = step > current;
        return (
          <div key={current} className="flex items-center gap-2">
            <div
              className={[
                'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold',
                isCompleted
                  ? 'bg-lifewood-green text-white'
                  : isActive
                    ? 'bg-lifewood-saffron text-lifewood-serpent'
                    : 'bg-white border border-lifewood-serpent/20 text-lifewood-serpent/60'
              ].join(' ')}
            >
              {current}
            </div>
            {current < 3 && (
              <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-lifewood-green/40 to-lifewood-saffron/60" />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="min-h-screen bg-lifewood-seaSalt dark:bg-[#020804] pt-28 pb-16 animate-pop-out opacity-0">
      <div className="container mx-auto px-6 max-w-5xl">
        <button
          type="button"
          onClick={() => navigateTo?.('careers')}
          className="mb-6 inline-flex items-center text-xs font-semibold text-lifewood-serpent/70 hover:text-lifewood-serpent transition"
        >
          &larr; Back to Careers
        </button>

        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lifewood-serpent/60">
            Welcome to
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-lifewood-serpent dark:text-white">
            Apply as {roleLabel}
          </h1>
          <p className="text-sm md:text-base text-lifewood-serpent/70 dark:text-white/70 max-w-2xl">
            Join the world&apos;s leading provider of AI-powered data solutions. This application is currently in
            beta—features and functionality may evolve while we refine the experience.
          </p>
        </div>

        <div className="mb-6 rounded-2xl bg-white/70 dark:bg-white/5 border border-lifewood-serpent/10 shadow-lg backdrop-blur-md p-4 md:p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-lifewood-serpent/60 uppercase">
                Join Our Team
              </p>
              <p className="text-sm text-lifewood-serpent/80 dark:text-white/80">
                Please complete all steps below to submit your application.
              </p>
            </div>
            <div className="text-xs text-lifewood-serpent/60 dark:text-white/60">
              Step {step} of 3
            </div>
          </div>
          {renderStepIndicator()}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white/80 dark:bg-white/5 border border-lifewood-serpent/10 shadow-xl backdrop-blur-lg p-5 md:p-7"
        >
          <AnimatePresence mode="wait" initial={false} custom={stepDirection}>
            <motion.div
              key={step}
              custom={stepDirection}
              initial="enter"
              animate="center"
              exit="exit"
              variants={{
                enter: (direction: 1 | -1) => ({
                  opacity: 0,
                  x: direction > 0 ? 40 : -40
                }),
                center: {
                  opacity: 1,
                  x: 0
                },
                exit: (direction: 1 | -1) => ({
                  opacity: 0,
                  x: direction > 0 ? -40 : 40
                })
              }}
              transition={{
                duration: 0.28,
                ease: [0.22, 0.61, 0.36, 1]
              }}
              className="space-y-4"
            >
              {step === 1 ? (
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-heading font-semibold text-lifewood-serpent dark:text-white">
                    Step 1 · Personal Information
                  </h2>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        First Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent placeholder-lifewood-serpent/35 focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        Middle Name (optional)
                      </label>
                      <input
                        type="text"
                        value={form.middleName}
                        onChange={(e) => updateField('middleName', e.target.value)}
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent placeholder-lifewood-serpent/35 focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                        placeholder="Enter your middle name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        Last Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent placeholder-lifewood-serpent/35 focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        Gender <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={form.gender}
                        onChange={(e) =>
                          updateField('gender', e.target.value as GenderOption | '')
                        }
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        Age <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={form.age}
                        onChange={(e) => updateField('age', e.target.value)}
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent placeholder-lifewood-serpent/35 focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                        placeholder="Enter your age"
                      />
                      {errors.age && (
                        <p className="mt-1 text-xs text-red-600">{errors.age}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : step === 2 ? (
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-heading font-semibold text-lifewood-serpent dark:text-white">
                    Step 2 · Contact & Role Details
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent placeholder-lifewood-serpent/35 focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent placeholder-lifewood-serpent/35 focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                      )}
                      <p className="mt-1 text-[11px] text-lifewood-serpent/60">
                        Please check your email and continue with the AI pre-screening after submitting.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        Position Applied <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={form.position}
                        onChange={(e) => updateField('position', e.target.value)}
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                      >
                        <option value="">Select position</option>
                        <option value="Data Annotator">Data Annotator</option>
                        <option value="AI Reviewer">AI Reviewer</option>
                        <option value="Project Coordinator">Project Coordinator</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.position && (
                        <p className="mt-1 text-xs text-red-600">{errors.position}</p>
                      )}
                      {form.position === 'Other' && (
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                            Specify Other Position <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.otherPosition}
                            onChange={(e) => updateField('otherPosition', e.target.value)}
                            className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent placeholder-lifewood-serpent/35 focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                            placeholder="Enter the role you are applying for"
                          />
                          {errors.otherPosition && (
                            <p className="mt-1 text-xs text-red-600">{errors.otherPosition}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        Country <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={form.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                      >
                        <option value="">Select country</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Australia">Australia</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.country && (
                        <p className="mt-1 text-xs text-red-600">{errors.country}</p>
                      )}
                      {form.country === 'Other' && (
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                            Specify Other Country <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.otherCountry}
                            onChange={(e) => updateField('otherCountry', e.target.value)}
                            className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent placeholder-lifewood-serpent/35 focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                            placeholder="Enter your country"
                          />
                          {errors.otherCountry && (
                            <p className="mt-1 text-xs text-red-600">{errors.otherCountry}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                      Current Address <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent placeholder-lifewood-serpent/35 focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70"
                      placeholder="Enter your current residential address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                    )}
                  </div>

                  {includeSchool && (
                    <div>
                      <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-1">
                        School <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={form.school}
                        onChange={(e) => updateField('school', e.target.value)}
                        disabled={schoolsLoading}
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/80 py-2 px-3 text-sm text-lifewood-serpent focus:outline-none focus:ring-2 focus:ring-lifewood-green/30 focus:border-lifewood-green/70 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <option value="">
                          {schoolsLoading ? 'Loading schools...' : 'Select your school'}
                        </option>
                        {schools.map((school) => (
                          <option key={school.id} value={school.name}>
                            {school.name}
                          </option>
                        ))}
                      </select>
                      {schoolsError && (
                        <p className="mt-1 text-xs text-red-600">{schoolsError}</p>
                      )}
                      {!schoolsLoading && !schoolsError && schools.length === 0 && (
                        <p className="mt-1 text-xs text-red-600">No schools available. Please contact support.</p>
                      )}
                      {errors.school && (
                        <p className="mt-1 text-xs text-red-600">{errors.school}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-heading font-semibold text-lifewood-serpent dark:text-white">
                    Step 3 · Upload CV
                  </h2>
                  <div>
                    <label className="block text-xs font-semibold text-lifewood-serpent/80 mb-2">
                      Upload CV (PDF only, max. 10MB) <span className="text-red-600">*</span>
                    </label>
                    <div
                      className={[
                        'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center',
                        errors.cvFile
                          ? 'border-red-400 bg-red-50/60'
                          : 'border-lifewood-serpent/25 bg-white/70 dark:bg-white/5'
                      ].join(' ')}
                    >
                      <input
                        id="cv-upload"
                        type="file"
                        accept="application/pdf"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          if (!file) {
                            updateField('cvFile', null);
                            return;
                          }
                          if (file.type !== 'application/pdf') {
                            setErrors((prev) => ({
                              ...prev,
                              cvFile: 'Only PDF files are accepted.'
                            }));
                            updateField('cvFile', null);
                            return;
                          }
                          if (file.size > MAX_FILE_SIZE_BYTES) {
                            setErrors((prev) => ({
                              ...prev,
                              cvFile: 'File size must not exceed 10MB.'
                            }));
                            updateField('cvFile', null);
                            return;
                          }
                          updateField('cvFile', file);
                        }}
                      />
                      <div className="pointer-events-none">
                        <p className="text-sm font-semibold text-lifewood-serpent">
                          Click to upload or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-lifewood-serpent/60">
                          PDF only (max. 10MB)
                        </p>
                        {form.cvFile && (
                          <p className="mt-3 text-xs font-medium text-lifewood-green">
                            Selected file: {form.cvFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors.cvFile && (
                      <p className="mt-1 text-xs text-red-600">{errors.cvFile}</p>
                    )}
                  </div>

                  <div className="rounded-xl bg-lifewood-green/5 border border-lifewood-green/20 p-3 text-xs text-lifewood-serpent/75">
                    After submitting, please monitor your email inbox (and spam folder) for the AI pre-screening link
                    and further instructions from Lifewood.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center rounded-lg border border-lifewood-serpent/20 bg-white/80 px-4 py-2 text-xs font-semibold text-lifewood-serpent hover:bg-white"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex gap-2 md:justify-end">
              {step < 3 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center rounded-lg bg-lifewood-green px-5 py-2 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-lifewood-green/90 active:scale-95"
                >
                  Continue
                </button>
              )}
              {step === 3 && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-lg bg-lifewood-saffron px-5 py-2 text-xs md:text-sm font-bold text-lifewood-serpent shadow-sm hover:bg-lifewood-saffron/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>

          {submitMessage && (
            <p className="mt-2 text-xs text-lifewood-green font-medium">
              {submitMessage}
            </p>
          )}
          {submitError && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              {submitError}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default JoinUs;

