import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background min-h-dvh w-full">
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center gap-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
          SKICTF
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          Test your hacking skills, solve challenging puzzles, and compete in
          our Capture The Flag competition.
        </p>

        <p className="text-sm text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          {"SKICTF{H4ppy_H4ck1ng_H4ck3r!}"}
        </p>
      </main>

      <section className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Challenge Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 text-primary text-2xl">🔐</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              Cryptography
            </h3>
            <p className="text-muted-foreground">
              Break codes, decrypt messages, and master the art of secure
              communication.
            </p>
          </div>
          <div className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 text-primary text-2xl">🔎</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              Digital Forensics
            </h3>
            <p className="text-muted-foreground">
              {" "}
              Uncover, analyze, and recover hidden or deleted data from digital
              devices.
            </p>
          </div>
          <div className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 text-primary text-2xl">🌐</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              Web Exploitation
            </h3>
            <p className="text-muted-foreground">
              Discover and exploit vulnerabilities in web applications and
              services.
            </p>
          </div>
          <div className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 text-primary text-2xl">💻</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              Reverse Engineering
            </h3>
            <p className="text-muted-foreground">
              Analyze binaries, understand program flow, and uncover hidden
              functionality.
            </p>
          </div>
          <div className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 text-primary text-2xl">🛠️</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              Miscellaneous
            </h3>
            <p className="text-muted-foreground">
              Challenges that don't fit into a single category—think OSINT,
              scripting, steganography, and more!
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SKICTF
            </div>
            <div className="flex gap-8 text-muted-foreground">
              Made with 💓 by Colin from SMK Immanuel
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
