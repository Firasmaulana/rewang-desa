import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cookies } from 'next/headers';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('rewang_auth');
  let user = null;

  if (authCookie) {
    try {
      user = JSON.parse(authCookie.value);
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="min-h-full flex flex-col bg-[#FDFBF7]">
      <Header user={user} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
