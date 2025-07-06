// Bu dosya sadece /dev/addons altında kullanılmalı, ana geliştirici paneli layout'undan kaldırıldı.

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
