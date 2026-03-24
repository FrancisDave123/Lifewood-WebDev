import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PageRoute } from '../routes/routeTypes';
import { applicantService } from '../services/applicantService';
import { storageService } from '../services/storageService';
import { emailService } from '../services/emailService';
import { supabase } from '../services/supabaseClient';

interface JoinUsProps {
  navigateTo?: (page: PageRoute) => void;
  variant?: 'employee' | 'intern';
}

type GenderOption = 'Male' | 'Female' | 'Prefer not to say';

const COUNTRY_OPTIONS = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus',
  'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji',
  'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
  'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands',
  'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
  'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
  'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain',
  'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
  'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
] as const;

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
  address: '',
  school: '',
  cvFile: null
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const JoinUs: React.FC<JoinUsProps> = ({ navigateTo, variant = 'employee' }) => {
  const roleLabel = variant === 'intern' ? 'Intern' : 'Employee';
  const includeSchool = variant === 'intern';
  const ADMIN_AUTH_STORAGE_KEY = 'lifewood_admin_authenticated';
  const ADMIN_REDIRECT_NOTICE_KEY = 'lifewood_admin_block_notice';
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

    const checkAdmin = async () => {
      if (!hasWindow) return;
      try {
        const { data: authUserData, error: authError } = await supabase.auth.getUser();
        if (authError || !authUserData?.user) return;

        const { data: account } = await supabase
          .from('user_accounts')
          .select('role_id')
          .eq('auth_user_id', authUserData.user.id)
          .single();

        if (account && Number(account.role_id) === 1) {
          redirectAdmin();
        }
      } catch {}
    };

    void checkAdmin();
  }, [navigateTo]);

  useEffect(() => {
    if (!includeSchool) return;
    let isActive = true;
    const loadSchools = async () => {
      setSchoolsLoading(true);
      setSchoolsError('');
      try {
        const data = await applicantService.getSchools();
        const normalized = data
          .map((item: any) => ({
            id: item.id,
            name: String(item.school_name ?? '').trim()
          }))
          .filter((item: { id: string; name: string }) => item.name !== '');

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
  const sanitizeAge = (value: string) => value.replace(/\D/g, '').slice(0, 3);

  const validateStep = (currentStep: 1 | 2 | 3): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
      if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
      if (!form.gender) newErrors.gender = 'Please select a gender.';
      if (!form.age.trim()) newErrors.age = 'Age is required.';
      const ageNumber = Number(form.age);
      if (!/^\d+$/.test(form.age)) {
        newErrors.age = 'Age must contain numbers only.';
      } else if (!Number.isFinite(ageNumber) || ageNumber < 18) {
        newErrors.age = 'Applicants must be at least 18 years old.';
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
    const designationName = variant === 'intern' ? 'intern' : 'employee';

    const submit = async () => {
      try {
        // Check for duplicate email/phone
        const existing = await applicantService.checkDuplicateContact(
          form.email.trim(),
          form.phone.trim()
        );

        if (existing.duplicateEmail && existing.duplicatePhone) {
          setErrors((prev) => ({
            ...prev,
            email: 'An applicant with this email already exists.',
            phone: 'An applicant with this phone number already exists.'
          }));
          throw new Error('An applicant with this phone number and email already exists.');
        }
        if (existing.duplicateEmail) {
          setErrors((prev) => ({ ...prev, email: 'An applicant with this email already exists.' }));
          throw new Error('An applicant with this email already exists.');
        }
        if (existing.duplicatePhone) {
          setErrors((prev) => ({ ...prev, phone: 'An applicant with this phone number already exists.' }));
          throw new Error('An applicant with this phone number already exists.');
        }

        // Get designation
        const designations = await applicantService.getDesignations();
        const designation = designations.find(
          (d) => d.designation_name?.toLowerCase() === designationName.toLowerCase()
        );
        if (!designation) {
          throw new Error('Invalid designation.');
        }

        // Validate school if needed
        let schoolId = null;
        if (includeSchool && form.school.trim()) {
          const schools = await applicantService.getSchools();
          const school = schools.find(
            (s) => s.school_name?.toLowerCase() === form.school.trim().toLowerCase()
          );
          if (!school) {
            setErrors((prev) => ({ ...prev, school: 'School is not recognized. Please select an existing school.' }));
            throw new Error('School is not recognized.');
          }
          schoolId = school.id;
        }

        // Generate applicant ID
        const applicantId = crypto.randomUUID();

        // Upload CV if present
        let cvPath = null;
        if (form.cvFile) {
          const uploadResult = await storageService.uploadCV(form.cvFile, applicantId);
          cvPath = uploadResult.fullPath;
        }

        // Create applicant record
        await applicantService.createApplicant({
          id: applicantId,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          middle_name: form.middleName.trim(),
          gender: form.gender,
          age: Number(form.age),
          phone_number: form.phone.trim(),
          email: form.email.trim(),
          position_applied: positionApplied.trim(),
          country: form.country.trim(),
          current_address: form.address.trim(),
          school_id: schoolId,
          designation_id: designation.id,
          uploaded_cv: form.cvFile ? true : false,
          cv_path: cvPath,
          new_applicant_status: true,
          created_at: new Date().toISOString()
        });

        // Send AI screening email to the applicant
        try {
          await emailService.sendAIScreeningEmail(
            form.email.trim(),
            `${form.firstName.trim()} ${form.lastName.trim()}`,
            positionApplied.trim()
          );
        } catch (emailError) {
          console.error('Failed to send AI screening email:', emailError);
          // Continue with success message even if email fails
        }

        setSubmitMessage('Your application has been submitted. Please check your email to continue with the AI pre-screening.');
        setForm(INITIAL_FORM);
        setStep(1);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to submit your application.';
        const lower = message.toLowerCase();

        // Map errors to specific fields
        const fieldErrors: Record<string, string> = {};
        if (lower.includes('phone')) fieldErrors.phone = message;
        if (lower.includes('email')) fieldErrors.email = message;
        if (lower.includes('school')) fieldErrors.school = message;

        if (Object.keys(fieldErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
          if (fieldErrors.phone || fieldErrors.email || fieldErrors.school) {
            setStepDirection(-1);
            setStep(2);
          }
        } else {
          setSubmitError(message);
        }
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
          onClick={() => navigateTo?.('join-us-as')}
          className="mb-6 inline-flex items-center text-xs font-semibold text-lifewood-serpent/70 hover:text-lifewood-serpent transition"
        >
          &larr; Back
        </button>

        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-lifewood-serpent/60">
            Welcome to
          </p>
          <div
            id={variant === 'intern' ? 'join-us-intern-page-title' : 'join-us-employee-page-title'}
            className="mb-2"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tight text-lifewood-serpent dark:text-white">
              Apply as {roleLabel}
            </h1>
            <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-lifewood-green via-lifewood-saffron to-lifewood-green" />
          </div>
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
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={3}
                        value={form.age}
                        onChange={(e) => updateField('age', sanitizeAge(e.target.value))}
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
                        {COUNTRY_OPTIONS.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <p className="mt-1 text-xs text-red-600">{errors.country}</p>
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

