// src/styles/common.js
// Theme: Animal Rescue Network — warm indigo/orange palette, clean cards, glassmorphism accents
// Colors: #4F46E5 (brand primary), #1E293B (dark grey), #F97316 (orange accent)

// ─── Layout ───────────────────────────────────────────
export const pageBackground    = "bg-[#f3f4f6] min-h-screen"
export const pageWrapper       = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
export const section           = "mb-14"

// ─── Cards ────────────────────────────────────────────
export const cardClass         = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out"
export const cardPadded        = "bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
export const serviceCard       = "md:w-1/2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"

// ─── Typography ───────────────────────────────────────
export const pageTitleClass    = "text-4xl md:text-5xl font-extrabold text-[#1E293B] tracking-tight leading-tight mb-2"
export const headingClass      = "text-3xl font-extrabold text-[#1E293B] tracking-tight"
export const subHeadingClass   = "text-2xl font-bold text-[#4F46E5]"
export const sectionTitle      = "text-3xl font-extrabold text-[#1E293B] mb-10 text-center"
export const bodyText          = "text-gray-600 leading-relaxed"
export const mutedText         = "text-sm text-gray-500"
export const linkClass         = "text-[#4F46E5] hover:text-[#4338CA] transition-colors font-bold"

// ─── Buttons ──────────────────────────────────────────
export const primaryBtn        = "bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1"
export const primaryBtnFull    = "w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
export const secondaryBtn      = "border-2 border-[#4F46E5] hover:bg-orange-50 text-[#4F46E5] font-bold py-3.5 px-8 rounded-full shadow-sm transition transform hover:-translate-y-1"
export const outlineBtn        = "w-full bg-white border border-[#4F46E5] text-[#4F46E5] hover:bg-indigo-50 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm"
export const ghostBtn          = "text-[#4F46E5] font-bold hover:text-[#4338CA] transition-colors cursor-pointer"
export const dangerBtn         = "w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm"
export const donateBtn         = "w-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm"

// ─── Forms ────────────────────────────────────────────
export const formCard          = "relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row m-4 md:m-8 animate-fadeInUp"
export const formTitle         = "mt-2 text-3xl font-extrabold text-[#1E293B]"
export const labelClass        = "block text-sm font-medium text-gray-700 mb-1"
export const inputClass        = "appearance-none rounded-xl block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] sm:text-sm transition-all bg-gray-50 focus:bg-white"
export const selectClass       = "appearance-none rounded-xl block w-full px-4 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] sm:text-sm transition-all bg-gray-50 focus:bg-white cursor-pointer"
export const formGroup         = "mb-4"
export const submitBtn         = "group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#4F46E5] hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
export const submitBtnDark     = "group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#1E293B] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E293B] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
export const formSidePanel     = "hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-[#E0E7FF]/40 to-indigo-100/20 items-center justify-center relative p-12"

// ─── Navbar ───────────────────────────────────────────
export const navbarClass       = "bg-white shadow-sm sticky top-0 z-40 glassmorphism border-b border-gray-100"
export const navContainerClass = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
export const navInnerClass     = "flex justify-between h-20"
export const navLinkClass      = (isActive) =>
  `px-3 py-2 rounded-md text-sm font-bold transition-all ${isActive ? 'text-[#4F46E5] bg-orange-50' : 'text-gray-500 hover:text-[#4F46E5] hover:bg-orange-50'}`
export const navCtaBtn         = "ml-4 px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:-translate-y-0.5 shadow-sm bg-[#4F46E5] text-white hover:shadow-md"
export const sosBarClass       = "bg-red-600 text-white py-2 px-4 font-bold text-sm tracking-wide shadow-inner flex justify-between items-center relative z-50"

// ─── Badges / Status ──────────────────────────────────
export const badgeBase         = "px-2.5 py-1 text-xs font-bold rounded-full"
export const badgePending      = "bg-red-100 text-red-800 border border-red-200"
export const badgeRescued      = "bg-amber-100 text-amber-800 border border-amber-200"
export const badgeTreated      = "bg-blue-100 text-blue-800 border border-blue-200"
export const badgeAdoption     = "bg-green-100 text-green-800 border border-green-200"
export const badgeRehomed      = "bg-gray-100 text-gray-800 border border-gray-300"
export const volunteerBadge    = "mb-4 text-xs font-semibold text-[#4F46E5] bg-indigo-50 border border-indigo-100 inline-block px-3 py-1 rounded-full"
export const warningBadge      = "w-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold py-2 px-4 rounded-lg text-center text-sm"
export const tagClass          = "text-[#4F46E5] text-xs font-bold uppercase tracking-wider"

// ─── Blog / Article ───────────────────────────────────
export const articleGrid       = "grid grid-cols-1 md:grid-cols-3 gap-8"
export const articleCardClass  = "bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
export const articleTitle      = "text-xl font-bold text-gray-900 mb-3"
export const articleExcerpt    = "text-gray-600 mb-6 flex-grow"
export const articleMeta       = "text-[#4F46E5] text-xs font-bold uppercase tracking-wider mb-2"
export const readMoreBtn       = "text-[#4F46E5] font-bold hover:text-[#4338CA] transition flex items-center"

// ─── Feedback ─────────────────────────────────────────
export const errorClass        = "mt-4 bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium border border-red-100"
export const successClass      = "bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 text-sm"
export const loadingClass      = "text-[#4F46E5]/60 text-sm animate-pulse text-center py-10"
export const emptyStateClass   = "text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center"

// ─── Divider ──────────────────────────────────────────
export const divider           = "border-t border-gray-200 my-10"

// ─── Glassmorphism / Effects ──────────────────────────
export const glassPanel        = "bg-white/70 backdrop-blur-xl border border-white/20 shadow-sm glassmorphism"
export const heroSection       = "bg-gradient-to-r from-orange-50 to-[#E0E7FF]/20 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden border border-orange-100/50"
export const fadeInUp          = "animate-fadeInUp"
export const hoverLift         = "transition transform hover:-translate-y-1"

// ─── Footer ───────────────────────────────────────────
export const footerClass       = "bg-[#1E293B] text-white pt-16 pb-8 border-t-4 border-[#4F46E5]"
export const footerContainer   = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
export const footerLinkClass   = "hover:text-[#4F46E5] transition text-gray-400 text-sm"
export const footerInputClass  = "w-full bg-white/10 text-white placeholder-gray-400 border border-transparent rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
