import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24 gap-6'>
      <h1 className='text-4xl font-bold mb-8'>Choose Your Editor</h1>

      <div className='flex flex-col sm:flex-row gap-6'>
        <Link
          href='/monaco'
          className='px-8 py-4 text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center min-w-[200px]'
        >
          Monaco Editor
        </Link>

        <Link
          href='/codemirror'
          className='px-8 py-4 text-xl bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center min-w-[200px]'
        >
          CodeMirror
        </Link>
      </div>
    </main>
  );
}
