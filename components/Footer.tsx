import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col gap-4 items-center justify-center py-8">
      <h1 className="font-semibold tracking-widest text-[180px] font-sans">
        Trace AI
      </h1>
      <div className="flex items-center gap-2 justify-center font-mono text-sm">
        <p>Developed with ❤️ by</p>
        <Link
          href="https://priime-portfolio.vercel.app/"
          className="uppercase font-semibold text-green-600 cursor-pointer duration-500 transition hover:text-green-700"
        >
          priime
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
