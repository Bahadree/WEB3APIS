"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import OAuthAuthorizeDemo from "../OAuthAuthorizeDemo";

export default function OAuthDocumentationPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const base = `/dev/project/${projectId}/oauth`;

  return (
    <>
      <h1 className="text-4xl font-bold text-center text-primary mb-8">
        OAuth Nedir?
      </h1>
      <div className="max-w-3xl mx-auto mb-12 text-lg text-foreground/90 bg-card border border-border rounded-2xl p-8 shadow">
        <p className="mb-4">
          <b>OAuth</b>, üçüncü parti uygulamaların kullanıcıların şifrelerini
          paylaşmadan, belirli izinler dahilinde kullanıcı verilerine erişmesini
          sağlayan modern bir yetkilendirme protokolüdür. Kullanıcı, uygulamaya
          hangi verilere erişebileceğini seçer ve bu erişim bir <b>token</b> ile
          güvenli şekilde sağlanır.
        </p>
        <p className="mb-4">
          <b>Nasıl çalışır?</b> Uygulama, OAuth ile bir <b>request token</b> alır,
          kullanıcıdan izin ister ve kullanıcı onay verirse bir <b>access token</b>
          ile belirlenen verilere erişebilir. Şifre paylaşımı gerekmez, erişim
          kapsamı (scope) ve süresi sınırlandırılabilir.
        </p>
        <p className="mb-4">
          <b>Nasıl kullanılır?</b> OAuth akışını başlatmak için şu adımları izleyin:
        </p>
        <ol className="mb-4 list-decimal pl-6">
          <li className="mb-2">
            API Key&apos;iniz ve gerekli izinler (scope) ile <b>Request Token</b>{' '}
            alın.
          </li>
          <li className="mb-2">
            Kullanıcıdan izin almak için request token ile izin ekranına{" "}
            yönlendirin.
          </li>
          <li className="mb-2">
            Kullanıcı izin verirse, <b>Access Token</b> alın.
          </li>
          <li className="mb-2">
            Access token ile, sadece izin verilen kullanıcı verilerine erişin.
          </li>
        </ol>
        <p className="mb-4">
          Aşağıdaki demo ile bu akışı adım adım test edebilirsiniz. Gerçek
          uygulamanızda bu işlemleri backend'inizden başlatmanız önerilir.
        </p>
      </div>
      <div className="max-w-2xl mx-auto mb-16">
        <OAuthAuthorizeDemo />
      </div>
      <h2 className="text-3xl font-bold text-center text-primary mb-8">
        Dokümantasyon Kategorileri
      </h2>
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 p-6">
        <Link
          href={`/dev/project/${projectId}/documentation/oauth`}
          legacyBehavior
        >
          <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-primary text-primary-foreground shadow-2xl text-3xl font-bold hover:bg-primary/80 transition border-4 border-primary focus:outline-none focus:ring-4 focus:ring-primary/30">
            <div>OAuth</div>
            <div className="mt-4 text-base font-normal text-primary-foreground/90 text-center px-2">
              OAuth akışını başlat, yetkilendirme ve token işlemlerini yönet.
            </div>
          </a>
        </Link>
        <Link href="#" legacyBehavior>
          <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
            2. API Key
          </a>
        </Link>
        <Link href="#" legacyBehavior>
          <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
            3. Kullanıcı
          </a>
        </Link>
        <Link href="#" legacyBehavior>
          <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
            4. Proje
          </a>
        </Link>
        <Link href="#" legacyBehavior>
          <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
            5. Scope
          </a>
        </Link>
        <Link href="#" legacyBehavior>
          <a className="flex flex-col items-center justify-center h-56 rounded-3xl bg-muted text-foreground shadow-2xl text-3xl font-bold hover:bg-accent/40 transition border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary/30">
            6. Ayarlar
          </a>
        </Link>
      </div>
      <pre className="bg-background p-3 rounded mb-2 overflow-x-auto">
        {'GET /dev/project/' + projectId + '/documentation/oauth'}
      </pre>
    </>
  );
}
