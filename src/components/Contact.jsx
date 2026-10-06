import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Mail,
  Copy,
  Check,
  Send,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import Section from './Section';
import { GithubIcon, LinkedinIcon, LinkIcon } from './Icons';
import { getSocial, getEmailMailto } from '../data/socials';
import { useClipboard } from '../hooks/useClipboard';
import Magnetic from './Magnetic';

// Formspree endpoint (configurable via environment variable)
const VITE_FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const { hasCopied, copy } = useClipboard(2500);
  const lastSubmitTime = useRef(0);

  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Honeypot field against automated spam bots
  const [honeypot, setHoneypot] = useState('');

  // Form interaction & validation state
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Submission state: 'idle' | 'loading' | 'success' | 'error'
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Client-side validation logic
  const validateField = (field, value) => {
    let error = '';
    const trimmed = value.trim();

    if (field === 'name') {
      if (!trimmed) {
        error = 'Name is required.';
      } else if (trimmed.length < 2) {
        error = 'Name must be at least 2 characters.';
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmed) {
        error = 'Email address is required.';
      } else if (!emailRegex.test(trimmed)) {
        error = 'Please enter a valid email address (e.g. name@domain.com).';
      }
    } else if (field === 'message') {
      if (!trimmed) {
        error = 'Message is required.';
      } else if (trimmed.length < 10) {
        error = 'Message must be at least 10 characters.';
      }
    }

    return error;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitStatus('idle'); // Clear success/error states on typing

    // Real-time validation after field has been touched
    if (touched[field]) {
      const fieldError = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const validateAll = () => {
    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const messageError = validateField('message', formData.message);

    setErrors({
      name: nameError,
      email: emailError,
      message: messageError,
    });

    setTouched({
      name: true,
      email: true,
      message: true,
    });

    return !nameError && !emailError && !messageError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check honeypot against automated spam bots
    if (honeypot.trim() !== '') {
      // Silently ignore to frustrate automated bots
      return;
    }

    // 2. Perform client-side validation
    const isValid = validateAll();
    if (!isValid) return;

    // 3. Check rate limit
    if (Date.now() - lastSubmitTime.current < 10000) {
      setErrorMessage("Please wait 10 seconds before sending another message.");
      setSubmitStatus('error');
      return;
    }

    // 4. Initiate Formspree transmission
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(VITE_FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          _subject: "New message from portfolio",
          replyto: formData.email.trim(),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTouched({ name: false, email: false, message: false });
        lastSubmitTime.current = Date.now();
        // Focus moved to the message field as requested
        setTimeout(() => document.getElementById('contact-message')?.focus(), 100);
      } else {
        const data = await response.json().catch(() => ({}));
        const serverError =
          data?.errors?.map((err) => err.message).join(', ') ||
          'Submission encountered an issue. Please try again or email directly.';
        setErrorMessage(serverError);
        setSubmitStatus('error');
      }
    } catch {
      setErrorMessage(
        `Network error: Failed to reach transmission gateway. Please email directly at ${getSocial('email')?.handle || 'diptamnandi76@gmail.com'}`
      );
      setSubmitStatus('error');
    }
  };

  return (
    <Section
      id="contact"
      number="06"
      label="REACH OUT"
      title="Let's Build Something Together"
      subtitle="Seeking software engineering internships, open-source collaborations, and challenging technical projects."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Direct Email, GitHub & LinkedIn Links Beside Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0D0D] border border-white/10 relative overflow-hidden">
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Direct Channels
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
              Prefer direct communication? Connect through my primary channels for software discussions, job opportunities, or hackathons.
            </p>

            <div className="space-y-3.5">
              {/* 1. Direct Email Card with Copy & Mailto */}
              {(() => {
                const emailSocial = getSocial('email');
                const emailAddr = emailSocial?.handle || 'diptamnandi76@gmail.com';
                return (
                  <div className="p-4 rounded-xl bg-[#151515] border border-white/5 hover:border-cyan-500/30 transition-all group">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <Mail size={15} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                            Direct Email
                          </span>
                          <span className="text-xs sm:text-sm font-mono text-neutral-200 truncate select-all block">
                            {emailAddr}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => copy(emailAddr)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-cyan-400 bg-[#0D0D0D] border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        aria-label="Copy email address to clipboard"
                      >
                        {hasCopied ? (
                          <>
                            <Check size={13} className="text-green-400" />
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy Address</span>
                          </>
                        )}
                      </button>

                      <a
                        href={getEmailMailto()}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono text-neutral-300 bg-[#0D0D0D] border border-white/10 hover:text-white hover:border-cyan-500/30 transition-colors"
                        aria-label="Open native email client"
                      >
                        <span>Open Mail</span>
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>
                );
              })()}

              {/* 2. Direct GitHub Link Card */}
              {(() => {
                const githubSocial = getSocial('github');
                if (!githubSocial?.url) return null;
                return (
                  <a
                    href={githubSocial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#151515] border border-white/5 hover:border-cyan-500/40 hover:shadow-glow-cyan-sm transition-all flex items-center justify-between gap-3 group block"
                    aria-label="Visit Diptam Nandi's GitHub profile (opens in new tab)"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0D0D0D] border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <GithubIcon size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                          Code & Repositories
                        </span>
                        <span className="text-xs sm:text-sm font-bold font-display text-white group-hover:text-cyan-300 transition-colors block">
                          GitHub / {githubSocial.handle}
                        </span>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-md bg-[#0D0D0D] border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 transition-colors">
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </a>
                );
              })()}

              {/* 3. Direct LinkedIn Link Card */}
              {(() => {
                const linkedinSocial = getSocial('linkedin');
                if (!linkedinSocial?.url) return null;
                return (
                  <a
                    href={linkedinSocial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#151515] border border-white/5 hover:border-cyan-500/40 hover:shadow-glow-cyan-sm transition-all flex items-center justify-between gap-3 group block"
                    aria-label="Visit Diptam Nandi's LinkedIn profile (opens in new tab)"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0D0D0D] border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <LinkedinIcon size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                          Professional Network
                        </span>
                        <span className="text-xs sm:text-sm font-bold font-display text-white group-hover:text-cyan-300 transition-colors block">
                          LinkedIn / {linkedinSocial.handle}
                        </span>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-md bg-[#0D0D0D] border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 transition-colors">
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </a>
                );
              })()}

              {/* 4. Direct Linktree Link Card */}
              {(() => {
                const linktreeSocial = getSocial('linktree');
                if (!linktreeSocial?.url) return null;
                return (
                  <a
                    href={linktreeSocial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#151515] border border-white/5 hover:border-cyan-500/40 hover:shadow-glow-cyan-sm transition-all flex items-center justify-between gap-3 group block"
                    aria-label="Visit Diptam Nandi's Linktree (opens in new tab)"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0D0D0D] border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <LinkIcon size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                          All Connected Links
                        </span>
                        <span className="text-xs sm:text-sm font-bold font-display text-white group-hover:text-cyan-300 transition-colors block">
                          Linktree / {linktreeSocial.handle}
                        </span>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-md bg-[#0D0D0D] border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 transition-colors">
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </a>
                );
              })()}
            </div>

            {/* Availability Status Badge */}
            <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <div className="text-xs font-mono text-neutral-300">
                <span>Available for Summer 2025/2026 Roles</span>
                <span className="text-neutral-500 block text-[11px]">
                  Response time: Usually within 24 hours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form with Validation, Formspree & Honeypot */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0D0D] border border-white/10 relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold font-display text-white">
                Send a Transmission
              </h3>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                <Sparkles size={13} />
                <span>Formspree Gateway</span>
              </div>
            </div>
            
            {!VITE_FORM_ENDPOINT ? (
              <div className="mt-8 py-10 px-6 rounded-xl bg-neutral-900 border border-white/10 text-center flex flex-col items-center justify-center">
                <AlertCircle size={30} className="text-neutral-400 mb-4" />
                <h4 className="text-lg font-bold font-display text-white mb-2">
                  Contact form is not configured
                </h4>
                <p className="text-sm text-neutral-400 max-w-sm mb-6">
                  Please use direct email while the system is being configured for local deployment.
                </p>
                <a
                  href={getEmailMailto()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium text-white bg-[#151515] border border-white/10 hover:bg-neutral-800 transition-all"
                >
                  <Mail size={15} />
                  <span>Email diptamnandi76@gmail.com</span>
                </a>
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
                  Submit your message below. All fields are validated client-side and encrypted in transit.
                </p>

                {/* Error Message Banner */}
                {submitStatus === 'error' && errorMessage && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-300 text-xs sm:text-sm"
                    role="alert"
                  >
                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-semibold block mb-0.5">Transmission Failed</span>
                      <span>{errorMessage}</span>
                    </div>
                  </motion.div>
                )}

                {/* Success Message Banner */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3 text-emerald-300 text-xs sm:text-sm"
                    role="alert"
                  >
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-semibold block mb-0.5">Transmission Successful!</span>
                      <span>Your message has been received. I will review it shortly.</span>
                    </div>
                  </motion.div>
                )}

                {/* Primary Interactive Form */}
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5"
                >
                  {/* Honeypot Spam Protection Field (Hidden from real users) */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="form-gotcha">Do not fill this field</label>
                    <input
                      id="form-gotcha"
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-2"
                    >
                      Your Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      disabled={submitStatus === 'loading'}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="e.g. Ada Lovelace"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={`w-full px-4 py-3 rounded-lg bg-[#151515] text-white text-sm placeholder:text-neutral-600 transition-colors focus:outline-none ${
                        errors.name && touched.name
                          ? 'border border-red-500/60 focus:border-red-400 bg-red-950/10'
                          : 'border border-white/10 focus:border-cyan-400'
                      }`}
                    />
                    {errors.name && touched.name && (
                      <p
                        id="contact-name-error"
                        role="alert"
                        className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-mono"
                      >
                        <AlertCircle size={12} />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-2"
                    >
                      Email Address <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      disabled={submitStatus === 'loading'}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="e.g. ada@lovelace.dev"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={`w-full px-4 py-3 rounded-lg bg-[#151515] text-white text-sm placeholder:text-neutral-600 transition-colors focus:outline-none ${
                        errors.email && touched.email
                          ? 'border border-red-500/60 focus:border-red-400 bg-red-950/10'
                          : 'border border-white/10 focus:border-cyan-400'
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p
                        id="contact-email-error"
                        role="alert"
                        className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-mono"
                      >
                        <AlertCircle size={12} />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Message Input */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-2"
                    >
                      Message Content <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      disabled={submitStatus === 'loading'}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      onBlur={() => handleBlur('message')}
                      placeholder="Hello Diptam, I came across your portfolio and would like to connect regarding..."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      className={`w-full px-4 py-3 rounded-lg bg-[#151515] text-white text-sm placeholder:text-neutral-600 transition-colors resize-none focus:outline-none ${
                        errors.message && touched.message
                          ? 'border border-red-500/60 focus:border-red-400 bg-red-950/10'
                          : 'border border-white/10 focus:border-cyan-400'
                      }`}
                    />
                    {errors.message && touched.message && (
                      <p
                        id="contact-message-error"
                        role="alert"
                        className="mt-1.5 text-xs text-red-400 flex items-center gap-1 font-mono"
                      >
                        <AlertCircle size={12} />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Magnetic className="w-full">
                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold font-mono text-[#050505] bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow-cyan transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-black" />
                          <span>Transmitting Payload...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Message</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </Magnetic>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
