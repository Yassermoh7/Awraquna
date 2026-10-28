import { notFound } from 'next/navigation';

/** Catch-all for unknown URLs so they render the branded not-found page. */
export default function Missing() {
  notFound();
}
