// app/[locale]/page.js
import { redirect } from 'next/navigation';

export default function Page({ params }) {
  redirect(`/${params.locale}/login`);
}
