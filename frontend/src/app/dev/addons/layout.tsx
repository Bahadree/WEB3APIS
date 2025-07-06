import AddonsMenu from "./AddonsMenu";

export default function AddonsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 p-6 border-r bg-white">
        <AddonsMenu />
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
