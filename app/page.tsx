import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/app/ui/home.module.css';
import clsx from 'clsx';
export const inter = Inter({ subsets: ['latin'] });


export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">


      <div className="mt-6 flex grow flex-col gap-6 md:flex-row md:gap-8">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <Image
          src="/logo.png"
          alt="AGS Student Council Logo"
          width={48}
          height={48}
          className="mr-3"
        />

          <p className="text-xl text-gray-800 md:text-3xl md:leading-tight">
            <strong>Welcome to AGS Student Council</strong><br />
           
          </p>
          <p>
             Requires an active member status of the Student Council. Contact the administration for more information.
          </p>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex items-center gap-3 self-start rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              Log in
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 self-start rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 md:text-base"
            >
              Dashboard
            </Link>
          </div>

          
        </div>

        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block rounded-lg shadow-md"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
        
      </div>
      
    </main>
  );
}
