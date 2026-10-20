import type { Metadata } from 'next';
import { LegalDocument } from '@/components/LegalDocument';
export const metadata: Metadata = { title: 'Cookie policy' };
export default function CookiePolicy() { return <LegalDocument title="Cookie policy" intro="This page explains how Boaz Drive uses cookies and local storage on this website, and how you can manage optional choices." sections={[
  { title: 'What cookies do', paragraphs: ['Cookies are small files stored by your browser. Similar browser storage can remember your privacy choice or support secure features. We use only what is needed for core site functions unless you choose optional categories.'] },
  { title: 'Cookie categories', paragraphs: ['Necessary storage supports basic site functions and cannot be disabled in the preference panel. Optional categories are used only according to your choice.'] , bullets: ['Functional, to remember useful preferences.', 'Analytics, to understand visits and improve the service.', 'Marketing, to measure or tailor promotional content.'] },
  { title: 'Your choice', paragraphs: ['The cookie banner lets you accept all optional categories or manage them individually. Your saved choice is stored in your browser under the key boaz_drive_consent. You can change your browser storage or revisit the preference control to update a choice.'] },
  { title: 'Kenya Data Protection Act', paragraphs: ['We aim to respect your privacy choices and handle personal data in accordance with Kenya’s Data Protection Act, 2019. Optional cookies should not be treated as permission to use information for unrelated purposes.'] },
]} />; }
