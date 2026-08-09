export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-white px-6 py-12 text-center">
      <div className="content-wrapper flex flex-col items-center">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
          _BUILT_BY
        </p>
        <p className="font-bold text-lg mb-2">Indra W.</p>
        <div className="flex items-center gap-4 justify-center font-mono text-sm">
          <a
            href="https://www.instagram.com/ini.bin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            @ini.bin
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="https://www.linkedin.com/in/indra-wibowo/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
