export const BackgroundGradients = () => (
  <>
    <div
      className="pointer-events-none absolute left-full top-0 -z-10 hidden aspect-square w-[800px] -translate-x-1/2 -translate-y-1/2 items-center justify-center dark:flex"
      aria-hidden="true"
    >
      <div className="translate-z-0 absolute inset-0 rounded-full bg-purple-500 opacity-30 blur-[120px]"></div>
      <div className="translate-z-0 absolute h-64 w-64 rounded-full bg-purple-400 opacity-70 blur-[80px]"></div>
    </div>

    <div
      className="pointer-events-none absolute right-full -z-10 -mt-16 hidden translate-x-full translate-y-full rotate-90 scale-[400%] opacity-90 blur-2xl dark:block"
      aria-hidden="true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="427">
        <defs>
          <linearGradient id="a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path fill="url(#a)" fillRule="evenodd" d="m403 0 461 369-284 58z" />
      </svg>
    </div>
  </>
);
