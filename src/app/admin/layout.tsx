import Nav from "@/components/Nav";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-border text-center py-4">
        <LogoutButton />
      </footer>
    </>
  );
}
