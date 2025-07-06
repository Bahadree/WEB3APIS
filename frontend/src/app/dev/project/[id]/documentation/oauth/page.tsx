"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import OAuthAuthorizeDemo from "../../oauth/OAuthAuthorizeDemo";

export default function OAuthDocsGrid() {
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
          <b>Nasıl kullanılır?</b> Aşağıdaki demo ile OAuth akışını test
          edebilirsiniz. Önce bir request token alın, ardından kullanıcıdan izin
          isteyin ve access token ile verilere erişin. Gerçek uygulamanızda bu
          akışı backend'inizden başlatmalısınız.
        </p>
      </div>
      <div className="max-w-2xl mx-auto mb-16">
        <OAuthAuthorizeDemo />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-primary mt-12">
        API Entegrasyon Adımları
      </h2>
      <div className="bg-muted p-4 rounded-xl border mb-8 text-sm">
        <b>1. Request Token Al</b>
        <pre className="bg-background p-3 rounded mb-2 overflow-x-auto">
          {`POST /api/oauth/request
Content-Type: application/json
{
  "apiKey": "&lt;PROJE_API_KEY&gt;"
}`}
        </pre>
        <b>2. Kullanıcıyı İzin Ekranına Yönlendir</b>
        <pre className="bg-background p-3 rounded mb-2 overflow-x-auto">
          {`GET /oauth/authorize?request_token=&lt;REQUEST_TOKEN&gt;`}
        </pre>
        <b>3. Access Token Al</b>
        <pre className="bg-background p-3 rounded mb-2 overflow-x-auto">
          {`POST /api/oauth/token
Content-Type: application/json
{
  "request_token": "&lt;REQUEST_TOKEN&gt;"
}`}
        </pre>
        <b>4. Kullanıcı Bilgisi Al</b>
        <pre className="bg-background p-3 rounded mb-2 overflow-x-auto">
          {`GET /api/oauth/userdata?access_token=&lt;ACCESS_TOKEN&gt;`}
        </pre>
        <div className="mt-2">
          <b>Örnek Kullanıcı Yanıtı:</b>
          <pre className="bg-background p-3 rounded overflow-x-auto">{`{
  "user": {
    "id": "...",
    "email": "...",
    "username": "...",
    "avatar_url": "..."
  }
}`}</pre>
        </div>
        <ul className="list-disc pl-6 mt-2">
          <li>
            Request token ve access token demo ortamında 3 dakikada bir alınabilir.
          </li>
          <li>Scope yönetimi ve izinler panelden ayarlanır.</li>
          <li>
            API anahtarınızı ve gizli bilgilerinizi kimseyle paylaşmayın.
          </li>
        </ul>
      </div>
    </>
  );
}
