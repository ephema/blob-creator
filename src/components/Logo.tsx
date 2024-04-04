import Link from "next/link";
import Image from "next/image";
import EphemaLogo from "./logo.png";

export const Logo = () => (
  <div className="mb-4 flex items-center justify-center text-sm text-muted-foreground">
    <Link
      href="https://www.ephema.io"
      className="mx-2 flex items-center text-purple-500 transition-colors hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-400"
    >
      <Image
        src={EphemaLogo}
        alt="ephema logo"
        className="mr-2 h-8 w-8 translate-y-0.5"
      />
    </Link>
  </div>
);
